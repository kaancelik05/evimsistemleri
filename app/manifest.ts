import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı',
    short_name: 'Evim Sistemleri',
    description: 'Türkiye\'nin en güvenilir faizsiz finansman platformu Evim Sistemleri. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. 10.000+ mutlu müşteri.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    scope: '/',
    lang: 'tr',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}