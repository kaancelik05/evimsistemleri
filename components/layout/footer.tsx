"use client";

import Link from "next/link";
import {
  Calculator,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart,
  ArrowUp,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Evim Sistemleri
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              Türkiye'nin en güvenilir faizsiz finansman hesaplama platformu.
              Modern, şeffaf ve güvenilir çözümlerle hayallerinize ulaşın.
            </p>
            <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@evimsistemleri.com" className="text-sm">
                contact@evimsistemleri.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Hizmetlerimiz
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Ev Finansmanı", href: "/ev-finansmani" },
                { name: "Araba Finansmanı", href: "/araba-finansmani" },
                { name: "Finansman Rehberi", href: "/blog/finansman" },
                { name: "Hesaplama Araçları", href: "/" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Kurumsal</h3>
            <ul className="space-y-3">
              {[
                { name: "Hakkımızda", href: "/hakkimizda" },
                { name: "Blog", href: "/blog" },
                { name: "İletişim", href: "/iletisim" },
                { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Güven ve Başarı
            </h3>
            <div className="space-y-4">
              {[
                { number: "₺847M+", label: "Hesaplanan Tutar" },
                { number: "%99.7", label: "Doğruluk Oranı" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center space-x-3">
                  <div className="text-blue-400 font-bold text-lg">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2025 Evim Sistemleri. Tüm hakları saklıdır.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Faizsiz finansman hesaplamalarında güvenilir çözüm ortağınız
              </p>
            </div>

            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Yukarı Çık</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
