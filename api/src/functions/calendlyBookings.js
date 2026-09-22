const { app } = require('@azure/functions');
const { getBookings } = require('../../shared/recent-bookings');

app.http('calendlyBookings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'calendly/bookings',
    handler: async () => {
        const bookings = getBookings();
        return { jsonBody: { total: bookings.length, bookings } };
    }
});
