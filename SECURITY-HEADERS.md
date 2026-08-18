# Security Headers — Setup via Cloudflare Transform Rules

## Apa
Menambahkan HTTP security headers ke semua response `indotrans.cloud`:

- `X-Frame-Options: DENY` — anti-clickjacking
- `X-Content-Type-Options: nosniff` — anti-MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — privacy
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` — HSTS
- `Permissions-Policy: geolocation=(), camera=(), microphone=()` — disable fitur browser
- `Content-Security-Policy: ...` — control resource loading

## Cara (5 menit)

1. Login ke https://dash.cloudflare.com
2. Pilih domain **indotrans.cloud**
3. Klik **Rules** (kiri menu) → **Transform Rules**
4. Klik tab **Modify Response Header**
5. Klik **Create rule**
6. Setting:
   - **Rule name:** `Add security headers`
   - **Match:** `All incoming requests`
   - **Action:** `Set static` headers

   Akan ada form untuk tambah custom header. Tambah satu-satu:

   | Header name | Value |
   |-------------|-------|
   | `X-Frame-Options` | `DENY` |
   | `X-Content-Type-Options` | `nosniff` |
   | `Referrer-Policy` | `strict-origin-when-cross-origin` |
   | `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
   | `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` |
   | `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self' https://indotrans-tracking-proxy.indotrans-tracking.workers.dev; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` |

7. Klik **Deploy**

## Verifikasi

Setelah deploy, cek via https://securityheaders.com atau:

```bash
curl -sI https://indotrans.cloud | grep -iE "(frame|content-type|referrer|transport|policy)"
```

Harusnya muncul semua header di atas.

## Catatan CSP

CSP di atas agak permissive (allow `unsafe-inline` dan `cdnjs.cloudflare.com`).
Kalau mau strict, perlu audit semua script yang dipakai:

- `https://cdnjs.cloudflare.com` — Font Awesome
- `https://unpkg.com` — AOS (animasi scroll)
- `https://fonts.googleapis.com` & `https://fonts.gstatic.com` — Google Fonts
- `unsafe-inline` — untuk script inline di HTML

Untuk sekarang, leave as permissive dulu. Bisa di-tighten nanti.
