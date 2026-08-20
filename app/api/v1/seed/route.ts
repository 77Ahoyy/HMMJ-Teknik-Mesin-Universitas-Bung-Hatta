import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'
import { writeJSON, readJSON } from '@/lib/data'

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const defaultGallery = [
      {
        id: "gal-001",
        title: "Pelantikan Resmi Pengurus HMMJ Periode 2026/2027",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        category: "Pelantikan",
        date: "2026-02-15",
        published: true
      },
      {
        id: "gal-002",
        title: "Workshop Perancangan SolidWorks & CNC Machining",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        category: "Workshop",
        date: "2026-03-10",
        published: true
      },
      {
        id: "gal-003",
        title: "Kunjungan Industri & Studi Ekskursi ke Pabrik Manufaktur",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        category: "Kunjungan Industri",
        date: "2026-04-05",
        published: true
      },
      {
        id: "gal-004",
        title: "Program Bina Desa & Pengabdian Teknologi Tepat Guna",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
        category: "Bina Desa",
        date: "2026-05-12",
        published: true
      },
      {
        id: "gal-005",
        title: "Seminar Nasional Energi Terbarukan & Manufaktur Berkelanjutan",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
        category: "Seminar",
        date: "2026-06-20",
        published: true
      },
      {
        id: "gal-006",
        title: "Solidarity Cup: Turnamen Futsal Mahasiswa Teknik Mesin UBH",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
        category: "Olahraga",
        date: "2026-07-08",
        published: true
      },
      {
        id: "gal-007",
        title: "Musyawarah Besar (MUBES) & Rapat Kerja Tahunan HMMJ",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        category: "Pelantikan",
        date: "2026-01-20",
        published: true
      },
      {
        id: "gal-008",
        title: "Praktikum Uji Material dan Fabrikasi Logam Mahasiswa",
        image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
        category: "Workshop",
        date: "2026-08-01",
        published: true
      }
    ]

    const defaultNews = [
      {
        id: "news-001",
        title: "Pelantikan Resmi Kepengurusan HMMJ Teknik Mesin Periode 2026/2027",
        slug: "pelantikan-resmi-kepengurusan-hmmj-teknik-mesin-2026-2027",
        category: "Organisasi",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80",
        gallery_images: [
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
        ],
        summary: "HMMJ Teknik Mesin FTI Universitas Bung Hatta resmi melantik pengurus baru periode 2026/2027 yang dinakhodai oleh Novaleo Fernandes dan Divo Pangestu.",
        content: "Padang — Himpunan Masyarakat Mahasiswa Jurusan (HMMJ) Teknik Mesin, Fakultas Teknologi Industri (FTI) Universitas Bung Hatta secara resmi melantik jajaran pengurus baru untuk periode kepengurusan 2026/2027.\n\nAcara pelantikan berlangsung khidmat di Aula Gedung FTI Kampus 3 Universitas Bung Hatta, dihadiri oleh Dekanat FTI, Ketua Jurusan Teknik Mesin, dosen pembina, serta perwakilan ormawa se-lingkungan Universitas Bung Hatta.\n\nKetua Himpunan terpilih, Novaleo Fernandes, dalam pidato perdananya menegaskan komitmen untuk membawa HMMJ Teknik Mesin menjadi organisasi yang solid, adaptif terhadap perkembangan teknologi industri, serta berprestasi di tingkat regional maupun nasional.\n\n\"Dengan semangat Solidaritas Tanpa Batas, kami siap mengabdi dan membawa nama baik almamater tercinta Universitas Bung Hatta,\" tegas Novaleo.",
        date: "2026-02-15",
        published: true,
        author: "Divisi Kominfo HMMJ",
        created_at: "2026-02-15T10:00:00Z"
      },
      {
        id: "news-002",
        title: "Workshop Desain Mekanikal CAD/CAM & Simulasi SolidWorks Bersama Praktisi",
        slug: "workshop-desain-mekanikal-cad-cam-solidworks-2026",
        category: "Workshop",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
        gallery_images: [
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
        ],
        summary: "Meningkatkan kompetensi perancangan mekanikal mahasiswa melalui pelatihan intensif SolidWorks dan pengenalan CNC Machining.",
        content: "Divisi Kemahasiswaan dan Minat Bakat HMMJ Teknik Mesin sukses menyelenggarakan Workshop Desain Mekanikal CAD/CAM yang diikuti oleh lebih dari 80 mahasiswa aktif.\n\nPelatihan ini menghadirkan praktisi industri yang membedah studi kasus perancangan mesin industri, analisis tegangan elemen hingga (FEA), dan konversi desain 3D ke kode G-Code untuk mesin CNC.",
        date: "2026-03-10",
        published: true,
        author: "Divisi Kemahasiswaan",
        created_at: "2026-03-10T14:00:00Z"
      },
      {
        id: "news-003",
        title: "Kunjungan Industri & Ekskursi Manufaktur Mahasiswa Teknik Mesin UBH",
        slug: "kunjungan-industri-manufaktur-mesin-ubh-2026",
        category: "Kunjungan Industri",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
        gallery_images: [
          "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
        ],
        summary: "Mahasiswa Teknik Mesin Universitas Bung Hatta melakukan studi lapangan ke fasilitas produksi manufaktur untuk mempelajari proses fabrikasi skala besar.",
        content: "Sebagai implementasi pembelajaran langsung di lapangan, HMMJ Teknik Mesin memfasilitasi program Kunjungan Industri. Mahasiswa mendapatkan wawasan mendalam seputar otomatisasi lini perakitan, sistem hidrolik-pneumatik, serta standar K3 industri modern.",
        date: "2026-04-05",
        published: true,
        author: "Divisi Humas",
        created_at: "2026-04-05T09:00:00Z"
      }
    ]

    await writeJSON('gallery.json', defaultGallery)
    await writeJSON('news.json', defaultNews)

    return NextResponse.json({
      success: true,
      message: 'Data awal resmi (Dokumentasi & Berita) berhasil disinkronkan ke database cloud!',
      galleryCount: defaultGallery.length,
      newsCount: defaultNews.length,
    })
  } catch (err: any) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: err.message || 'Gagal memuat data awal' }, { status: 500 })
  }
}
