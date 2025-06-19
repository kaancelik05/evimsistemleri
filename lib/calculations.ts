import { CalculationParams, CalculationResult, PaymentScheduleItem } from './types'
import { addMonths, format } from 'date-fns'
import { tr } from 'date-fns/locale'

export function calculatePaymentPlan(params: CalculationParams): CalculationResult {
  const {
    financingAmount,
    downPayment = 0,
    organizationFeeRate,
    monthlyPayment,
    financingType
  } = params

  // Organizasyon ücreti hesaplama
  const organizationFee = financingAmount * (organizationFeeRate / 100)
  const netFinancing = financingAmount - downPayment

  // Minimum ödeme kontrolü
  const requiredPayment = downPayment > 0
    ? netFinancing * 0.25  // Peşinatlı: %25
    : financingAmount * 0.40  // Peşinatsız: %40

  // Toplam ödeme tutarı
  const totalPayment = financingAmount + organizationFee

  // Taksit sayısı hesaplama
  const remainingAmount = totalPayment - downPayment
  const installmentCount = Math.ceil(remainingAmount / monthlyPayment)

  // Ödeme tablosu oluşturma
  const schedule = generatePaymentSchedule({
    installmentCount,
    monthlyPayment,
    financingType,
    requiredPayment,
    downPayment,
    remainingAmount
  })

  // Erişim ayını bulma
  const accessibleMonth = findAccessibleMonth(schedule, requiredPayment)

  return {
    schedule,
    totalPayment,
    installmentCount,
    organizationFee,
    netFinancing,
    requiredPayment,
    accessibleMonth
  }
}

interface ScheduleParams {
  installmentCount: number
  monthlyPayment: number
  financingType: 'cekilisli' | 'cekilissiz'
  requiredPayment: number
  downPayment: number
  remainingAmount: number
}

function generatePaymentSchedule(params: ScheduleParams): PaymentScheduleItem[] {
  const { installmentCount, monthlyPayment, financingType, requiredPayment, downPayment, remainingAmount } = params
  const schedule: PaymentScheduleItem[] = []
  const startDate = new Date()
  
  let cumulativePayment = downPayment
  let remainingBalance = remainingAmount

  for (let month = 1; month <= installmentCount; month++) {
    const paymentDate = addMonths(startDate, month)
    const isLastPayment = month === installmentCount
    const currentPayment = isLastPayment ? remainingBalance : monthlyPayment
    
    cumulativePayment += currentPayment
    remainingBalance -= currentPayment

    // Durum belirleme
    let status: PaymentScheduleItem['status'] = 'waiting'
    let canAccessFinancing = false

    if (month <= 5) {
      // İlk 5 ay erişim yok
      status = 'waiting'
      canAccessFinancing = false
    } else if (cumulativePayment >= requiredPayment) {
      if (financingType === 'cekilissiz') {
        status = 'accessible'
        canAccessFinancing = true
      } else {
        // Çekilişli sistem - rastgele şans
        const isLucky = Math.random() > 0.5
        status = isLucky ? 'lucky' : 'unlucky'
        canAccessFinancing = isLucky
      }
    }

    schedule.push({
      monthNumber: month,
      paymentDate,
      paymentAmount: currentPayment,
      remainingBalance: Math.max(0, remainingBalance),
      canAccessFinancing,
      status,
      cumulativePayment
    })
  }

  return schedule
}

function findAccessibleMonth(schedule: PaymentScheduleItem[], requiredPayment: number): number | null {
  for (const item of schedule) {
    if (item.cumulativePayment >= requiredPayment && item.monthNumber > 5) {
      return item.monthNumber
    }
  }
  return null
}

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