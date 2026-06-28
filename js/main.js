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
});
