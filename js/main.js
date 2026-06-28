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



    // 2. Event Listener ketika Custom Marker Terdeteksi oleh Kamera (markerFound)
    customMarker.addEventListener('markerFound', () => {
        console.log('Event: Marker ditemukan! Memunculkan panel biodata HTML...');
        
        // Memperbarui kelas styling pada Status Bar
        statusBar.classList.remove('status-searching');
        statusBar.classList.add('status-found');
        statusText.innerText = 'Marker Terdeteksi! Objek AR aktif';

        // Menampilkan panel biodata HTML di sebelah kiri layar
        const bioOverlay = document.getElementById('biodata-overlay');
        if (bioOverlay) {
            bioOverlay.classList.remove('hidden');
            bioOverlay.classList.add('visible');
        }

        // Memicu animasi masuk (scale-in) untuk bola mata monster 3D di atas marker
        const entranceElements = document.querySelectorAll('.entrance-element');
        entranceElements.forEach((element, index) => {
            if (element.entranceTimeout) {
                clearTimeout(element.entranceTimeout);
            }
            element.setAttribute('scale', '0 0 0');
            element.entranceTimeout = setTimeout(() => {
                element.emit('show-element');
            }, index * 100);
        });
    });

    // 3. Event Listener ketika Custom Marker Hilang dari Pandangan Kamera (markerLost)
    customMarker.addEventListener('markerLost', () => {
        console.log('Event: Marker hilang! Menyembunyikan panel biodata...');
        
        // Mengembalikan kelas styling ke status mencari
        statusBar.classList.remove('status-found');
        statusBar.classList.add('status-searching');
        statusText.innerText = 'Mencari marker...';

        // Menyembunyikan panel biodata HTML
        const bioOverlay = document.getElementById('biodata-overlay');
        if (bioOverlay) {
            bioOverlay.classList.remove('visible');
            bioOverlay.classList.add('hidden');
        }

        // Mereset skala semua elemen 3D menjadi 0
        const entranceElements = document.querySelectorAll('.entrance-element');
        entranceElements.forEach(element => {
            if (element.entranceTimeout) {
                clearTimeout(element.entranceTimeout);
            }
            element.setAttribute('scale', '0 0 0');
        });
    });
});
