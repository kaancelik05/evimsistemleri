'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { CurrencyInput } from '@/components/ui/currency-input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FormData } from '@/lib/types'
import { validateCalculationParams } from '@/lib/calculations'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

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
}

export function CalculationForm({ calculationType, onCalculate, loading }: CalculationFormProps) {
  const [organizationFeeRate, setOrganizationFeeRate] = useState([7])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financingType: 'cekilissiz',
      financingAmount: 500000,
      downPayment: 0,
      organizationFeeRate: 7,
      monthlyPayment: 5000,
      annualIncreaseRate: 0
    }
  })

  const watchedValues = watch()
  const maxDownPayment = watchedValues.financingAmount * 0.5

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
              onValueChange={(value) => setValue('financingType', value as 'cekilisli' | 'cekilissiz')}
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

          {/* Peşinat Tutarı */}
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
              value={watchedValues.annualIncreaseRate?.toString() || '0'}
              onValueChange={(value) => setValue('annualIncreaseRate', Number(value))}
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
        </form>
      </CardContent>
    </Card>
  )
}