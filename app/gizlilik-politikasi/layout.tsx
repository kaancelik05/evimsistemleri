import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Gizlilik Politikası - Evim Sistemleri | Türkiye'nin En Güvenilir Faizsiz Finansman Hesaplama Platformu",
  description:
    "Evim Sistemleri gizlilik politikasını inceleyin. Verilerinizin nasıl kullanıldığını ve korunduğunu öğrenin. Şeffaf ve güvenilir hizmet.",
  keywords: [
    "gizlilik politikası",
    "veri koruma",
    "kişisel veriler",
    "KVKK",
    "Evim Sistemleri gizlilik",
    "kullanıcı verileri",
    "çerez politikası",
  ],
  openGraph: {
    title:
      "Gizlilik Politikası - Evim Sistemleri | Türkiye'nin En Güvenilir Faizsiz Finansman Hesaplama Platformu",
    description:
      "Evim Sistemleri olarak gizliliğinize önem veriyoruz. Veri koruma politikamız hakkında detaylı bilgi alın.",
    images: ["/evim-sistemleri-logo.png"],
  },
  alternates: {
    canonical: "https://evimsistemleri.com/gizlilik-politikasi",
  },
};

export default function GizlilikPolitikasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 