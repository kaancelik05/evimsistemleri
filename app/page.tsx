
import Image from 'next/image'
import Link from 'next/link'
import { Calculator, Home, Car, TrendingUp, Users, Award, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const features = [
    {
      icon: Calculator,
      title: "Gelişmiş Hesaplama",
      description: "Yapay zeka destekli algoritma ile en doğru finansman hesaplamaları"
    },
    {
      icon: Shield,
      title: "100% Güvenli",
      description: "Verileriniz şifrelenmiş olarak korunur, hiçbir bilgi saklanmaz"
    },
    {
      icon: Clock,
      title: "Anında Sonuç",
      description: "Saniyeler içinde detaylı ödeme planınızı görüntüleyin"
    },
    {
      icon: TrendingUp,
      title: "Optimize Edilmiş",
      description: "En uygun ödeme seçeneklerini akıllı algoritma ile belirleyin"
    }
  ]

  const stats = [
    { number: "50,000+", label: "Mutlu Kullanıcı" },
    { number: "₺2.5M+", label: "Hesaplanan Tutar" },
    { number: "99.9%", label: "Doğruluk Oranı" },
    { number: "24/7", label: "Kesintisiz Hizmet" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium px-4 py-2">
              🎉 Türkiye'nin #1 Faizsiz Finansman Platformu
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Hayalinizdeki Eve
              <br />
              <span className="text-blue-600 dark:text-blue-400">Faizsiz</span> Sahip Olun
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              İslami prensiplere uygun, şeffaf ve güvenilir finansman çözümleri ile ev ve araba sahibi olmanın en kolay yolu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/ev-finansmani">
                  <Home className="mr-2 h-5 w-5" />
                  Ev Finansmanı Hesapla
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/araba-finansmani">
                  <Car className="mr-2 h-5 w-5" />
                  Araba Finansmanı Hesapla
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Neden <span className="text-blue-600 dark:text-blue-400">Evim Sistemleri?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Modern teknoloji ile geleneksel değerleri buluşturan, kullanıcı odaklı finansman çözümleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Nasıl <span className="text-blue-600 dark:text-blue-400">Çalışır?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              3 basit adımda hayalinizdeki eve sahip olun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Bilgileri Girin",
                description: "Ev fiyatı, peşinat miktarı ve vade süresini belirleyin"
              },
              {
                step: "02", 
                title: "Hesaplayın",
                description: "Yapay zeka algoritması en uygun ödeme planını oluşturur"
              },
              {
                step: "03",
                title: "Karar Verin",
                description: "Detaylı raporu inceleyin ve finansman kararınızı verin"
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 transform -translate-y-1/2">
                    <div className="w-full h-full rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Hayalinizdeki Ev Artık Çok Yakın!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Binlerce kişinin güvendiği platformumuzla, faizsiz finansman hesaplamalarınızı hemen yapın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/ev-finansmani">
                <Home className="mr-2 h-5 w-5" />
                Ev Finansmanı
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 [&>a]:text-white [&>a:hover]:text-blue-600">
              <Link href="/araba-finansmani">
                <Car className="mr-2 h-5 w-5" />
                Araba Finansmanı
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
