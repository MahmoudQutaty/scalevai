const { app } = require('@azure/functions');
const SYSTEM_PROMPT = require('../../shared/vai-system-prompt');
const { isRateLimited } = require('../../shared/rate-limiter');
const { callGemini } = require('../../shared/gemini-client');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

app.http('chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'chat',
    handler: async (request, context) => {
        try {
            if (!GEMINI_API_KEY) {
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

            const isPlaceholderKey = GEMINI_API_KEY.includes('your-') || GEMINI_API_KEY.includes('placeholder') || GEMINI_API_KEY.includes('here');
            if (isPlaceholderKey) {
                return { status: 502, jsonBody: { error: 'The assistant is temporarily unavailable. Please verify your API key settings.' } };
            }

            const result = await callGemini({
                apiKey: GEMINI_API_KEY,
                model: GEMINI_MODEL,
                systemPrompt: SYSTEM_PROMPT,
                messages: trimmed,
            });

            if (!result.ok) {
                context.warn('Gemini API error:', result.status, result.errText);
                return {
                    status: 502,
                    jsonBody: {
                        error: 'The assistant is temporarily unavailable. Please verify your API key settings.',
                        debugStatus: result.status,
                        debugText: (result.errText || '').slice(0, 300),
                    },
                };
            }

            return { jsonBody: { reply: result.reply } };
        } catch (err) {
            context.error('Chat endpoint error:', err);
            return { status: 500, jsonBody: { error: 'Something went wrong. Please try again.' } };
        }
    }
});

