import './globals.css'
import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'

const manrope = Manrope({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://evimsistemleri.com'),
  title: {
    default: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı | Türkiye\'nin En Güvenilir Platformu',
    template: '%s | Evim Sistemleri - Faizsiz Finansman'
  },
  description: 'Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu Evim Sistemleri. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın. Şeffaf, güvenli ve hızlı çözümler.',
  keywords: [
    'evim sistemleri',
    'faizsiz finansman',
    'ev finansmanı',
    'araba finansmanı',
    'katılım bankacılığı',
    'eminevim',
    'katılımevim',
    'İslami finansman',
    'finansman hesaplayıcı',
    'ev kredisi',
    'araba kredisi',
    'murabaha',
    'icara',
    'sukuk',
    'katılım bankası',
    'faizsiz kredi',
    'İslami bankacılık',
    'halal finansman',
    'şeriat uyumlu finansman',
    'ev satın alma',
    'araba satın alma',
    'finansal planlama',
    'ödeme planı hesaplama',
    'peşinatsız ev',
    'peşinatsız araba',
    'organizasyon ücreti',
    'çekilişli finansman',
    'çekilişsiz finansman'
  ],
  authors: [{ name: 'Evim Sistemleri Uzmanları', url: 'https://evimsistemleri.com' }],
  creator: 'Evim Sistemleri',
  publisher: 'Evim Sistemleri',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://evimsistemleri.com',
    siteName: 'Evim Sistemleri',
    title: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı',
    description: 'Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Evim Sistemleri Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@evimsistemler',
    creator: '@evimsistemler',
    title: 'Evim Sistemleri - Faizsiz Ev ve Araba Finansmanı Hesaplayıcı',
    description: 'Türkiye\'nin en güvenilir faizsiz finansman hesaplama platformu. Ev ve araba finansmanı hesaplayıcısı ile ödeme planınızı anında hesaplayın.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
    other: {
      'msvalidate.01': 'bing-site-verification-code',
    },
  },
  alternates: {
    canonical: 'https://evimsistemleri.com',
    languages: {
      'tr-TR': 'https://evimsistemleri.com',
    },
  },
  category: 'finance',
  classification: 'Business',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Evim Sistemleri',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#2563eb',
  },
  manifest: '/manifest.webmanifest',
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Evim Sistemleri",
  "description": "Türkiye'nin en güvenilir faizsiz finansman hesaplama platformu",
  "url": "https://evimsistemleri.com",
  "logo": "https://evimsistemleri.com/logo.png",
  "image": "https://evimsistemleri.com/og-image.jpg",
  "email": "contact@evimsistemleri.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Maslak Mahallesi Büyükdere Caddesi No:123",
    "addressLocality": "Sarıyer",
    "addressRegion": "İstanbul",
    "addressCountry": "TR"
  },
  "sameAs": [
    "https://x.com/evimsistemleri",
  ],
  "serviceType": "Faizsiz Finansman",
  "areaServed": "Turkey",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Finansman Hizmetleri",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Ev Finansmanı",
          "description": "Faizsiz ev finansmanı çözümleri"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Araba Finansmanı",
          "description": "Faizsiz araba finansmanı çözümleri"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "10000",
    "bestRating": "5"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={manrope.variable}>
      <head>
        {/* Preconnect to external domains - a Pexels CDN-t használjuk a blog képei için */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className={manrope.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ELH8879WL8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELH8879WL8');
          `}
        </Script>
      </body>
    </html>
  )
}