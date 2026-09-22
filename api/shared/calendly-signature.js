const crypto = require('crypto');

// Verifies the `Calendly-Webhook-Signature` header (t=<timestamp>,v1=<hmac>) against the raw request body.
// Shared by the local Express server and the Azure Functions webhook handler.
function verifyCalendlySignature(rawBody, header, signingKey) {
    if (!header || !signingKey) return false;
    try {
        const parts = header.split(',');
        let t = '';
        let v1 = '';
        for (const part of parts) {
            const [k, v] = part.split('=');
            if (k && k.trim() === 't') t = v ? v.trim() : '';
            if (k && k.trim() === 'v1') v1 = v ? v.trim() : '';
        }
        if (!t || !v1) return false;

        const payload = `${t}.${rawBody}`;
        const expected = crypto.createHmac('sha256', signingKey).update(payload).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(v1, 'hex'));
    } catch (err) {
        console.error('Error verifying Calendly webhook signature:', err.message);
        return false;
    }
}

module.exports = { verifyCalendlySignature };
