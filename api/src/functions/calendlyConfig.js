const { app } = require('@azure/functions');

const CALENDLY_URL = (process.env.CALENDLY_URL && !process.env.CALENDLY_URL.includes('new-meeting'))
    ? process.env.CALENDLY_URL
    : 'https://calendly.com/qutatym129/30min';
const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID || '';
const CALENDLY_WEBHOOK_SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || '';

app.http('calendlyConfig', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'calendly/config',
    handler: async () => ({
        jsonBody: {
            url: CALENDLY_URL || '',
            clientId: CALENDLY_CLIENT_ID || '',
            configured: Boolean(CALENDLY_URL && !CALENDLY_URL.includes('your-account')),
            webhookEnabled: Boolean(CALENDLY_WEBHOOK_SIGNING_KEY)
        }
    })
});
