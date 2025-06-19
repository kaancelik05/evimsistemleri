import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Finansman Blog - Faizsiz Finansman Rehberi | Evim Sistemleri',
  description: 'Faizsiz finansman, ev ve araba satın alma, yatırım stratejileri hakkında uzman görüşleri ve pratik öneriler. Türkiye\'nin en kapsamlı finansman blog\'u.',
  keywords: [
    'finansman blog',
    'faizsiz finansman rehberi',
    'ev satın alma rehberi',
    'araba satın alma rehberi',
    'İslami finansman blog',
    'katılım bankacılığı blog',
    'finansal planlama',
    'yatırım stratejileri',
    'emlak yatırımı',
    'finansman tavsiyeleri'
  ],
  openGraph: {
    title: 'Finansman Blog - Faizsiz Finansman Rehberi | Evim Sistemleri',
    description: 'Faizsiz finansman, ev ve araba satın alma konularında uzman görüşleri ve pratik öneriler.',
    images: ['/og-blog.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemler.com/blog',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}