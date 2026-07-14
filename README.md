# 🦖 T'REX Logistics — Shipment Tracking

Sistem pelacakan pengiriman real-time menggunakan API T'REX.

## 📁 Struktur Project

```
indotrans-main/
├── index.html           # Landing page T'REX Logistics
├── server.js            # Backend Node.js (proxy API)
├── package.json         # Dependencies
├── .env                 # Environment variables (API key disimpan di sini)
├── .env.example         # Template .env
├── track/
│   ├── index.html       # Halaman tracking (frontend)
│   └── config.js        # Konfigurasi backend URL
├── favicon.png
└── trex.jpeg
```

## 🚀 Cara Menjalankan (Development Lokal)

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server
npm start
# atau
node server.js

# 3. Buka browser
# Landing page:  http://localhost:3000
# Tracking page: http://localhost:3000/track
```

Server akan berjalan di `http://localhost:3000` dan otomatis mem-proxy request ke API T'REX.

## 🔧 Konfigurasi .env

Copy `.env.example` ke `.env` dan sesuaikan:

```env
TREX_BASE_URL=https://apisanbox.coresyssap.com   # Staging
# TREX_BASE_URL=https://api.coresyssap.com         # Production
TREX_API_KEY=DEV_m4rK3tPlac3#_2019
PORT=3000
```

## 📦 Deploy ke Production

### Opsi A: Deploy Backend + Frontend (Rekomendasi)

Deploy backend ke **Render** (gratis):

1. Push project ke GitHub
2. Buka [render.com](https://render.com) → New Web Service
3. Connect repo, set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: copy dari `.env`
4. Dapatkan URL misal `https://indotrans-tracking.onrender.com`

Deploy frontend ke **GitHub Pages**:

1. Edit `track/config.js`, ganti `API_BASE` ke URL Render:
   ```js
   API_BASE: 'https://indotrans-tracking.onrender.com/api'
   ```
2. Di GitHub repo → Settings → Pages → Source: Deploy from branch (main, /root)
3. Website live di `https://<user>.github.io/<repo>/`

### Opsi B: Full di Render (Paling Simpel)

Deploy project ini langsung ke Render seperti Opsi A. Frontend dan backend jalan di satu server yang sama. Gak perlu GitHub Pages terpisah.

### Opsi C: Netlify (Functions)

Copy `netlify.toml` ke root project, deploy ke Netlify. Fungsi serverless akan handle proxy API.

## 📋 API Endpoints

| Method | Path | Keterangan |
|--------|------|------------|
| GET | `/api/track?awb_no=xxx` | Tracking berdasarkan nomor AWB |
| GET | `/api/track?reference_no=xxx` | Tracking berdasarkan nomor referensi |
| GET | `/api/health` | Health check server |

## 🧪 Testing

Contoh nomor resi untuk testing (development server):

- `DEV00205046460` — tracking development server
- `test-001` — nomor kustom (jika sudah didaftarkan di T'REX)

## 🔐 Keamanan

- API key disimpan di `.env` (tidak di-commit ke git)
- Backend bertindak sebagai proxy — API key tidak terekspos ke frontend
- File `.env` sudah di-ignore lewat `.gitignore`
