# Setup Google Search Console

Mengapa perlu Google Search Console (GSC):
- Submit sitemap.xml supaya Google crawl semua URL
- Monitor keyword ranking
- Lihat error crawl (404, 5xx, redirect loops)
- Manual index request untuk halaman baru
- Backlink monitor

## Step 1: Verifikasi Ownership

1. Buka https://search.google.com/search-console
2. Klik **Add Property** → masukkan `https://indotrans.cloud`
3. Pilih verification method: **HTML tag** (paling simpel)
4. Copy meta tag yang muncul, contoh:
   ```html
   <meta name="google-site-verification" content="abcdef123456" />
   ```
5. Taruh di `<head>` `index.html` baris yang ada comment ini:
   ```html
   <!-- <meta name="google-site-verification" content="VERIFICATION_CODE_DARI_GSC" /> -->
   ```
   Ubah menjadi:
   ```html
   <meta name="google-site-verification" content="abcdef123456" />
   ```
6. Push ke repo, tunggu 1-2 menit untuk deploy
7. Kembali ke GSC, klik **Verify**

## Step 2: Submit Sitemap

1. Setelah verified, di GSC pilih property `indotrans.cloud`
2. Klik **Sitemaps** (menu kiri)
3. Masukkan `https://indotrans.cloud/sitemap.xml`
4. Klik **Submit**

Status: Berhasil atau error (kalau error cek format sitemap).

## Step 3: Request Indexing

1. Menu kiri: **URL Inspection**
2. Masukkan `https://indotrans.cloud/`
3. Klik **Request Indexing**
4. Ulangi untuk `https://indotrans.cloud/track/`

Google biasanya proses dalam 1-7 hari.

## Step 4: Monitor Performance

Setelah 1-2 minggu, di menu **Performance**:
- Lihat query apa yang ngetrigger situs kamu muncul
- CTR (click-through rate)
- Average position

Jika "indotrans" muncul di position 30+, klik halaman detail → **Request Indexing** lagi.

## Step 5: Bing Webmaster Tools (Bonus)

Sama seperti Google, tapi untuk Bing:
- https://www.bing.com/webmasters
- Submit sitemap juga
- Bing → DuckDuckGo → Yahoo — jadi banyak search engine ter-cover

## Backlink Strategy (Long-term)

Untuk naik ranking, butuh backlinks. Beberapa cara:

1. **Social media** — Instagram `indotrans_express` (sudah ada, link ke indotrans.cloud)
2. **LinkedIn company page** — buat + link ke indotrans.cloud
3. **Business listings**:
   - Google Business Profile (kalau punya toko fisik)
   - Yellow Pages Indonesia
   - Tokopedia, Shopee (kalau jualan)
4. **Industry directories**:
   - ALFI (Asosiasi Logistik & Forwarder Indonesia)
   - INSA (Indonesian National Shipowners Association)
5. **Press release** — link dari situs berita
6. **Blog guest posting** — di blog logistik Indonesia

## Local SEO Quick Wins

1. **Google Business Profile** — kalau ada kantor cabang, daftarkan di GMB
2. **NAP consistency** — pastikan Name, Address, Phone sama di semua listing
   - Name: `PT Indotrans Express Logistics`
   - Address: `Gedung Wirausaha Lt 1 Unit 104, Jl. HR Rasuna Said Kav. C-5, Jakarta Selatan 12920`
   - Phone: `+62 812 9997 8937`
3. **Review** — minta customer kasih review di Google (kalau ada GBP)

## Tracking Kenaikan Ranking

Cara cek manual posisi "indotrans" di Google:
```
site:indotrans.cloud "indotrans"
```
Atau install browser extension "SEOquake" untuk lihat position.

Alternatif: pakai Google Search Console **Performance** → filter query "indotrans".

## Quick Reference

- **Sitemap URL**: https://indotrans.cloud/sitemap.xml
- **Robots.txt**: https://indotrans.cloud/robots.txt
- **Security.txt**: https://indotrans.cloud/.well-known/security.txt
- **Google Test**: https://search.google.com/test/rich-results?url=https://indotrans.cloud/
- **Schema Validator**: https://validator.schema.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/report?url=https://indotrans.cloud
