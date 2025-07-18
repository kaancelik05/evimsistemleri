"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CalculationForm } from "@/components/calculation/calculation-form";
import { PaymentScheduleTable } from "@/components/calculation/payment-schedule-table";
import { FormData, CalculationResult } from "@/lib/types";
import { isUserLoggedIn, saveUserCalculation } from "@/lib/supabase";
import { Car, Zap, Shield, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ArabaFinansmanPage() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<FormData> | null>(null);
  
  const searchParams = useSearchParams();

  // URL parametrelerini oku ve form verilerine dönüştür
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.size > 0) {
      const initialData: Partial<FormData> = {};
      
      if (params.get('financingType')) {
        initialData.financingType = params.get('financingType') as 'cekilisli' | 'cekilissiz';
      }
      
      if (params.get('financingAmount')) {
        initialData.financingAmount = Number(params.get('financingAmount'));
      }
      
      if (params.get('downPayment')) {
        initialData.downPayment = Number(params.get('downPayment'));
      }
      
      if (params.get('monthlyPayment')) {
        initialData.monthlyPayment = Number(params.get('monthlyPayment'));
      }
      
      if (params.get('organizationFeeRate')) {
        initialData.organizationFeeRate = Number(params.get('organizationFeeRate'));
      }
      
      if (params.get('annualIncreaseRate')) {
        initialData.annualIncreaseRate = Number(params.get('annualIncreaseRate'));
      }
      
      setInitialFormData(initialData);
    }
  }, [searchParams]);

  const handleCalculate = (data: FormData) => {
    setLoading(true);
    setFormData(data);

    // Create a new worker instance
    const worker = new Worker(
      new URL("@/workers/calculation.worker.ts", import.meta.url),
    );

    // Listen for messages from the worker
    worker.onmessage = async (event: MessageEvent<CalculationResult>) => {
      const calculationResult = event.data;
      setResult(calculationResult);
      setLoading(false);
      worker.terminate(); // Clean up the worker
      
      // Kullanıcı login durumunda verileri Supabase'e kaydet
      try {
        const userLoggedIn = await isUserLoggedIn();
        if (userLoggedIn) {
          const saveResult = await saveUserCalculation(data, calculationResult, "araba");
          if (saveResult.success) {
            toast.success("Hesaplama kaydedildi! Artık hesaplama geçmişinizden erişebilirsiniz.");
          } else {
            console.error("Hesaplama kaydedilemedi:", saveResult.error);
            // Kullanıcıya hata göstermeyeceğiz, sessizce kaydedemedik
          }
        }
      } catch (error) {
        console.error("Hesaplama kaydetme hatası:", error);
        // Kullanıcıya hata göstermeyeceğiz, sessizce kaydedemedik
      }
    };

    // Handle errors from the worker
    worker.onerror = (error) => {
      console.error("Worker error:", error);
      setLoading(false);
      worker.terminate();
    };

    // Send data to the worker
    worker.postMessage({
      ...data,
      calculationType: "araba",
    });
  };

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
              Hayalinizdeki arabaya kavuşmanın en kolay yolu. Faizsiz finansman
              sistemi ile ödeme planınızı hemen hesaplayın.
            </p>

            <div className="mt-8 flex items-center justify-center space-x-6">
              <div className="flex items-center text-emerald-100">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  Peşinatlı & Peşinatsız
                </span>
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Hızlı Hesaplama
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Araba finansmanında anında hesaplama ve detaylı karşılaştırma
                  imkanı
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Güvenli İşlem
                </h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Esnek Vade
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Size en uygun vade seçenekleri ile rahat ödeme planı
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="space-y-12">
            {/* Calculation Form */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hesaplamanızı Başlatın</h2>
                <p className="text-gray-600 text-lg">Aşağıdaki bilgileri doldurun ve size özel ödeme planınızı görün</p>
              </div>
              <CalculationForm
                calculationType="araba"
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
                    calculationType="araba"
                    financingType={formData.financingType}
                  />
                </div>
              ) : (
                <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100/50 backdrop-blur-sm">
                  <CardContent className="text-center py-16 px-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Car className="h-12 w-12 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ödeme Planınızı Görün
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                       Yukarıdaki formu doldurarak detaylı ödeme planınızı hesaplayın ve hayalinizdeki arabaya kavuşun
                      </p>
                      <div className="mt-8 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
