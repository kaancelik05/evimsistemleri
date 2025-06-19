import { CalculationParams } from './types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(date: Date): string {
  return format(date, 'dd MMMM yyyy', { locale: tr })
}

export function validateCalculationParams(params: Partial<CalculationParams>): string[] {
  const errors: string[] = []

  if (!params.financingAmount || params.financingAmount < 50000) {
    errors.push('Finansman tutarı en az 50.000 TL olmalıdır')
  }

  if (params.financingAmount && params.financingAmount > 5000000) {
    errors.push('Finansman tutarı en fazla 5.000.000 TL olabilir')
  }

  if (params.downPayment && params.financingAmount && params.downPayment > params.financingAmount * 0.5) {
    errors.push('Peşinat tutarı finansman tutarının %50\'sini geçemez')
  }

  if (!params.monthlyPayment || params.monthlyPayment < 1000) {
    errors.push('Aylık taksit tutarı en az 1.000 TL olmalıdır')
  }

  if (!params.organizationFeeRate || params.organizationFeeRate < 5 || params.organizationFeeRate > 10) {
    errors.push('Organizasyon ücreti %5-10 arasında olmalıdır')
  }

  return errors
}