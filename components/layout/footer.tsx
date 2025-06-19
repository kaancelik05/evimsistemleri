import Link from 'next/link'
import { Calculator, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Evim Sistemleri</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Türkiye'nin en güvenilir faizsiz finansman platformu. Modern, şeffaf ve güvenilir 
              finansman çözümleri ile hayalinizdeki eve veya arabaya kavuşun. 10.000+ mutlu müşteri.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <a href="tel:+908501234567" className="hover:text-white transition-colors">
                  0850 123 45 67
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@evimsistemler.com" className="hover:text-white transition-colors">
                  info@evimsistemler.com
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5" />
                <address className="not-italic">
                  Maslak Mahallesi, Büyükdere Caddesi No:123<br />
                  Sarıyer/İstanbul
                </address>
              </div>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
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
          <div>
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
              <li>
                <a 
                  href="https://wa.me/908501234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>WhatsApp Destek</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            
            <h4 className="text-md font-semibold mt-6 mb-3">Yasal</h4>
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
              <p className="text-gray-400">
                &copy; 2024 Evim Sistemleri. Tüm hakları saklıdır.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Türkiye'nin en güvenilir faizsiz finansman platformu
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>10.000+ Mutlu Müşteri</span>
              <span>•</span>
              <span>%98 Memnuniyet</span>
              <span>•</span>
              <span>7/24 Destek</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}