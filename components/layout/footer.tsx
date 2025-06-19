
'use client'

import Link from 'next/link'
import { Calculator, Mail, Phone, MapPin, ExternalLink, Heart, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* Scroll to Top Button */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Button
          onClick={scrollToTop}
          size="sm"
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full w-12 h-12 p-0 transition-all duration-300 hover:scale-110"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Evim Sistemleri
                </span>
                <div className="text-xs text-gray-400 -mt-1">Faizsiz Finansman</div>
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Türkiye'nin en güvenilir faizsiz finansman hesaplama platformu. Modern, şeffaf ve güvenilir 
              finansman çözümleri ile hayalinizdeki eve veya arabaya kavuşun.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-300 group hover:text-white transition-colors duration-300">
              <Mail className="h-4 w-4 text-blue-400" />
              <a href="mailto:info@evimsistemler.com" className="hover:text-blue-300 transition-colors">
                info@evimsistemler.com
              </a>
            </div>
          </div>

          {/* Finansman Hizmetleri */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Finansman Hizmetleri
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/ev-finansmani" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Ev Finansmanı Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/araba-finansmani" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Araba Finansmanı Hesaplayıcı
                </Link>
              </li>
              <li>
                <Link href="/blog/finansman" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Faizsiz Finansman Rehberi
                </Link>
              </li>
              <li>
                <Link href="/blog/ev" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Ev Satın Alma Rehberi
                </Link>
              </li>
              <li>
                <Link href="/blog/araba" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Araba Satın Alma Rehberi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Kurumsal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Yasal ve İstatistikler */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Yasal & Güvenlik
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                  Çerez Politikası
                </Link>
              </li>
            </ul>

            {/* Mini İstatistikler */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-300">50,000+</div>
                <div className="text-xs text-gray-400">Mutlu Kullanıcı</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left space-y-2">
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-gray-300">
                <span>&copy; 2025 Evim Sistemleri. Tüm hakları saklıdır.</span>
                <Heart className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-sm text-gray-400">
                Türkiye'nin en güvenilir faizsiz finansman hesaplama platformu
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">50,000+ Mutlu Kullanıcı</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">%99.9 Doğruluk</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">24/7 Hizmet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
