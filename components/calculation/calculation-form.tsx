'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { CurrencyInput } from '@/components/ui/currency-input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FormData, CalculationResult } from '@/lib/types'
import { validateCalculationParams } from '@/lib/calculations'
import { isUserLoggedIn, saveUserCalculation } from '@/lib/supabase'
import { AlertCircle, UserPlus, LogIn, Clock } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const formSchema = z.object({
  financingType: z.enum(['cekilisli', 'cekilissiz']),
  financingAmount: z.number().min(50000, 'Minimum 50.000 TL').max(5000000, 'Maksimum 5.000.000 TL'),
  downPayment: z.number().min(0, 'Negatif olamaz'),
  organizationFeeRate: z.number().min(5, 'Minimum %5').max(10, 'Maksimum %10'),
  monthlyPayment: z.number().min(1000, 'Minimum 1.000 TL'),
  annualIncreaseRate: z.number().optional()
})

interface CalculationFormProps {
  calculationType: 'ev' | 'araba'
  onCalculate: (data: FormData) => void
  loading?: boolean
  result?: CalculationResult | null
  initialValues?: Partial<FormData> | null
}

export function CalculationForm({ calculationType, onCalculate, loading, result, initialValues }: CalculationFormProps) {
  const [organizationFeeRate, setOrganizationFeeRate] = useState([7])
  const [isSaving, setIsSaving] = useState(false)
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)
  const router = useRouter()

  // Default değerler
  const defaultValues: FormData = {
    financingType: 'cekilissiz',
    financingAmount: 500000,
    downPayment: 0,
    organizationFeeRate: 7,
    monthlyPayment: 5000,
    annualIncreaseRate: 0
  }

  // Initial values ile default values'ı birleştir
  const getFormDefaults = (): FormData => {
    if (initialValues) {
      return {
        ...defaultValues,
        ...initialValues
      }
    }
    return defaultValues
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaults()
  })

  // initialValues değiştiğinde formu güncelle
  useEffect(() => {
    if (initialValues) {
      const newValues = getFormDefaults()
      
      reset(newValues)
      setOrganizationFeeRate([newValues.organizationFeeRate])
      
      // React Hook Form'a güvenelim, ayrı state kullanmayalım
      setValue('annualIncreaseRate', newValues.annualIncreaseRate || 0)
    }
  }, [initialValues, reset, setValue])

  const watchedValues = watch()
  const maxDownPayment = watchedValues.financingAmount * 0.5

  // LocalStorage işlemleri
  const saveFormDataToLocalStorage = (data: FormData) => {
    try {
      const formDataWithType = {
        ...data,
        calculationType,
        savedAt: Date.now()
      }
      localStorage.setItem('pending_calculation_data', JSON.stringify(formDataWithType))
    } catch (error) {
      console.error('Form verileri localStorage\'a kaydedilemedi:', error)
    }
  }

  const loadAndClearFormDataFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('pending_calculation_data')
      if (savedData) {
        localStorage.removeItem('pending_calculation_data')
        const parsedData = JSON.parse(savedData)
        
        // Eğer kayıtlı veri bu sayfa türü ile uyuşuyorsa ve 1 saatten eskisi değilse
        if (parsedData.calculationType === calculationType && 
            Date.now() - parsedData.savedAt < 3600000) {
          return parsedData
        }
      }
    } catch (error) {
      console.error('localStorage\'dan veri okunamadı:', error)
    }
    return null
  }

  // Sayfa yüklendiğinde localStorage'dan veri kontrolü
  useEffect(() => {
    const savedFormData = loadAndClearFormDataFromLocalStorage()
    if (savedFormData && !initialValues) {
      // Form verilerini yükle ve otomatik hesapla
      reset(savedFormData)
      setOrganizationFeeRate([savedFormData.organizationFeeRate])
      
      // Kısa bir gecikme ile hesaplamayı başlat
      setTimeout(() => {
        onCalculate(savedFormData)
        toast.success('Önceki form verileriniz yüklendi ve hesaplama yapıldı!')
      }, 1000)
    }
  }, [reset, onCalculate, calculationType, initialValues])

  const onSubmit = async (data: FormData) => {
    const validationErrors = validateCalculationParams({
      ...data,
      calculationType
    })

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error)
      })
      return
    }

    // Login durumunu kontrol et
    const userLoggedIn = await isUserLoggedIn()
    
    if (!userLoggedIn) {
      // Kullanıcı login değilse popup göster
      setPendingFormData(data)
      setShowAuthPopup(true)
      return
    }

    // Kullanıcı login ise direkt hesaplamaya devam et
    performCalculation(data)
  }

  const performCalculation = async (data: FormData) => {
    try {
      // Önce hesaplamayı yap
      onCalculate(data)

      // Sonra API'ye kaydet
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId()
        },
        body: JSON.stringify({
          ...data,
          calculationType
        })
      })

      if (!response || !response.ok) {
        const errorData = await response?.json()
        console.error('API Error:', errorData)
        toast.error('Hesaplama kaydedilemedi, ancak sonuçlar gösteriliyor.')
      } else {
        const result = await response.json()
        toast.success('Hesaplama başarıyla kaydedildi!')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Hesaplama kaydedilemedi, ancak sonuçlar gösteriliyor.')
    }
  }

  const handleAuthRedirect = (authType: 'login' | 'register') => {
    if (pendingFormData) {
      saveFormDataToLocalStorage(pendingFormData)
    }
    setShowAuthPopup(false)
    router.push(`/${authType}`)
  }

  const handleContinueWithoutAuth = () => {
    if (pendingFormData) {
      performCalculation(pendingFormData)
    }
    setShowAuthPopup(false)
    setPendingFormData(null)
  }

  // Basit session ID oluşturma
  const getSessionId = () => {
    let sessionId = localStorage.getItem('session-id')
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('session-id', sessionId)
    }
    return sessionId
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{calculationType === 'ev' ? 'Ev' : 'Araba'} Finansman Hesaplayıcı</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Finansman Tipi */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Finansman Tipi</Label>
            <RadioGroup
              value={watchedValues.financingType}
              onValueChange={(value) => {
                setValue('financingType', value as 'cekilisli' | 'cekilissiz')
                // Çekilişli seçildiğinde peşinatı sıfırla
                if (value === 'cekilisli') {
                  setValue('downPayment', 0)
                }
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cekilissiz" id="cekilissiz" />
                <Label htmlFor="cekilissiz" className="cursor-pointer">
                  Çekilişsiz - Finansman tarihini kendiniz belirleyin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cekilisli" id="cekilisli" />
                <Label htmlFor="cekilisli" className="cursor-pointer">
                  Çekilişli - Rastgele çekiliş ile finansman tarihi belirlenir
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Finansman Miktarı */}
          <div className="space-y-2">
            <Label htmlFor="financingAmount" className="text-base font-medium">
              Finansman Miktarı
            </Label>
            <CurrencyInput
              id="financingAmount"
              value={watchedValues.financingAmount}
              onChange={(value) => setValue('financingAmount', value)}
              placeholder="500.000"
            />
            {errors.financingAmount && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.financingAmount.message}</span>
              </p>
            )}
          </div>

          {/* Peşinat Tutarı - Sadece çekilişsiz finansmanda göster */}
          {watchedValues.financingType === 'cekilissiz' && (
            <div className="space-y-2">
              <Label htmlFor="downPayment" className="text-base font-medium">
                Peşinat Tutarı (İsteğe Bağlı)
              </Label>
              <CurrencyInput
                id="downPayment"
                value={watchedValues.downPayment}
                onChange={(value) => setValue('downPayment', Math.min(value, maxDownPayment))}
                placeholder="0"
              />
              <p className="text-sm text-gray-500">
                Maksimum: {new Intl.NumberFormat('tr-TR').format(maxDownPayment)} TL (Finansman tutarının %50'si)
              </p>
              {errors.downPayment && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.downPayment.message}</span>
                </p>
              )}
            </div>
          )}

          {/* Organizasyon Ücreti */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Organizasyon Ücreti: %{organizationFeeRate[0]}
            </Label>
            <Slider
              value={organizationFeeRate}
              onValueChange={(value) => {
                setOrganizationFeeRate(value)
                setValue('organizationFeeRate', value[0])
              }}
              max={10}
              min={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>%5</span>
              <span>%10</span>
            </div>
          </div>

          {/* Aylık Taksit */}
          <div className="space-y-2">
            <Label htmlFor="monthlyPayment" className="text-base font-medium">
              Aylık Taksit Tutarı
            </Label>
            <CurrencyInput
              id="monthlyPayment"
              value={watchedValues.monthlyPayment}
              onChange={(value) => setValue('monthlyPayment', value)}
              placeholder="5.000"
            />
            {errors.monthlyPayment && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.monthlyPayment.message}</span>
              </p>
            )}
          </div>

          {/* Aylık Taksit Artış Oranı */}
          <div className="space-y-2">
            <Label htmlFor="annualIncreaseRate" className="text-base font-medium">
              Aylık Taksitim Yılda Yüzde Kaç Artsın? (İsteğe Bağlı)
            </Label>
            <Select
              key={`annual-increase-${watchedValues.annualIncreaseRate || 0}`}
              defaultValue={(watchedValues.annualIncreaseRate || 0).toString()}
              onValueChange={(value) => {
                
                // Boş değer gelirse ignore et
                if (value === '') {
                  return
                }
                
                setValue('annualIncreaseRate', Number(value))
              }}
            >
              <SelectTrigger id="annualIncreaseRate">
                <SelectValue placeholder="Artış oranı seçin..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Artış Yok</SelectItem>
                <SelectItem value="5">%5</SelectItem>
                <SelectItem value="10">%10</SelectItem>
                <SelectItem value="15">%15</SelectItem>
                <SelectItem value="20">%20</SelectItem>
                <SelectItem value="25">%25</SelectItem>
                <SelectItem value="30">%30</SelectItem>
                <SelectItem value="35">%35</SelectItem>
                <SelectItem value="40">%40</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hesapla Butonu */}
          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Hesaplanıyor...</span>
              </div>
            ) : (
              'Ödeme Planını Hesapla'
            )}
          </Button>

          {/* Uyarı Notu */}
          <div className="text-sm text-red-600 leading-relaxed">
            <strong>Not:</strong> Finansman hesaplama algoritmamız evim şirketlerinin temel hesaplama sistemlerine göre uyarlanmıştır. Şirketlerden kampanyalar dahilinde daha avantajlı veya dezavantajlı teklifler almanız olasıdır.
          </div>
        </form>

        {/* Auth Popup */}
        <Dialog open={showAuthPopup}>
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span>Ödeme Planınız Oluşturuluyor</span>
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed pt-2">
                <strong>evimsistemleri.com</strong>'a tamamen ücretsiz bir şekilde üye olmanız durumunda 
                hesaplamalarınızı profil sayfanızdan takip edebilir ve dilediğiniz zaman tekrar erişebilirsiniz.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 pt-4">
              {/* Login Butonu */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Zaten üye misiniz?</p>
                <Button
                  onClick={() => handleAuthRedirect('login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Giriş Yap
                </Button>
              </div>

              {/* Register Butonu */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Üye değil misiniz?</p>
                <Button
                  onClick={() => handleAuthRedirect('register')}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Kayıt Ol
                </Button>
              </div>

              {/* Devam Et Butonu */}
              <div className="pt-2 border-t">
                <Button
                  onClick={handleContinueWithoutAuth}
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700"
                >
                  Belki, Daha Sonra
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}