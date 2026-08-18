# Panduan Deploy — Fix API Key Leak

## Masalah
API key coresyssap.com ter-expose di `https://indotrans.cloud/track/config.js`.
Siapapun bisa lihat dan pakai key-nya.

## Solusi
Pakai Cloudflare Worker sebagai proxy. Frontend cuma panggil worker,
worker yang forward ke API dengan key disembunyikan.

---

## Step 1: Install Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler
wrangler login
```

## Step 2: Deploy Worker

```bash
cd worker
wrangler deploy

# Set API key sebagai secret (TARUH DI SINI, BUKAN DI CODE)
wrangler secret put API_KEY
# Masukkan API key dari .env / dashboard coresyssap.com
```

Worker akan deployed ke: `https://indotrans-tracking-proxy.<USERNAME>.workers.dev`

Catat URL worker, ganti `<USERNAME>` dengan username Cloudflare kamu.

## Step 3: Test Worker

```bash
curl "https://indotrans-tracking-proxy.<USERNAME>.workers.dev?awb=TEST123"
```

Harusnya dapat response JSON (atau 404 dari coresyssap untuk AWB invalid).

## Step 4: Update config.js di repo

Edit `track/config.js`, ganti `<USERNAME>` dengan username Cloudflare:

```javascript
const TRACKING_CONFIG = {
    API_BASE: 'https://indotrans-tracking-proxy.<USERNAME>.workers.dev',
    API_KEY: null,
    DIRECT: true
};
```

## Step 5: Commit & Push

```bash
git add track/config.js track/index.html worker/
git commit -m "fix: pindah API key ke Cloudflare Worker proxy"
git push
```

GitHub Pages akan rebuild otomatis (1-2 menit).

---

## Verifikasi

1. Buka https://indotrans.cloud/track/config.js
   - Harusnya TIDAK ada API key

2. Buka https://indotrans.cloud/track/
   - Masukkan resi, klik LACAK
   - Harusnya tetap jalan normal

3. Test CORS dari browser console di domain lain:
   ```javascript
   fetch('https://indotrans-tracking-proxy.<USERNAME>.workers.dev?awb=TEST')
   ```
   - Harusnya dapat CORS error

---

## Arsitektur Sesudah

```
User Browser
    │
    ├── GET https://indotrans.cloud/track/config.js
    │   └── API_BASE: worker URL (no key)
    │
    ├── GET https://indotrans-tracking-proxy.<USERNAME>.workers.dev?awb=XXX
    │   │
    │   └── Worker (Cloudflare)
    │       ├── Cek origin (hanya izinkan indotrans.cloud)
    │       ├── Inject API key dari env variable
    │       └── Forward ke api.coresyssap.com/v2/shipment/tracking
    │
    └── Response ke user (tanpa key)
```

## Opsi Lanjutan: Custom Domain

Supaya lebih rapi, tambahkan custom domain di Cloudflare:

1. Cloudflare Dashboard > Workers > indotrans-tracking-proxy > Settings
2. Add Custom Domain: `api.indotrans.cloud`
3. Update `track/config.js`: `API_BASE: 'https://api.indotrans.cloud'`

---

## Catatan Keamanan

- API key tetap sama (tidak di-rotate). Worker tetap pakai key yang sama dari env.
- Yang berubah: key TIDAK PERNAH sampai ke browser user.
- Server.js (backend) sekarang fail-fast kalau env var tidak ada, tidak fallback ke hardcoded.
- `.env.example` cuma placeholder, bukan key asli.
