'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalculationForm } from '@/components/calculation/calculation-form'
import { PaymentScheduleTable } from '@/components/calculation/payment-schedule-table'
import { FormData, CalculationResult } from '@/lib/types'
import { isUserLoggedIn, saveUserCalculation } from '@/lib/supabase'
import { Home, TrendingUp, Shield, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export default function EvFinansmanPage() {
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialFormData, setInitialFormData] = useState<Partial<FormData> | null>(null)
  
  const searchParams = useSearchParams()

  // URL parametrelerini oku ve form verilerine dönüştür
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (params.size > 0) {
      const initialData: Partial<FormData> = {}
      
      if (params.get('financingType')) {
        initialData.financingType = params.get('financingType') as 'cekilisli' | 'cekilissiz'
      }
      
      if (params.get('financingAmount')) {
        initialData.financingAmount = Number(params.get('financingAmount'))
      }
      
      if (params.get('downPayment')) {
        initialData.downPayment = Number(params.get('downPayment'))
      }
      
      if (params.get('monthlyPayment')) {
        initialData.monthlyPayment = Number(params.get('monthlyPayment'))
      }
      
      if (params.get('organizationFeeRate')) {
        initialData.organizationFeeRate = Number(params.get('organizationFeeRate'))
      }
      
      if (params.get('annualIncreaseRate')) {
        initialData.annualIncreaseRate = Number(params.get('annualIncreaseRate'))
      }
      
      setInitialFormData(initialData)
    }
  }, [searchParams])

  const handleCalculate = (data: FormData) => {
    setLoading(true)
    setFormData(data)
    
    // Create a new worker instance
    const worker = new Worker(new URL('@/workers/calculation.worker.ts', import.meta.url))

    // Listen for messages from the worker
    worker.onmessage = async (event: MessageEvent<CalculationResult>) => {
      const calculationResult = event.data
      setResult(calculationResult)
      setLoading(false)
      worker.terminate() // Clean up the worker
      
      // Kullanıcı login durumunda verileri Supabase'e kaydet
      try {
        const userLoggedIn = await isUserLoggedIn()
        if (userLoggedIn) {
          const saveResult = await saveUserCalculation(data, calculationResult, 'ev')
          if (saveResult.success) {
            toast.success('Hesaplama kaydedildi! Artık hesaplama geçmişinizden erişebilirsiniz.')
          } else {
            console.error('Hesaplama kaydedilemedi:', saveResult.error)
            // Kullanıcıya hata göstermeyeceğiz, sessizce kaydedemedik
          }
        }
      } catch (error) {
        console.error('Hesaplama kaydetme hatası:', error)
        // Kullanıcıya hata göstermeyeceğiz, sessizce kaydedemedik
      }
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
      calculationType: 'ev'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 ring-1 ring-white/20">
              <Home className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Ev Finansmanı
              <span className="block text-3xl md:text-5xl bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Hesaplayıcı
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
              Hayalinizdeki eve kavuşmanın en kolay yolu. Faizsiz finansman sistemi ile ödeme planınızı hemen hesaplayın.
            </p>
            <div className="flex items-center justify-center mt-8 space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-blue-200 text-sm font-medium">Peşinatlı ve peşinatsız seçenekler mevcut</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Güvenli Sistem</h3>
                <p className="text-gray-600 leading-relaxed">Şeffaf ve güvenilir ev finansmanı çözümleri ile hayallerinize ulaşın</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Esnek Ödeme</h3>
                <p className="text-gray-600 leading-relaxed">Size uygun aylık taksit seçenekleri ile rahat ödeme planları</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Hızlı Süreç</h3>
                <p className="text-gray-600 leading-relaxed">Kolaylıkla bilgilerini gir, hesapla ve karşılaştır</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Calculation Form */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hesaplamanızı Başlatın</h2>
                <p className="text-gray-600 text-lg">Aşağıdaki bilgileri doldurun ve size özel ödeme planınızı görün</p>
              </div>
              <CalculationForm
                calculationType="ev"
                onCalculate={handleCalculate}
                loading={loading}
                initialValues={initialFormData}
              />
            </div>

            {/* Results Separator */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50 px-2 text-gray-500">
                  <Sparkles className="h-5 w-5 text-gray-400" />
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ödeme Planınız</h2>
                <p className="text-gray-600 text-lg">Hesaplama sonucunuz burada görünecek</p>
              </div>
              
              {result && formData ? (
                <div className="space-y-4">
                  <PaymentScheduleTable
                    result={result}
                    formData={formData}
                    calculationType="ev"
                    financingType={formData.financingType}
                  />
                </div>
              ) : (
                <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50 backdrop-blur-sm">
                  <CardContent className="text-center py-16 px-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl mb-6">
                      <Home className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Ödeme Planınızı Görün
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                      Yukarıdaki formu doldurarak detaylı ödeme planınızı hesaplayın ve hayalinizdeki eve kavuşun
                    </p>
                    <div className="mt-8 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
