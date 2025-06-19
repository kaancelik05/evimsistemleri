import {
  Calculator,
  CheckCircle,
  Clock,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden Evim Sistemleri?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geleneksel bankacılık sistemlerinden farklı olarak, şeffaf ve adil
            faizsiz finansman çözümleri sunuyoruz
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
                Tüm ücretler ve koşullar açık şekilde belirtilir. Gizli maliyet
                yoktur. Organizasyon ücreti net olarak hesaplanır.
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
                Başvurunuzdan onaya kadar tüm süreç hızlı ve kolay. Online
                hesaplama ve başvuru imkanı.
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
                10.000+ müşterimizin güvendiği, kanıtlanmış sistem. %98
                müşteri memnuniyet oranı.
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
  );
} 