async function track() {
    const resiInput = document.getElementById("resiInput").value.trim();
    const resultDiv = document.getElementById("result");
    const trackBtn = document.getElementById("trackBtn");

    if (!resiInput) {
        resultDiv.innerHTML = `<div class="error-card"><i class="fas fa-exclamation-circle"></i> Tolong masukkan nomor resi terlebih dahulu!</div>`;
        return;
    }

    // Ubah text tombol saat loading
    trackBtn.disabled = true;
    trackBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    resultDiv.innerHTML = `<div style="opacity:0.7;"><i class="fas fa-circle-notch fa-spin"></i> Mencari paket Anda...</div>`;

    try {
        // Tembak API menggunakan data dari config.js
        const response = await fetch(`${API_CONFIG.BASE_URL}?awb_no=${encodeURIComponent(resiInput)}`, {
            method: 'GET',
            headers: {
                'api_key': API_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === "success" && result.data && result.data.length > 0) {
            
            // Urutkan status agar yang terbaru (paling atas) muncul duluan
            const trackingData = result.data.reverse();
            
            let timelineHtml = `<div class="timeline">`;
            
            trackingData.forEach((item, index) => {
                // Beri penanda khusus 'active' (warna hijau) untuk status paling update
                const isActive = index === 0 ? 'active' : '';
                const description = item.description ? item.description : 'Tidak ada catatan tambahan.';

                timelineHtml += `
                    <div class="timeline-item ${isActive}">
                        <div class="timeline-icon"></div>
                        <div class="timeline-date"><i class="far fa-clock"></i> ${item.create_date}</div>
                        <div class="timeline-status">${item.rowstate_name} (${item.rowstate_web})</div>
                        <div class="timeline-desc">${description}</div>
                    </div>
                `;
            });

            timelineHtml += `</div>`;
            resultDiv.innerHTML = timelineHtml;

        } else {
            // Jika resi tidak ditemukan
            resultDiv.innerHTML = `
                <div class="error-card">
                    <i class="fas fa-search-minus"></i> Nomor resi <strong>"${resiInput}"</strong> tidak ditemukan atau belum ter-update.
                </div>`;
        }

    } catch (error) {
        console.error("Tracking Error:", error);
        resultDiv.innerHTML = `
            <div class="error-card">
                <i class="fas fa-wifi"></i> Gagal terhubung ke server. Silakan cek koneksi internet Anda.
            </div>`;
    } finally {
        // Kembalikan status tombol
        trackBtn.disabled = false;
        trackBtn.innerHTML = "TRACK";
    }
}

// Fitur tambahan: Tekan 'Enter' di keyboard langsung jalanin tracking
document.getElementById("resiInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        track();
    }
});
