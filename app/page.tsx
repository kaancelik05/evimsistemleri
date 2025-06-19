import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Car, 
  ArrowRight,
} from 'lucide-react'
import type { Metadata } from 'next'
import { Skeleton } from '@/components/ui/skeleton'

const StatisticsSection = dynamic(() => import('@/components/home/statistics-section').then(mod => mod.StatisticsSection), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

const FeaturesSection = dynamic(() => import('@/components/home/features-section').then(mod => mod.FeaturesSection), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
});

const HowItWorksSection = dynamic(() => import('@/components/home/how-it-works-section').then(mod => mod.HowItWorksSection), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

const CtaSection = dynamic(() => import('@/components/home/cta-section').then(mod => mod.CtaSection), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

export const metadata: Metadata = {
  title: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı | Türkiye\'nin En Güvenilir Platformu',
  description: 'Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu Evim Sistemleri. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. Şeffaf, güvenli ve hızlı çözümler.',
  keywords: [
    'evim sistemleri',
    'faizsiz finansman',
    'ev finansmanı hesaplayıcı',
    'araba finansmanı hesaplayıcı',
    'katılım bankacılığı',
    'İslami finansman',
    'ev kredisi hesaplama',
    'araba kredisi hesaplama',
    'peşinatsız ev',
    'peşinatsız araba',
    'finansman hesaplama',
    'ödeme planı hesaplama'
  ],
  openGraph: {
    title: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı',
    description: 'Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu. Hayalinizdeki eve veya arabaya kavuşun.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemler.com',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-100 border-blue-400/30">
              Güvenilir Finansman Hesaplama
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Evim Sistemleri ile
              <span className="block text-blue-200">Hayallerinize Kavuşun</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Modern, şeffaf ve güvenilir faizsiz finansman sistemleri ile ev ve araba sahibi olmanın en kolay yolu. 
              Bütçenize göre ödeme planınızı anında hesaplayın. Finansmana erişim tarihinizi öğrenin. Karşılaştırarak en mantıklı yöntemi seçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                <Link href="/ev-finansmani">
                  <Home className="mr-2 h-5 w-5" />
                  Ev Finansmanı Hesapla
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/araba-finansmani">
                  <Car className="mr-2 h-5 w-5" />
                  Araba Finansmanı Hesapla
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <StatisticsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </div>
  )
}