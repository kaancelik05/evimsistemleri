import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  Heart,
  Target,
  Lightbulb
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda - Evim Sistemleri | Türkiye\'nin En Güvenilir Faizsiz Finansman Hesaplama Platformu',
  description: 'Evim Sistemleri hakkında bilgi edinin. Misyonumuz, vizyonumuz, değerlerimiz ve güven. Faizsiz finansman hesaplama alanında öncü şirket.',
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
    description: 'Evim Sistemleri hakkında bilgi edinin. Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu.',
    images: ['/og-hakkimizda.jpg'],
  },
  alternates: {
    canonical: 'https://evimsistemleri.com/hakkimizda',
  },
}

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              Güvenilir Finansman Partneri
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Faizsiz finansman alanında öncü, müşteri memnuniyetini her şeyin üstünde tutan Evim Sistemleri ekibiyiz. 
              Türkiye'nin en güvenilir platformu.
            </p>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Misyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Evim Sistemleri olarak, faizsiz finansman sistemleri hakkında bilgi vermek ve müşterilerimize en uygun çözümleri sunmak. Kullanıcılarımızın hayallerine kavuşmalarını sağlamak. Finansal bilgiler paylaşarak kullanıcılarımızın finansal okuryazarlığına katkı sağlamak.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Vizyonumuz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Türkiye'nin en güvenilir ve yenilikçi faizsiz finansman hesaplama platformu olmak. 
                  Teknoloji ile finansı birleştirerek, herkesin erişebileceği, 
                  şeffaf ve kullanıcı dostu çözümler geliştirmek. 
                  Finansal adaleti sağlayarak, toplumun her kesiminden insana hizmet etmek.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İş yapış şeklimizi belirleyen temel değerler ve ilkeler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Şeffaflık</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tüm süreçlerimizde açık ve net iletişim kurar, 
                  gizli maliyet veya koşul bulundurmayız. Organizasyon ücreti net olarak belirtilir.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Güvenilirlik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Verdiğimiz sözleri tutar, müşterilerimizin güvenini 
                  her zaman korur ve geliştiririz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Müşteri Odaklılık</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Müşterilerimizin ihtiyaçlarını önceleyir, 
                  onların memnuniyeti için sürekli çalışırız.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Sürekli Gelişim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teknoloji ve hizmet kalitemizi sürekli geliştirerek, 
                  en iyi deneyimi sunmaya odaklanırız. Yenilikçi çözümler üretir.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Toplumsal Sorumluluk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Toplumun her kesimine hizmet eder, 
                  finansal adaleti destekleyen projeler geliştiririz. Sosyal sorumluluk bilinciyle hareket ederiz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Mükemmellik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Her işimizde en yüksek kalite standartlarını hedefler, 
                  mükemmellik için çaba gösteririz. Sektörde öncü olmaya devam ederiz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Neden Bizi Seçmelisiniz */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Evim Sistemleri'ni Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Faizsiz finansman alanında fark yaratan özelliklerimiz ve avantajlarımız
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Uzman Ekip
                    </h3>
                    <p className="text-gray-600">
                      Finansman alanında uzman kadromuz ile size en uygun çözümleri sunuyoruz. 
                      5+ yıllık sektör deneyimi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Teknoloji Odaklı
                    </h3>
                    <p className="text-gray-600">
                      Modern teknoloji altyapımız ile hızlı ve güvenli hizmet sunuyoruz. 
                      Online hesaplama ve başvuru sistemi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Esnek Çözümler
                    </h3>
                    <p className="text-gray-600">
                      Her müşterimizin ihtiyacına özel, esnek finansman seçenekleri sunuyoruz. 
                      Peşinatlı ve peşinatsız seçenekler.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-12">
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Güvenilir Partner
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Binlerce müşterimizin güvendiği, sektörde öncü konumumuz ile 
                      size en iyi hizmeti sunmaya devam ediyoruz.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}