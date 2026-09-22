require('dotenv').config();
const express = require('express');
const path = require('path');
const SYSTEM_PROMPT = require('./api/shared/vai-system-prompt');
const { verifyCalendlySignature } = require('./api/shared/calendly-signature');
const { isRateLimited } = require('./api/shared/rate-limiter');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Calendly configurations
const CALENDLY_URL = (process.env.CALENDLY_URL && !process.env.CALENDLY_URL.includes('new-meeting'))
    ? process.env.CALENDLY_URL
    : 'https://calendly.com/qutatym129/30min';
const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID || '';
const CALENDLY_CLIENT_SECRET = process.env.CALENDLY_CLIENT_SECRET || '';
const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || '';

// Store recent bookings in memory
const recentBookings = [];

app.use(express.json({
    limit: '200kb',
    verify: (req, res, buf) => {
        req.rawBody = buf ? buf.toString() : '';
    }
}));
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'The assistant is not configured yet. Please configure your API key.' });
        }

        if (isRateLimited(req.ip)) {
            return res.status(429).json({ error: 'Too many messages. Please wait a moment and try again.' });
        }

        const { messages } = req.body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Invalid request.' });
        }

        // Only forward well-formed, recent turns with a length cap.
        const trimmed = messages
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

        let reply = "";
        let responded = false;

        const isPlaceholderKey = !OPENAI_API_KEY || OPENAI_API_KEY.includes('your-') || OPENAI_API_KEY.includes('placeholder') || OPENAI_API_KEY.includes('here');

        if (OPENAI_API_KEY && !isPlaceholderKey) {
            try {
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

                if (openaiRes.ok) {
                    const data = await openaiRes.json();
                    reply = data.choices?.[0]?.message?.content?.trim() || "I'm sorry, I couldn't generate a response.";
                    responded = true;
                } else {
                    const errText = await openaiRes.text();
                    console.warn('OpenAI API error:', openaiRes.status, errText);
                }
            } catch (err) {
                console.warn('OpenAI request failed:', err);
            }
        }

        if (!responded) {
            return res.status(502).json({ error: 'The assistant is temporarily unavailable. Please verify your API key settings.' });
        }

        res.json({ reply });
    } catch (err) {
        console.error('Chat endpoint error:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// Calendly public config for frontend
app.get('/api/calendly/config', (req, res) => {
    res.json({
        url: CALENDLY_URL || '',
        clientId: CALENDLY_CLIENT_ID || '',
        configured: Boolean(CALENDLY_URL && !CALENDLY_URL.includes('your-account')),
        webhookEnabled: Boolean(CALENDLY_WEBHOOK_SIGNING_KEY)
    });
});

// Calendly Webhook Receiver
app.post('/api/calendly/webhook', (req, res) => {
    const signatureHeader = req.headers['calendly-webhook-signature'];
    
    // If a webhook signing key is configured, verify the signature
    if (CALENDLY_WEBHOOK_SIGNING_KEY) {
        const isValid = verifyCalendlySignature(req.rawBody, signatureHeader, CALENDLY_WEBHOOK_SIGNING_KEY);
        if (!isValid) {
            console.warn('Calendly webhook signature verification failed');
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }
    }

    const { event, payload } = req.body || {};
    console.log(`[Calendly Webhook] Received event: ${event}`);

    if (payload) {
        const invitee = payload.invitee || payload;
        const booking = {
            id: invitee.uuid || payload.event || Date.now().toString(),
            event: event || 'booking',
            name: invitee.name || payload.name || 'Anonymous',
            email: invitee.email || payload.email || '',
            status: invitee.status || payload.status || 'active',
            startTime: payload.scheduled_event?.start_time || payload.event_start_time || '',
            endTime: payload.scheduled_event?.end_time || payload.event_end_time || '',
            eventName: payload.scheduled_event?.name || payload.event_type?.name || 'Discovery Call',
            createdAt: new Date().toISOString(),
            raw: payload
        };

        recentBookings.unshift(booking);
        if (recentBookings.length > 50) {
            recentBookings.pop();
        }

        console.log(`[Calendly Webhook] Processed ${event} for ${booking.name} (${booking.email})`);
    }

    res.status(200).json({ received: true });
});

// View recent bookings
app.get('/api/calendly/bookings', (req, res) => {
    res.json({
        total: recentBookings.length,
        bookings: recentBookings
    });
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`ScaleVAI site + VAI assistant running at http://0.0.0.0:${PORT}`);
    });
}

module.exports = app;
