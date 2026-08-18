require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// ── Config ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const TREX_BASE_URL = process.env.TREX_BASE_URL || 'https://api.coresyssap.com';
const TREX_API_KEY = process.env.TREX_API_KEY;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Fail fast kalau API key tidak ada
if (!TREX_API_KEY) {
    console.error('\n❌ FATAL: TREX_API_KEY tidak ditemukan.');
    console.error('   Set variable TREX_API_KEY di .env file atau environment.\n');
    process.exit(1);
}

// ── Middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes: Static Pages ─────────────────────────────────────────────────
// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Tracking page (must be before express.static to avoid redirect)
app.get('/track', (req, res) => {
    res.sendFile(path.join(__dirname, 'track', 'index.html'));
});
app.get('/track/', (req, res) => {
    res.sendFile(path.join(__dirname, 'track', 'index.html'));
});

// ── Serve static files from project root ──────────────────────────────────
app.use(express.static(__dirname, {
    index: false,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|woff2?|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));
app.get('/api/track', async (req, res) => {
    const { awb_no, reference_no } = req.query;

    if (!awb_no && !reference_no) {
        return res.status(422).json({
            status: 'fail',
            message: 'Mohon masukkan nomor resi (awb_no) atau nomor referensi (reference_no)'
        });
    }

    // Build tracking query params
    const params = new URLSearchParams();
    if (awb_no) params.append('awb_no', awb_no);
    if (reference_no) params.append('reference_no', reference_no);

    const trexUrl = `${TREX_BASE_URL}/v2/shipment/tracking?${params.toString()}`;

    try {
        const response = await fetch(trexUrl, {
            method: 'GET',
            headers: {
                'api_key': TREX_API_KEY,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        });

        // Handle non-JSON responses (e.g. HTML error pages)
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            console.error(`[TREX] Non-JSON response (${response.status}):`, text.substring(0, 200));
            return res.status(502).json({
                status: 'fail',
                message: 'Server tracking mengembalikan response tidak valid. Coba lagi nanti.'
            });
        }

        const data = await response.json();

        // Enhance response
        if (data.status === 'success' && data.data && data.data.length > 0) {
            // Reverse so newest first
            data.data.reverse();

            // Extract summary from first entry
            const first = data.data[0];
            data.summary = {
                awb_no: first.awb_no,
                reference_no: first.reference_no,
                origin: first.origin || '-',
                destination: first.destination || '-',
                current_status: first.rowstate_web || first.rowstate_name || '-',
                service: first.service_type_code || '-',
                weight: first.kilo || '-',
                koli: first.koli || '-',
                last_update: first.create_date || '-',
                shipper: first.shipper_name || '-',
                receiver: first.receiver_name || '-'
            };
        }

        return res.json(data);

    } catch (err) {
        console.error('[TREX] Fetch error:', err.message);
        return res.status(502).json({
            status: 'fail',
            message: 'Gagal terhubung ke server tracking. Silakan coba lagi beberapa saat.'
        });
    }
});

// ── API: Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: NODE_ENV,
        trex_base_url: TREX_BASE_URL.replace(/\/\/.*@/, '//***@')  // hide credentials
    });
});

// ── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ status: 'fail', message: 'Endpoint tidak ditemukan' });
    }
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// ── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 T'REX Tracking Server running on http://localhost:${PORT}`);
    console.log(`📡 API: ${TREX_BASE_URL}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📍 Tracking page: http://localhost:${PORT}/track\n`);
});
