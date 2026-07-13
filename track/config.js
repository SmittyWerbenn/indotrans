/**
 * T'REX Tracking — Backend URL Configuration
 * 
 * Untuk GitHub Pages tanpa backend: panggil SAPX API langsung.
 * API key dev (non-production) — ganti ke backend proxy sebelum production.
 * 
 * Kalau sudah deploy backend ke Render/Railway:
 *   API_BASE: 'https://indotrans-tracking.onrender.com/api'
 * 
 * Untuk development lokal:
 *   API_BASE: '/api'
 */
const TRACKING_CONFIG = {
    // ── Langsung ke SAPX dev API (untuk GitHub Pages tanpa backend) ──
    API_BASE: 'https://apisanbox.coresyssap.com/v2/shipment',
    API_KEY: 'DEV_m4rK3tPlac3#_2019',
    DIRECT: true  // true = panggil SAPX langsung, false = lewat proxy backend
};
