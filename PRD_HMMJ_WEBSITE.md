# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Official Web Platform HMMJTM Teknik Mesin Universitas Bung Hatta
**Periode Kepengurusan: 2026/2027**

---

### 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
Platform web resmi **Himpunan Masyarakat Mahasiswa Jurusan Teknik Mesin (HMMJTM) Universitas Bung Hatta** dirancang sebagai portal pusat informasi, transparansi organisasi, struktur kepengurusan interaktif, serta profil anggota dengan integrasi dashboard administrasi mandiri untuk tim Kominfo & Developer.

---

### 2. TUJUAN & TARGET (OBJECTIVES)
1. **Transparansi Organisasi**: Menampilkan struktur kepengurusan interaktif (Pengurus Inti & 6 Divisi) secara lengkap dengan foto HD, nama, jabatan, NPM, bio, dan akun media sosial.
2. **Konsistensi Visual & Sinkronisasi Universal (Cross-Device & Account-Agnostic)**: Menjamin tampilan visual, tema merah himpunan, dan data organisasi selalu seragam serta konsisten di semua platform/perangkat (Android, iOS, Windows, macOS) dan peramban (browser), tanpa ada perbedaan visual yang dipicu oleh variasi profil atau login akun email Google pada perangkat pengunjung.
3. **Penyetaraan Ukuran 3 Logo**: Ketiga logo kebanggaan (Logo HMMJTM, Logo Solidarity M Forever, Logo UBH) tampil seimbang dan sama besar.
4. **Pembaruan Terpusat (Global Cloud Sync)**: Setiap perubahan data yang dilakukan oleh Admin/Developer di dashboard langsung tersinkronisasi secara global dan instan ke seluruh pengunjung publik.
5. **Keamanan & Manajemen Akses Mandiri**: Dashboard terproteksi dengan enkripsi password (Bcrypt + JWT session), sistem optimasi kompresi foto otomatis (<120KB), serta kontrol penuh untuk Pengaturan Kontak, Background Tampilan, & Profil Anggota.

---

### 3. ARSITEKTUR TEKNOLOGI (TECH STACK)
- **Framework**: Next.js 16.3 (App Router, Turbopack, React 19)
- **Styling**: Vanilla CSS Modules (Glassmorphism, Mechanical Crimson Red `#110305` / `#1B0609` & HMMJ Red `#E5232A` + Gold Accent)
- **Backend / API**: Next.js Serverless Route Handlers (`/api/v1/...`)
- **Data Persistence**: Dual-layer (Static JSON Data + In-Memory Global Server Store + Cloud API Sync `/api/v1/cloud-store`)
- **Image Optimization**: Client-side auto-compression Canvas + Next.js Image Optimization

---

### 4. STRUKTUR HALAMAN & FITUR PUBLIK
| URL | Halaman | Deskripsi Fitur |
|---|---|---|
| `/` | **Beranda** | Hero Section dinamis dengan animasi partikel, profil singkat HMMJTM, Visi & Misi, Bagan Struktur Organisasi Interaktif per-Divisi, & Kontak Footer |
| `/tentang` | **Tentang Kami** | Sejarah HMMJTM, Filosofi 3 Logo (HMMJTM, Solidarity M Forever, UBH), Nilai-Nilai Dasar Organisasi, & Visi Misi Lengkap |
| `/struktur` | **Struktur Organisasi** | Bagan Hirarki Pengurus Inti & Pemilih 6 Divisi Kerja (Kaderisasi, Kemahasiswaan, Minat Bakat, Humas, Danus, Kominfo) |
| `/pengurus/[id]` | **Detail Profil Pengurus** | Halaman profil individu lengkap dengan foto HD, status keaktifan, divisi, NPM, bio, dan tautan sosial media |
| `/kontak` | **Kontak & Sekretariat** | Alamat sekretariat kampus, tautan Instagram resmi, & Google Maps interaktif |

---

### 5. SISTEM DASHBOARD ADMINISTRASI (`/dashboard`)
- **Ringkasan (`/dashboard`)**: Statistik langsung jumlah pengurus aktif, divisi, dan status sistem.
- **Kelola Pengurus (`/dashboard/members`)**: Tambah anggota, edit data, upload/ganti foto profil, dan hapus pengurus dengan auto-sinkronisasi instan ke publik.
- **Pengaturan Kontak (`/dashboard/settings/contact`)**: Edit alamat sekretariat, email resmi, nomor WhatsApp, akun Instagram, dan integrasi Google Maps.
- **Pengaturan Background (`/dashboard/settings/background`)**: Ubah foto background untuk Hero, Tentang Kami, dan Kontak dengan tombol Reset bawaan.
- **Pengaturan Password (`/dashboard/settings/password`)**: Perbarui kata sandi akun Admin / Kominfo / Developer secara aman.

---

### 6. PANDUAN DEPLOYMENT KE GITHUB & NETLIFY
1. Ekstrak file zip: `hmmj-website-upload-ready.zip`.
2. Buat repository baru di GitHub (contoh: `hmmj-teknik-mesin`).
3. Upload seluruh file hasil ekstrak ke GitHub (`app`, `components`, `data`, `lib`, `public`, `package.json`, dll).
4. Di **Netlify** ➔ Klik **Add new site** ➔ **Import an existing project** ➔ Pilih repository GitHub Anda.
5. Klik **Deploy site**.
