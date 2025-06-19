import { Award, TrendingUp, Users } from "lucide-react";

export function StatisticsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rakamlarla Evim Sistemleri</h2>
          <p className="text-xl text-gray-600">Türkiye'nin en güvenilir faizsiz finansman platformu</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
            <p className="text-gray-600">Mutlu Müşteri</p>
            <p className="text-sm text-gray-600 mt-1">Hayallerine kavuşan aileler</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">₺2.5M+</h3>
            <p className="text-gray-600">Toplam Finansman</p>
            <p className="text-sm text-gray-600 mt-1">Gerçekleştirilen finansman tutarı</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">%98</h3>
            <p className="text-gray-600">Müşteri Memnuniyeti</p>
            <p className="text-sm text-gray-600 mt-1">Kanıtlanmış memnuniyet oranı</p>
          </div>
        </div>
      </div>
    </section>
  );
} 