/**
 * T'REX Tracking — Backend URL Configuration
 * 
 * Sekarang pakai Cloudflare Worker sebagai proxy.
 * API key TIDAK ADA di sini — aman di server Cloudflare.
 * 
 * Untuk development lokal (jalankan server.js):
 *   API_BASE: '/api', DIRECT: false
 * 
 * Untuk production (pakai Worker):
 *   API_BASE: 'https://indotrans-tracking-proxy.<SUBDOMAIN>.workers.dev'
 *   DIRECT: true
 */
const TRACKING_CONFIG = {
    // ── Ganti <SUBDOMAIN> setelah deploy worker (lihat PANDUAN-DEPLOY.md) ──
    API_BASE: 'https://indotrans-tracking-proxy.smitty.workers.dev',
    API_KEY: null,   // <-- tidak ada key di frontend, sudah aman
    DIRECT: true     // true = panggil proxy, false = lewat server.js
};
