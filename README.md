# JourneyHub — Demo Portal Informasi Peserta

Demo interaktif mobile-first untuk konsep website informasi perjalanan peserta.

## Cara menjalankan
1. Ekstrak folder.
2. Buka `index.html` di browser (Chrome/Edge).
3. Daftar menggunakan data contoh.
4. Untuk melihat admin, keluar lalu klik **Masuk sebagai admin demo**.

## Fitur demo
- Registrasi peserta: nama, departemen, nomor HP, password.
- Login peserta.
- Dashboard informasi perjalanan, agenda, dan pengumuman.
- Dashboard admin untuk melihat peserta.
- Admin dapat mengubah judul, lokasi, tanggal, dan deskripsi perjalanan.
- Data demo tersimpan di LocalStorage browser.

## Catatan penting
Ini hanya prototype frontend. Data disimpan di LocalStorage dan password demo disimpan apa adanya, sehingga **jangan gunakan data pribadi atau password asli**. Untuk website produksi, implementasikan PHP + MySQL, password hashing (`password_hash` / `password_verify`), validasi server-side, session yang aman, proteksi CSRF, kontrol akses admin, dan HTTPS.

Gambar latar dan font menggunakan layanan eksternal Unsplash dan Google Fonts; koneksi internet diperlukan untuk memuatnya. Fungsionalitas utama tetap berjalan secara lokal.
