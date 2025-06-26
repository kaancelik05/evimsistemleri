import {
  Shield,
  Database,
  Cog,
  Lock,
  Gavel,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function GizlilikPolitikasiPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Gizlilik Politikası
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
            Verilerinizin güvenliği ve gizliliği bizim için en önemli
            önceliktir.
          </p>
        </div>
      </section>

      <main className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Evim Sistemleri olarak, kullanıcılarımızın kişisel verilerinin
            mahremiyetine ve güvenliğine büyük önem veriyoruz. Bu gizlilik
            politikası, hangi verileri topladığımızı, bu verileri nasıl
            kullandığımızı ve haklarınızın neler olduğunu açıklamaktadır.
          </p>

          <div className="space-y-8">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/20 p-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  1. Topladığımız Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Hizmetlerimizi kullandığınızda sizden aşağıdaki bilgileri
                  toplayabiliriz:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>Hesaplama Bilgileri:</strong> Finansman hesaplama
                    araçlarımızı kullanırken girdiğiniz veriler (örn. finansman
                    tutarı, vade, vb.). Bu veriler anonim olarak saklanır ve
                    kişisel olarak sizinle ilişkilendirilmez.
                  </li>
                  <li>
                    <strong>İletişim Bilgileri:</strong> İletişim formları veya
                    e-posta yoluyla bize ulaştığınızda adınız, e-posta
                    adresiniz ve mesajınız gibi bilgileri toplarız.
                  </li>
                  <li>
                    <strong>Çerezler ve Teknolojiler:</strong> Web sitemizin
                    performansını artırmak ve kullanıcı deneyimini iyileştirmek
                    için çerezler kullanıyoruz.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/20 p-6">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                  <Cog className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  2. Bilgileri Nasıl Kullanıyoruz?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300 space-y-4">
                <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Hizmetlerimizi sunmak, sürdürmek ve iyileştirmek.</li>
                  <li>Kullanıcı desteği sağlamak ve sorularınızı yanıtlamak.</li>
                  <li>
                    Web sitemizin kullanımını analiz ederek kullanıcı
                    deneyimini geliştirmek.
                  </li>
                  <li>Yasal yükümlülüklerimizi yerine getirmek.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/20 p-6">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  3. Veri Güvenliği
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p>
                  Kişisel verilerinizi yetkisiz erişime, değişikliğe, ifşaya
                  veya imhaya karşı korumak için endüstri standardı güvenlik
                  önlemleri alıyoruz. Veri güvenliği altyapımızı sürekli olarak
                  güncelliyor ve denetliyoruz. Güvenliğiniz bizim için bir
                  taahhüttür.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/20 p-6">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                  <Gavel className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  4. Haklarınız
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p>
                  Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, kişisel
                  verilerinizle ilgili çeşitli haklara sahipsiniz. Bu haklar
                  arasında verilerinize erişme, düzeltme talep etme ve
                  silinmesini isteme bulunmaktadır. Haklarınızı kullanmak için
                  bizimle iletişime geçebilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800/50 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800/20 p-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  5. Politika Değişiklikleri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-gray-700 dark:text-gray-300">
                <p>
                  Bu gizlilik politikasını zaman zaman güncelleyebiliriz.
                  Değişiklikler bu sayfada yayınlanacak ve önemli
                  değişiklikler hakkında sizi bilgilendireceğiz.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-8 text-center">
            <p className="mb-2">
              <strong>Son Güncelleme:</strong> 26 Haziran 2025
            </p>
            <p>
              Sorularınız için bizimle{" "}
              <Link
                href="/iletisim"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                iletişim sayfamız
              </Link>{" "}
              üzerinden irtibata geçebilirsiniz.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 