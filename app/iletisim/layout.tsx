import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim - Evim Sistemleri | Faizsiz Finansman Uzmanları ile İletişime Geçin',
  description: 'Evim Sistemleri ile iletişime geçin. Faizsiz finansman konularında uzman ekibimizden destek alın. 7/24 müşteri hizmetleri, telefon ve WhatsApp desteği mevcut.',
  keywords: [
    'evim sistemleri iletişim',
    'faizsiz finansman destek',
    'müşteri hizmetleri',
    'finansman danışmanlığı',
    'ev finansmanı destek',
    'araba finansmanı destek',
    'İslami finansman danışmanlık',
    'katılım bankacılığı destek',
    'finansman uzmanları',
    'WhatsApp destek'
  ],
  openGraph: {
    title: 'İletişim - Evim Sistemleri | Faizsiz Finansman Uzmanları',
    description: 'Faizsiz finansman konularında uzman ekibimizden destek alın. 7/24 müşteri hizmetleri mevcut.',
    images: ['/og-iletisim.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemler.com/iletisim',
  },
}

export default function IletisimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}