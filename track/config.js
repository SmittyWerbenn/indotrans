/**
 * T'REX Tracking — Backend URL Configuration
 * 
 * Production: panggil API tracking langsung.
 * 
 * Untuk development lokal:
 *   API_BASE: '/api'
 */
const TRACKING_CONFIG = {
    // ── Langsung ke API production ──
    API_BASE: 'https://api.coresyssap.com/v2/shipment',
    API_KEY: 'REDACTED',
    DIRECT: true  // true = panggil API langsung, false = lewat proxy backend
};
