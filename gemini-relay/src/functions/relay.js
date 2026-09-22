const { app } = require('@azure/functions');
const { timingSafeEqual } = require('crypto');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
const RELAY_SHARED_SECRET = process.env.RELAY_SHARED_SECRET;

function hasValidSecret(request) {
    const providedSecret = request.headers.get('x-relay-secret') || '';
    if (!RELAY_SHARED_SECRET || providedSecret.length !== RELAY_SHARED_SECRET.length) {
        return false;
    }

    return timingSafeEqual(Buffer.from(providedSecret), Buffer.from(RELAY_SHARED_SECRET));
}

app.http('geminiRelay', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'chat',
    handler: async (request, context) => {
        if (!hasValidSecret(request)) {
            return { status: 401, jsonBody: { error: 'Unauthorized.' } };
        }

        if (!GEMINI_API_KEY) {
            context.error('GEMINI_API_KEY is not configured.');
            return { status: 500, jsonBody: { error: 'Assistant configuration is unavailable.' } };
        }

        const body = await request.json().catch(() => null);
        if (!Array.isArray(body?.messages) || typeof body?.systemPrompt !== 'string') {
            return { status: 400, jsonBody: { error: 'Invalid request.' } };
        }

        const contents = body.messages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
        }));

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        systemInstruction: { parts: [{ text: body.systemPrompt }] },
                        generationConfig: {
                            maxOutputTokens: 400,
                            temperature: 0.4,
                            thinkingConfig: { thinkingBudget: 0 },
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                context.warn('Gemini API error:', response.status, errorText);
                return { status: 502, jsonBody: { error: 'The assistant is temporarily unavailable.' } };
            }

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            return { jsonBody: { reply: reply || "I'm sorry, I couldn't generate a response." } };
        } catch (error) {
            context.error('Gemini relay error:', error);
            return { status: 502, jsonBody: { error: 'The assistant is temporarily unavailable.' } };
        }
    },
});