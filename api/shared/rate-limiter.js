// Best-effort in-memory rate limiter (per warm instance; resets on cold start/restart).
// Shared by the local Express server and the Azure Functions chat handler.
const requestLog = new Map();

function isRateLimited(ip, { windowMs = 60 * 1000, maxRequests = 15 } = {}) {
    const now = Date.now();
    const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < windowMs);
    timestamps.push(now);
    requestLog.set(ip, timestamps);
    return timestamps.length > maxRequests;
}

module.exports = { isRateLimited };
