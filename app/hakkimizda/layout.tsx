import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda - Evim Sistemleri | Türkiye\'nin En Güvenilir Faizsiz Finansman Hesaplama Platformu',
  description: 'Evim Sistemleri hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz. Faizsiz finansman alanında öncü şirket.',
  keywords: [
    'evim sistemleri hakkında',
    'faizsiz finansman şirketi',
    'İslami finansman şirketi',
    'katılım bankacılığı',
    'güvenilir finansman',
    'şeffaf finansman',
    'müşteri memnuniyeti',
    'finansman uzmanları',
    'ev finansmanı şirketi',
    'araba finansmanı şirketi'
  ],
  openGraph: {
    title: 'Hakkımızda - Evim Sistemleri | Türkiye\'nin En Güvenilir Faizsiz Finansman Hesaplama Platformu',
    description: 'Evim Sistemleri hakkında bilgi edinin.Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu.',
    images: ['/og-hakkimizda.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemleri.com/hakkimizda',
  },
}

export default function HakkimizdaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}