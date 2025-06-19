import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda - Evim Sistemleri | Türkiye\'nin En Güvenilir Faizsiz Finansman Platformu',
  description: 'Evim Sistemleri hakkında bilgi edinin. Misyonumuz, vizyonumuz, değerlerimiz ve 10.000+ mutlu müşterimizle oluşturduğumuz güven. Faizsiz finansman alanında öncü şirket.',
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
    title: 'Hakkımızda - Evim Sistemleri | Türkiye\'nin En Güvenilir Faizsiz Finansman Platformu',
    description: 'Evim Sistemleri hakkında bilgi edinin. 10.000+ mutlu müşteri, %98 memnuniyet oranı ile Türkiye\'nin en güvenilir faizsiz finansman platformu.',
    images: ['/og-hakkimizda.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemler.com/hakkimizda',
  },
}

export default function HakkimizdaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}