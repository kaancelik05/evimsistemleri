export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sadece 3 adımda hayalinizdeki eve veya arabaya kavuşun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Hesaplama Yapın
            </h3>
            <p className="text-gray-600">
              Finansman tutarınızı, peşinat miktarınızı ve aylık ödeme
              kapasitenizi girin. Çekilişli veya çekilişsiz seçeneği
              belirleyin.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Plan İnceleyin
            </h3>
            <p className="text-gray-600">
              Detaylı ödeme planınızı inceleyin ve size en uygun seçeneği
              belirleyin. Organizasyon ücreti ve erişim ayını görün.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Karşılaştırın
            </h3>
            <p className="text-gray-600">
              En uygun ödeme koşulları ve finansman erişim tarihlerini karşılaştırın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 