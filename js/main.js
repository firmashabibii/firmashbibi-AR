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
            // Ketika kursor masuk (hover), picu animasi tampilkan tooltip dan beri feedback pada kursor visual
            buttonEl.addEventListener('mouseenter', () => {
                console.log(`Hover in: ${mapping.buttonId}`);
                tooltipEl.emit('show-tooltip');
                
                // Feedback visual pada kursor HTML (Membesar & Berubah Warna Hijau Stabil)
                const cssCursor = document.getElementById('css-cursor');
                if (cssCursor) {
                    cssCursor.style.borderColor = '#10b981'; // Hijau Emerald
                    cssCursor.style.width = '26px';
                    cssCursor.style.height = '26px';
                    cssCursor.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.7)';
                }
            });

            // Ketika kursor keluar, sembunyikan kembali tooltip dan kembalikan gaya kursor
            buttonEl.addEventListener('mouseleave', () => {
                console.log(`Hover out: ${mapping.buttonId}`);
                tooltipEl.emit('hide-tooltip');
                
                // Mengembalikan kursor HTML ke bentuk default
                const cssCursor = document.getElementById('css-cursor');
                if (cssCursor) {
                    cssCursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    cssCursor.style.width = '18px';
                    cssCursor.style.height = '18px';
                    cssCursor.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
                }
            });
        }
    });

    // 6. Logika Bola Mata Melirik Mengejar Gerakan Mouse / Touch secara Real-time
    const pupilEl = document.getElementById('monster-pupil');
    if (pupilEl) {
        console.log('Sistem pelacakan pupil mata aktif!');
        
        // Pelacakan mouse pada desktop
        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Batasi pergeseran pupil maksimal 0.04 unit agar tetap di dalam sclera putih
            const limitX = mouseX * 0.035;
            const limitY = mouseY * 0.035;
            
            // Perbarui atribut posisi pupil secara real-time
            pupilEl.setAttribute('position', `${-0.65 + limitX} ${0.55 + limitY} 0.05`);
        });

        // Pelacakan sentuhan jari pada mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
                const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
                
                const limitX = touchX * 0.035;
                const limitY = touchY * 0.035;
                
                pupilEl.setAttribute('position', `${-0.65 + limitX} ${0.55 + limitY} 0.05`);
            }
        });
    }
});
