
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Car className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Araba Finansmanı
              <span className="block text-4xl md:text-5xl text-emerald-100 font-light">
                Hesaplayıcı
              </span>
            </h1>
            
            <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
              Hayalinizdeki arabaya kavuşmanın en kolay yolu. Faizsiz finansman sistemi ile 
              ödeme planınızı hemen hesaplayın. 
            </p>
            
            <div className="flex items-center justify-center mt-8 space-x-2 text-emerald-100">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">Peşinatlı ve peşinatsız seçenekler mevcut</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Hızlı Hesaplama</h3>
                <p className="text-gray-600 leading-relaxed">
                  Araba finansmanında hızlı hesaplama ve karşılaştırma
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Güvenli İşlem</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tüm işlemleriniz güvence altında
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Esnek Vade</h3>
                <p className="text-gray-600 leading-relaxed">
                  Size uygun vade seçenekleri
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hesaplama Formu */}
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-1 shadow-lg">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <CalculationForm
                    calculationType="araba"
                    onCalculate={handleCalculate}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Sonuç Tablosu */}
            <div className="space-y-6">
              {result ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-1 shadow-lg">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    <PaymentScheduleTable
                      result={result}
                      calculationType="araba"
                      financingType={result.schedule[0]?.status === 'accessible' ? 'cekilissiz' : 'cekilisli'}
                    />
                  </div>
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden h-full flex items-center justify-center">
                  <CardContent className="text-center py-16 px-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      Ödeme Planınızı Görün
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                      Soldaki formu doldurarak detaylı ödeme planınızı hesaplayın
                    </p>
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
