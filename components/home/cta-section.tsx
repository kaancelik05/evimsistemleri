import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Home } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Hayalinizdeki Ev veya Arabaya Kavuşmaya Hazır mısınız?
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Hemen hesaplama yapın ve size özel ödeme planınızı görün. Türkiye'nin
          en güvenilir faizsiz finansman platformu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 border-0"
          >
            <Link href="/ev-finansmani">
              <Home className="mr-2 h-5 w-5" />
              Ev Finansmanı Hesapla
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
          >
            <Link href="/araba-finansmani">
              <Car className="mr-2 h-5 w-5" />
              Araba Finansmanı Hesapla
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 