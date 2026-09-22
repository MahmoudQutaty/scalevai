const { app } = require('@azure/functions');
const SYSTEM_PROMPT = require('../../shared/vai-system-prompt');
const { isRateLimited } = require('../../shared/rate-limiter');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.http('chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'chat',
    handler: async (request, context) => {
        try {
            if (!OPENAI_API_KEY) {
                return { status: 500, jsonBody: { error: 'The assistant is not configured yet. Please configure your API key.' } };
            }

            const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
            if (isRateLimited(clientIp)) {
                return { status: 429, jsonBody: { error: 'Too many messages. Please wait a moment and try again.' } };
            }

            const body = await request.json().catch(() => null);
            const messages = body?.messages;
            if (!Array.isArray(messages) || messages.length === 0) {
                return { status: 400, jsonBody: { error: 'Invalid request.' } };
            }

            const trimmed = messages
                .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
                .slice(-10)
                .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

            const isPlaceholderKey = OPENAI_API_KEY.includes('your-') || OPENAI_API_KEY.includes('placeholder') || OPENAI_API_KEY.includes('here');
            if (isPlaceholderKey) {
                return { status: 502, jsonBody: { error: 'The assistant is temporarily unavailable. Please verify your API key settings.' } };
            }

            const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: OPENAI_MODEL,
                    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
                    max_tokens: 400,
                    temperature: 0.4,
                }),
            });

            if (!openaiRes.ok) {
                const errText = await openaiRes.text();
                context.warn('OpenAI API error:', openaiRes.status, errText);
                return {
                    status: 502,
                    jsonBody: {
                        error: 'The assistant is temporarily unavailable. Please verify your API key settings.',
                        debugStatus: openaiRes.status,
                        debugText: errText.slice(0, 300),
                        debugKeyTail: OPENAI_API_KEY.slice(-6),
                        debugKeyLen: OPENAI_API_KEY.length,
                    },
                };
            }

            const data = await openaiRes.json();
            const reply = data.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";
            return { jsonBody: { reply } };
        } catch (err) {
            context.error('Chat endpoint error:', err);
            return { status: 500, jsonBody: { error: 'Something went wrong. Please try again.' } };
        }
    }
});
