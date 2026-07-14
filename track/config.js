/**
 * T'REX Tracking — Backend URL Configuration
 * 
 * Production: panggil SAPX API langsung.
 * 
 * Untuk development lokal:
 *   API_BASE: '/api'
 */
const TRACKING_CONFIG = {
    // ── Langsung ke SAPX production API ──
    API_BASE: 'https://api.coresyssap.com/v2/shipment',
    API_KEY: 'REDACTED',
    DIRECT: true  // true = panggil SAPX langsung, false = lewat proxy backend
};
