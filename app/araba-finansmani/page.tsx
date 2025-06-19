
'use client'

import { useState } from 'react'
import { CalculationForm } from '@/components/calculation/calculation-form'
import { PaymentScheduleTable } from '@/components/calculation/payment-schedule-table'
import { FormData, CalculationResult } from '@/lib/types'
import { Car, Zap, Shield, Clock, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ArabaFinansmanPage() {
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = (data: FormData) => {
    setLoading(true)
    
    // Create a new worker instance
    const worker = new Worker(new URL('@/workers/calculation.worker.ts', import.meta.url))

    // Listen for messages from the worker
    worker.onmessage = (event: MessageEvent<CalculationResult>) => {
      setResult(event.data)
      setLoading(false)
      worker.terminate() // Clean up the worker
    }

    // Handle errors from the worker
    worker.onerror = (error) => {
      console.error('Worker error:', error)
      setLoading(false)
      worker.terminate()
    }

    // Send data to the worker
    worker.postMessage({
      ...data,
      calculationType: 'araba'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Car className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Araba Finansmanı
              <span className="block text-emerald-100">Hesaplayıcı</span>
            </h1>
            
            <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
              Hayalinizdeki arabaya kavuşmanın en kolay yolu. Faizsiz finansman sistemi ile 
              ödeme planınızı hemen hesaplayın.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-6">
              <div className="flex items-center text-emerald-100">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Peşinatlı & Peşinatsız</span>
              </div>
              <div className="w-px h-6 bg-emerald-300/50"></div>
              <div className="flex items-center text-emerald-100">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">%100 Güvenli</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı Hesaplama</h3>
                <p className="text-gray-600 leading-relaxed">
                  Araba finansmanında anında hesaplama ve detaylı karşılaştırma imkanı
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Güvenli İşlem</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tüm finansman işlemleriniz tam güvence altında gerçekleşir
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Esnek Vade</h3>
                <p className="text-gray-600 leading-relaxed">
                  Size en uygun vade seçenekleri ile rahat ödeme planı
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculation Form */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-6">
                <CalculationForm
                  calculationType="araba"
                  onCalculate={handleCalculate}
                  loading={loading}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="order-1 lg:order-2">
              {result ? (
                <div className="space-y-6">
                  <PaymentScheduleTable
                    result={result}
                    calculationType="araba"
                    financingType={result.schedule[0]?.status === 'accessible' ? 'cekilissiz' : 'cekilisli'}
                  />
                </div>
              ) : (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Car className="h-12 w-12 text-emerald-600" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ödeme Planınızı Keşfedin
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      Soldaki formu doldurarak hayalinizdeki araba için detaylı ödeme planınızı 
                      anında hesaplayın ve en uygun finansman seçeneğini bulun.
                    </p>

                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span>Şeffaf Hesaplama</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span>Detaylı Analiz</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
