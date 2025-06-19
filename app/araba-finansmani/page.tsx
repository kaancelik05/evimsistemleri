'use client'

import { useState } from 'react'
import { CalculationForm } from '@/components/calculation/calculation-form'
import { PaymentScheduleTable } from '@/components/calculation/payment-schedule-table'
import { FormData, CalculationResult } from '@/lib/types'
import { Car, Zap, Shield, Clock } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Araba Finansmanı Hesaplayıcı
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Hayalinizdeki arabaya kavuşmanın en kolay yolu. Faizsiz finansman sistemi ile ödeme planınızı hemen hesaplayın. 
              Peşinatlı ve peşinatsız seçenekler mevcut.
            </p>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Hızlı Onay</h3>
                <p className="text-gray-600">Araba finansmanında hızlı değerlendirme</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Güvenli İşlem</h3>
                <p className="text-gray-600">Tüm işlemleriniz güvence altında</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Esnek Vade</h3>
                <p className="text-gray-600">Size uygun vade seçenekleri</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hesaplama Formu */}
            <div>
              <CalculationForm
                calculationType="araba"
                onCalculate={handleCalculate}
                loading={loading}
              />
            </div>

            {/* Sonuç Tablosu */}
            <div>
              {result ? (
                <PaymentScheduleTable
                  result={result}
                  calculationType="araba"
                  financingType={result.schedule[0]?.status === 'accessible' ? 'cekilissiz' : 'cekilisli'}
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ödeme Planınızı Görün
                    </h3>
                    <p className="text-gray-600">
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