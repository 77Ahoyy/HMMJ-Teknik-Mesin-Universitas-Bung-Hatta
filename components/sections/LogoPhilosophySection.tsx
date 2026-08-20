'use client'
import React from 'react'
import Image from 'next/image'
import styles from './LogoPhilosophySection.module.css'

const LOGO_ITEMS = [
  {
    title: 'Logo HMMJTM Teknik Mesin',
    subtitle: 'Identitas Resmi Organisasi',
    image: '/images/logo-hmmj.png',
    desc: 'Simbol roda gigi presisi yang merepresentasikan keahlian mekanika, dinamisme pergerakan organisasi, serta dedikasi seluruh mahasiswa Teknik Mesin Universitas Bung Hatta dalam berkarya dan berinovasi.',
    points: ['Roda gigi melambangkan kekuatan mekanik dan pergerakan aktif', 'Warna oranye mencerminkan semangat juang, kreativitas, dan loyalitas', 'Simbol Minangkabau merefleksikan kearifan lokal almamater Bung Hatta'],
  },
  {
    title: 'Solidarity M Forever',
    subtitle: 'Jiwa Korsa & Persaudaraan Abadi',
    image: '/images/logo-msolver.png',
    desc: 'Simbol persatuan dan persaudaraan mahasiswa Teknik Mesin se-Indonesia (M Solver). Melambangkan ikatan solidaritas tanpa batas, ketangguhan mental, dan semangat saling bahu-membahu dalam segala kondisi.',
    points: ['Huruf "M" besar melambangkan Mechanical Engineering', 'Warna merah-kuning menyala melambangkan keberanian dan energi solidaritas', 'Semboyan "Solidarity Forever" sebagai ikrar persaudaraan seumur hidup'],
  },
  {
    title: 'Universitas Bung Hatta',
    subtitle: 'Almamater & Landasan Karakter',
    image: '/images/logo-ubh.png',
    desc: 'Lambang kehormatan Universitas Bung Hatta yang menaungi HMMJTM Teknik Mesin. Mengusung nilai-nilai luhur Bung Hatta dalam mencetak lulusan yang cerdas, berintegritas tinggi, dan santun.',
    points: ['Perisai segilima melambangkan benteng moral dan keilmuan', 'Lambang bunga dan buku melambangkan ilmu pengetahuan yang terus mekar', 'Warna hijau melambangkan keteduhan, kedamaian, dan harapan masa depan'],
  },
]

export default function LogoPhilosophySection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-tag">Filosofi & Simbol</span>
          <h2 className="section-title">Makna Tiga Logo Kebanggaan</h2>
          <div className="divider" />
          <p className={styles.lead}>
            Setiap simbol yang tersemat memiliki nilai luhur, filosofi mendalam, serta sejarah perjuangan yang menjiwai pergerakan HMMJTM Teknik Mesin.
          </p>
        </div>

        <div className={styles.grid}>
          {LOGO_ITEMS.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.logoWrapper}>
                <div className={styles.logoCard}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={100}
                    height={100}
                    className={styles.logoImg}
                  />
                </div>
              </div>
              <span className={styles.tag}>{item.subtitle}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.desc}</p>
              <ul className={styles.points}>
                {item.points.map((p, idx) => (
                  <li key={idx} className={styles.pointItem}>
                    <span className={styles.bullet}>✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
