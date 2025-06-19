import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ev Finansmanı Hesaplayıcı - Faizsiz Ev Kredisi Hesaplama | Evim Sistemleri',
  description: 'Faizsiz ev finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. Peşinatlı ve peşinatsız seçenekler, şeffaf organizasyon ücreti. Türkiye\'nin en güvenilir ev finansmanı platformu.',
  keywords: [
    'ev finansmanı hesaplayıcı',
    'faizsiz ev kredisi',
    'ev kredisi hesaplama',
    'peşinatsız ev',
    'ev satın alma finansmanı',
    'İslami ev finansmanı',
    'katılım bankası ev kredisi',
    'ev finansmanı ödeme planı',
    'organizasyon ücreti hesaplama',
    'çekilişli ev finansmanı',
    'çekilişsiz ev finansmanı'
  ],
  openGraph: {
    title: 'Ev Finansmanı Hesaplayıcı - Faizsiz Ev Kredisi | Evim Sistemleri',
    description: 'Faizsiz ev finansmanı hesaplayıcısı ile hayalinizdeki eve kavuşun. Şeffaf ödeme planları ve güvenilir sistem.',
    images: ['/og-ev-finansmani.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemler.com/ev-finansmani',
  },
}

export default function EvFinansmanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}