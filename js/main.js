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
        console.log('Event: Marker ditemukan! Memulai animasi masuk berurutan...');
        
        // Memperbarui kelas styling pada Status Bar
        statusBar.classList.remove('status-searching');
        statusBar.classList.add('status-found');
        
        // Memperbarui teks pesan
        statusText.innerText = 'Marker Terdeteksi! Objek AR aktif';

        // Memicu animasi masuk berurutan (staggered entrance) untuk setiap komponen melayang
        const entranceElements = document.querySelectorAll('.entrance-element');
        entranceElements.forEach((element, index) => {
            // Bersihkan timeout sebelumnya jika ada agar tidak bentrok
            if (element.entranceTimeout) {
                clearTimeout(element.entranceTimeout);
            }
            
            // Atur skala awal ke 0 0 0
            element.setAttribute('scale', '0 0 0');
            
            // Jalankan animasi masuk dengan jeda bertahap (150 milidetik per elemen)
            element.entranceTimeout = setTimeout(() => {
                element.emit('show-element');
            }, index * 150);
        });
    });

    // 3. Event Listener ketika Custom Marker Hilang dari Pandangan Kamera (markerLost)
    customMarker.addEventListener('markerLost', () => {
        console.log('Event: Marker hilang! Mereset animasi...');
        
        // Mengembalikan kelas styling ke status mencari
        statusBar.classList.remove('status-found');
        statusBar.classList.add('status-searching');
        
        // Mengembalikan teks pesan ke pencarian default
        statusText.innerText = 'Mencari marker...';

        // Mereset skala semua elemen menjadi 0 agar animasi terulang dari awal saat marker terdeteksi lagi
        const entranceElements = document.querySelectorAll('.entrance-element');
        entranceElements.forEach(element => {
            if (element.entranceTimeout) {
                clearTimeout(element.entranceTimeout);
            }
            element.setAttribute('scale', '0 0 0');
        });
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

    // 5. Menangani efek Hover Tooltip untuk 3 tombol tautan
    const tooltipsMapping = [
        { buttonId: 'btn-portfolio', tooltipId: 'tooltip-portfolio' },
        { buttonId: 'btn-github', tooltipId: 'tooltip-github' },
        { buttonId: 'btn-instagram', tooltipId: 'tooltip-instagram' }
    ];

    tooltipsMapping.forEach(mapping => {
        const buttonEl = document.getElementById(mapping.buttonId);
        const tooltipEl = document.getElementById(mapping.tooltipId);

        if (buttonEl && tooltipEl) {
            // Ketika kursor masuk (hover), picu animasi tampilkan tooltip
            buttonEl.addEventListener('mouseenter', () => {
                console.log(`Hover in: ${mapping.buttonId}`);
                tooltipEl.emit('show-tooltip');
            });

            // Ketika kursor keluar, sembunyikan kembali tooltip
            buttonEl.addEventListener('mouseleave', () => {
                console.log(`Hover out: ${mapping.buttonId}`);
                tooltipEl.emit('hide-tooltip');
            });
        }
    });
});
