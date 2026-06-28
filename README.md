# firmashbibi-AR

Aplikasi WebAR Kartu Nama Interaktif premium berbasis Web menggunakan framework **A-Frame** dan **AR.js**.

## Fitur Utama
- **Custom Marker Tracking**: Menggunakan marker kustom Real Madrid (`pattern-realmadrid.patt`).
- **Model 3D Interaktif**: Memuat model 3D GLTF premium yang memiliki efek animasi rotasi 360 derajat terus menerus dan levitasi melayang secara halus.
- **Teks AR**: Menampilkan teks nama dan peran secara rapi di atas marker.
- **Glassmorphism Status Bar**: Floating UI status bar responsif di bagian bawah layar yang menunjukkan deteksi marker secara real-time (`Mencari marker...` -> `Marker Terdeteksi! Objek AR aktif`).

## Struktur Proyek
- `index.html`: File utama struktur WebAR.
- `css/style.css`: Lembar gaya kustom antarmuka 2D.
- `js/main.js`: Logika interaktivitas event listener.
- `pattern-realmadrid.patt`: Berkas latih marker kustom Real Madrid.

## Cara Menjalankan Secara Lokal
1. Jalankan server lokal pada direktori proyek Anda (misal menggunakan ekstensi **Live Server** di VS Code atau `python -m http.server 8000`).
2. Buka di browser Anda (webcam memerlukan protokol aman `localhost` atau `https://`).
3. Arahkan webcam ke gambar marker Real Madrid (`pattern-realmadrid.png`).
