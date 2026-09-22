// Best-effort in-memory store (per warm instance; not persisted). Shared between the
// Calendly webhook receiver and the bookings viewer function.
const recentBookings = [];

function addBooking(booking) {
    recentBookings.unshift(booking);
    if (recentBookings.length > 50) {
        recentBookings.pop();
    }
}

function getBookings() {
    return recentBookings;
}

module.exports = { addBooking, getBookings };
