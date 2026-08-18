// ============================================================
// Cloudflare Worker — Proxy untuk API Tracking T'REX
// Deploy di: Cloudflare Dashboard > Workers & Pages > Create
// 
// Set API_KEY di tab "Settings" > "Variables" (Environment Variable)
// JANGAN hardcode di sini.
// ============================================================

const ALLOWED_ORIGINS = [
  'https://indotrans.cloud',
  'http://localhost:3000',  // untuk development lokal
];

const UPSTREAM_API = 'https://api.coresyssap.com/v2/shipment';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'https://indotrans.cloud',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Hanya terima GET
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    const awb = url.searchParams.get('awb');

    if (!awb) {
      return new Response(JSON.stringify({ error: 'Parameter "awb" wajib diisi' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validasi format AWB (alphanumeric + dash, max 50 char)
    if (!/^[A-Za-z0-9\-]{1,50}$/.test(awb)) {
      return new Response(JSON.stringify({ error: 'Format AWB tidak valid' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // Proxy ke upstream API
      const upstream = await fetch(
        `${UPSTREAM_API}/tracking?awb_no=${encodeURIComponent(awb)}`,
        {
          headers: {
            'api_key': apiKey,
            'Accept': 'application/json',
          },
        }
      );

      const body = await upstream.json();

      // Enhance response: tambahkan summary (sama seperti server.js)
      if (body.status === 'success' && body.data && body.data.length > 0) {
        body.data.reverse();
        const first = body.data[0];
        body.summary = {
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
          receiver: first.receiver_name || '-',
        };
      }

      return new Response(JSON.stringify(body), {
        status: upstream.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',  // cache 1 menit
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ status: 'fail', message: 'Gagal menghubungi server tracking' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
