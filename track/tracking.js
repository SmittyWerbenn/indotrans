async function track() {
    const input = document.getElementById('resiInput').value.trim();
    const res = document.getElementById('result');
    
    if(!input) {
        res.innerHTML = "<p style='color: #ff6b6b; font-size: 0.9rem;'>Masukkan nomor resi terlebih dahulu.</p>";
        return;
    }

    // Animasi loading mutar
    res.innerHTML = "<i class='fas fa-circle-notch fa-spin' style='color: #C5A059; font-size: 1.5rem;'></i>";
    
    try {
        // Mengambil variabel global dari config.js
        const endpoint = `${API_CONFIG.DEV_HOST}/v2/tracking/awb/get?awb_no=${encodeURIComponent(input)}`;
        
        // Fetch data dari endpoint
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'api_key': API_CONFIG.API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Validasi format kembalian data 
        if (result.status === false || !result.data) {
            throw new Error(result.error || "Data resi tidak ditemukan di sistem.");
        }

        // Deklarasikan variabel berdasarkan struktur respon Tracking
        const trackingData = result.data[0] || result.data; 
        const currentStatus = trackingData.rowstate_web || trackingData.status || "ON PROCESS"; 
        const awbNo = trackingData.awb_no || input;
        const historyArray = trackingData.history || []; 

        let historyHtml = "";
        
        // Mapping riwayat paket
        if (historyArray.length > 0) {
            historyHtml = historyArray.map(item => {
                return `• ${item.date || item.created_at} - ${item.status || item.desc} <br>`;
            }).join('');
        } else {
            historyHtml = `• Status Saat Ini: ${currentStatus}<br>• Lokasi Terakhir: ${trackingData.branch_name || "Unknown"} (Deskripsi: ${trackingData.description || "-"})`;
        }

        // Render ke UI HTML
        res.innerHTML = `
            <div class="status-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="color: #C5A059; font-weight: 700;">#${awbNo.toUpperCase()}</span>
                    <span style="background: #C5A059; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">${currentStatus}</span>
                </div>
                <p style="margin: 0; font-size: 0.95rem; color: #eee;">Detail Tracking Order SAPX.</p>
                <div style="margin-top: 15px; border-top: 1px solid rgba(197,160,89,0.1); padding-top: 10px;">
                    <small style="color: #888; line-height: 1.8; display: block;">
                        ${historyHtml}
                    </small>
                </div>
            </div>`;
            
    } catch (error) {
        console.error("Tracking Error:", error);
        res.innerHTML = `
            <p style='color: #ff6b6b; font-size: 0.9rem;'>
                Gagal menemukan data resi <b>${input}</b>. <br>
                <span style='font-size:0.8rem; color:#aaa;'>Pesan: ${error.message}</span>
            </p>`;
    }
    
    // Scroll otomatis ke bawah
    const wrapper = document.querySelector('.main-wrapper');
    wrapper.scrollTo({ top: wrapper.scrollHeight, behavior: 'smooth' });
}

// Jalankan fungsi ketika tombol Enter ditekan pada input
document.getElementById("resiInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") track();
});