import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Araba Finansmanı Hesaplayıcı - Faizsiz Araba Kredisi Hesaplama | Evim Sistemleri',
  description: 'Faizsiz araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. Peşinatlı ve peşinatsız seçenekler, şeffaf organizasyon ücreti. Türkiye\'nin en güvenilir araba finansmanı platformu.',
  keywords: [
    'araba finansmanı hesaplayıcı',
    'faizsiz araba kredisi',
    'araba kredisi hesaplama',
    'peşinatsız araba',
    'araba satın alma finansmanı',
    'İslami araba finansmanı',
    'katılım bankası araba kredisi',
    'araba finansmanı ödeme planı',
    'organizasyon ücreti hesaplama',
    'çekilişli araba finansmanı',
    'çekilişsiz araba finansmanı',
    'otomobil finansmanı'
  ],
  openGraph: {
    title: 'Araba Finansmanı Hesaplayıcı - Faizsiz Araba Kredisi | Evim Sistemleri',
    description: 'Faizsiz araba finansmanı hesaplayıcısı ile hayalinizdeki arabaya kavuşun. Şeffaf ödeme planları ve güvenilir sistem.',
    images: ['/og-araba-finansmani.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemleri.com/araba-finansmani',
  },
}

export default function ArabaFinansmanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}