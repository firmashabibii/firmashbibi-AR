/**
 * Kartu Nama Interaktif WebAR
 * Logika UI untuk Deteksi Marker Kustom
 * 
 * File ini memisahkan logika UI dari file HTML utama untuk menjaga modularitas.
 * Menangani event 'markerFound' dan 'markerLost' dari framework AR.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mengambil referensi elemen DOM yang diperlukan
    const customMarker = document.getElementById('custom-marker');
    const statusBar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');

    // Validasi dasar untuk memastikan elemen-elemen di atas tersedia di halaman
    if (!customMarker || !statusBar || !statusText) {
        console.error('Inisialisasi Gagal: Beberapa elemen UI tidak ditemukan.');
        return;
    }

    console.log('Sistem WebAR terinisialisasi. Menunggu pemindaian marker kustom...');

    // Fungsi pembantu untuk menggambar rounded rectangle pada canvas 2D
    const drawRoundedRect = (canvasId, fillColor, radiusValue) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(radiusValue, 0);
        ctx.lineTo(width - radiusValue, 0);
        ctx.quadraticCurveTo(width, 0, width, radiusValue);
        ctx.lineTo(width, height - radiusValue);
        ctx.quadraticCurveTo(width, height, width - radiusValue, height);
        ctx.lineTo(radiusValue, height);
        ctx.quadraticCurveTo(0, height, 0, height - radiusValue);
        ctx.lineTo(0, radiusValue);
        ctx.quadraticCurveTo(0, 0, radiusValue, 0);
        ctx.closePath();
        ctx.fill();
    };

    // Menggambar tekstur tombol bersudut melengkung (radius 18px dan 20px agar proporsional)
    drawRoundedRect('button-bg-canvas', '#0c0c0c', 18);
    drawRoundedRect('button-border-canvas', '#ff0022', 20);
    
    // Menggambar tekstur strip penjelasan bersudut melengkung (radius 12px dan 14px agar proporsional)
    drawRoundedRect('strip-bg-canvas', '#0c0c0c', 12);
    drawRoundedRect('strip-border-canvas', '#ff0022', 14);

    // 2. Event Listener ketika Custom Marker Terdeteksi oleh Kamera (markerFound)
    customMarker.addEventListener('markerFound', () => {
        console.log('Event: Marker ditemukan!');
        
        // Memperbarui kelas styling pada Status Bar
        statusBar.classList.remove('status-searching');
        statusBar.classList.add('status-found');
        
        // Memperbarui teks pesan
        statusText.innerText = 'Marker Terdeteksi! Objek AR aktif';
    });

    // 3. Event Listener ketika Custom Marker Hilang dari Pandangan Kamera (markerLost)
    customMarker.addEventListener('markerLost', () => {
        console.log('Event: Marker hilang!');
        
        // Mengembalikan kelas styling ke status mencari
        statusBar.classList.remove('status-found');
        statusBar.classList.add('status-searching');
        
        // Mengembalikan teks pesan ke pencarian default
        statusText.innerText = 'Mencari marker...';
    });

    // 4. Menangani interaksi klik pada tombol tautan 3D (.clickable) di WebAR
    const clickables = document.querySelectorAll('.clickable');
    clickables.forEach(element => {
        element.addEventListener('click', (event) => {
            // Mengambil URL dari atribut data-url elemen yang diklik
            const url = event.currentTarget.getAttribute('data-url') || event.target.getAttribute('data-url');
            if (url) {
                console.log(`Membuka tautan eksternal: ${url}`);
                // Membuka tautan di tab baru secara aman
                window.open(url, '_blank');
            }
        });
    });
});
