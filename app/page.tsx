import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  Home, 
  Car, 
  Shield, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı | Türkiye\'nin En Güvenilir Platformu',
  description: 'Türkiye\'nin en güvenilir faizsiz finansman platformu Evim Sistemleri. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. 10.000+ mutlu müşteri, %98 memnuniyet oranı. Şeffaf, güvenli ve hızlı çözümler.',
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
    description: 'Türkiye\'nin en güvenilir faizsiz finansman platformu. 10.000+ mutlu müşteri ile hayalinizdeki eve veya arabaya kavuşun.',
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
              Güvenilir Finansman Çözümleri
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Evim Sistemleri ile
              <span className="block text-blue-200">Hayallerinize Kavuşun</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Modern, şeffaf ve güvenilir faizsiz finansman sistemleri ile ev ve araba sahibi olmanın en kolay yolu. 
              Türkiye'nin en güvenilir platformunda 10.000+ mutlu müşteri.
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

      {/* İstatistikler */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rakamlarla Evim Sistemleri</h2>
            <p className="text-xl text-gray-600">Türkiye'nin en güvenilir faizsiz finansman platformu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Mutlu Müşteri</p>
              <p className="text-sm text-gray-500 mt-1">Hayallerine kavuşan aileler</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">₺2.5M+</h3>
              <p className="text-gray-600">Toplam Finansman</p>
              <p className="text-sm text-gray-500 mt-1">Gerçekleştirilen finansman tutarı</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">%98</h3>
              <p className="text-gray-600">Müşteri Memnuniyeti</p>
              <p className="text-sm text-gray-500 mt-1">Kanıtlanmış memnuniyet oranı</p>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Evim Sistemleri?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Geleneksel bankacılık sistemlerinden farklı olarak, şeffaf ve adil faizsiz finansman çözümleri sunuyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>%100 Şeffaf Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tüm ücretler ve koşullar açık şekilde belirtilir. Gizli maliyet yoktur. 
                  Organizasyon ücreti net olarak hesaplanır.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Gelişmiş Hesaplama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gelişmiş hesaplama araçları ile ödeme planınızı anında görün. 
                  Çekilişli ve çekilişsiz seçenekler.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Hızlı Süreç</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Başvurunuzdan onaya kadar tüm süreç hızlı ve kolay. 
                  Online hesaplama ve başvuru imkanı.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Güvenilir Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  10.000+ müşterimizin güvendiği, kanıtlanmış sistem. 
                  %98 müşteri memnuniyet oranı.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Esnek Ödeme Planları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Size uygun ödeme planları ile finansal yükünüzü hafifletin. 
                  Peşinatlı ve peşinatsız seçenekler.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>7/24 Müşteri Desteği</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uzman müşteri hizmetleri ekibimiz ile her zaman yanınızdayız. 
                  Telefon ve WhatsApp desteği.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sadece 3 adımda hayalinizdeki eve veya arabaya kavuşun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hesaplama Yapın</h3>
              <p className="text-gray-600">
                Finansman tutarınızı, peşinat miktarınızı ve aylık ödeme kapasitенizi girin. 
                Çekilişli veya çekilişsiz seçeneği belirleyin.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Plan İnceleyin</h3>
              <p className="text-gray-600">
                Detaylı ödeme planınızı inceleyin ve size en uygun seçeneği belirleyin. 
                Organizasyon ücreti ve erişim ayını görün.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Başvuru Yapın</h3>
              <p className="text-gray-600">
                Uygun planı seçtikten sonra başvurunuzu tamamlayın ve onay sürecini başlatın. 
                Hızlı değerlendirme süreci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hayalinizdeki Ev veya Arabaya Kavuşmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hemen hesaplama yapın ve size özel ödeme planınızı görün. 
            Türkiye'nin en güvenilir faizsiz finansman platformu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
              <Link href="/ev-finansmani">
                <Home className="mr-2 h-5 w-5" />
                Ev Finansmanı Hesapla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/araba-finansmani">
                <Car className="mr-2 h-5 w-5" />
                Araba Finansmanı Hesapla
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}