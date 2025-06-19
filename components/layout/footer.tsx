import Link from 'next/link'
import { Calculator, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Evim Sistemleri</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Türkiye'nin en güvenilir faizsiz finansman hesaplamaplatformu. Modern, şeffaf ve güvenilir 
              finansman çözümleri ile hayalinizdeki eve veya arabaya kavuşun. Evim sistemlerine avantajlı erişmenizi sağlıyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@evimsistemler.com" className="hover:text-white transition-colors">
                  info@evimsistemler.com
                </a>
              </div>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Finansman Hizmetleri</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ev-finansmani" className="text-gray-300 hover:text-white transition-colors">
                  Ev Finansmanı Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/araba-finansmani" className="text-gray-300 hover:text-white transition-colors">
                  Araba Finansmanı Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/blog/finansman" className="text-gray-300 hover:text-white transition-colors">
                  Faizsiz Finansman Rehberi
                </Link>
              </li>
              <li>
                <Link href="/blog/ev" className="text-gray-300 hover:text-white transition-colors">
                  Ev Satın Alma Rehberi
                </Link>
              </li>
              <li>
                <Link href="/blog/araba" className="text-gray-300 hover:text-white transition-colors">
                  Araba Satın Alma Rehberi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Yasal */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-300 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-300 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-gray-300 hover:text-white transition-colors">
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                &copy; 2025 Evim Sistemleri. Tüm hakları saklıdır.
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Türkiye'nin en güvenilir faizsiz finansman hesaplama platformu
              </p>
            </div>
            
          
          </div>
        </div>
      </div>
    </footer>
  )
}