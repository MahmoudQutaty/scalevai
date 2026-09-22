const { app } = require('@azure/functions');
const { verifyCalendlySignature } = require('../../shared/calendly-signature');
const { addBooking } = require('../../shared/recent-bookings');

const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || '';

app.http('calendlyWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'calendly/webhook',
    handler: async (request, context) => {
        const rawBody = await request.text();
        const signatureHeader = request.headers.get('calendly-webhook-signature');

        if (CALENDLY_WEBHOOK_SIGNING_KEY) {
            const isValid = verifyCalendlySignature(rawBody, signatureHeader, CALENDLY_WEBHOOK_SIGNING_KEY);
            if (!isValid) {
                context.warn('Calendly webhook signature verification failed');
                return { status: 401, jsonBody: { error: 'Invalid webhook signature' } };
            }
        }

        const parsed = rawBody ? JSON.parse(rawBody) : {};
        const { event, payload } = parsed || {};
        context.log(`[Calendly Webhook] Received event: ${event}`);

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

            addBooking(booking);
            context.log(`[Calendly Webhook] Processed ${event} for ${booking.name} (${booking.email})`);
        }

        return { status: 200, jsonBody: { received: true } };
    }
});
