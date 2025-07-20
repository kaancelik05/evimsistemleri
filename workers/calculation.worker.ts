import { addMonths } from 'date-fns'
import { CalculationParams, CalculationResult, PaymentScheduleItem } from '@/lib/types'

// This function is the entry point for the worker
self.onmessage = (event: MessageEvent<CalculationParams>) => {
  const result = calculatePaymentPlan(event.data)
  self.postMessage(result)
}

function calculatePaymentPlan(params: CalculationParams): CalculationResult {
  let {
    financingAmount,
    downPayment = 0,
    organizationFeeRate,
    monthlyPayment,
    financingType,
    annualIncreaseRate = 0
  } = params

  const organizationFee = financingAmount * (organizationFeeRate / 100)
  // Organizasyon ücreti ödeme planına dahil edilmez (sözleşme anında alınır)
  let remainingBalance = financingAmount - downPayment

  // --- Çekilişli Sistem için Taksit ve Grup Sayısı Ayarlaması ---
  if (financingType === 'cekilisli') {
    const groupSize = Math.ceil(financingAmount / monthlyPayment)
    monthlyPayment = financingAmount / groupSize
  }

  const schedule: PaymentScheduleItem[] = []
  const startDate = new Date()

  let cumulativePayment = downPayment
  let accessibleMonth: number | null = null
  const accessibilityThreshold = financingAmount * 0.4

  let month = 0
  let currentMonthlyPayment = monthlyPayment
  const increaseFactor = 1 + annualIncreaseRate / 100

  // --- Ödeme Planı ve Erişim Ayı Hesaplama (Dinamik Taksit) ---
  while (remainingBalance > 0) {
    month++

    // Her 12 ayda bir taksiti artır (ilk yıldan sonra)
    if (annualIncreaseRate > 0 && month > 1 && (month - 1) % 12 === 0) {
      currentMonthlyPayment *= increaseFactor
    }

    const currentPayment = Math.min(currentMonthlyPayment, remainingBalance)
    const cumulativePaymentAtMonthEnd = cumulativePayment + currentPayment

    if (accessibleMonth === null && cumulativePaymentAtMonthEnd >= accessibilityThreshold) {
      accessibleMonth = Math.max(month, 6) // Erişim ayı minimum 6 olmalı
    }

    schedule.push({
      monthNumber: month,
      paymentDate: new Date(addMonths(startDate, month - 1)).toISOString(), // İlk taksit bu ay başlar
      paymentAmount: currentPayment,
      cumulativePayment: cumulativePaymentAtMonthEnd,
      remainingBalance: Math.max(0, remainingBalance - currentPayment),
      canAccessFinancing: false,
      status: 'waiting'
    })

    cumulativePayment = cumulativePaymentAtMonthEnd
    remainingBalance -= currentPayment
  }
  
  const installmentCount = month

  // Erişim ayının geçerli aralıkta olduğundan emin ol
  if (accessibleMonth !== null && accessibleMonth > installmentCount) {
    accessibleMonth = installmentCount
  }

  // --- Durumları ve Finansal Erişimi Ayarla ---
  let financingObtained = false
  schedule.forEach(item => {
    item.canAccessFinancing = accessibleMonth !== null && item.monthNumber === accessibleMonth

    if (accessibleMonth === null) {
      item.status = 'waiting'
      return
    }

    if (financingObtained) {
      item.status = 'financing_obtained'
      return
    }

    if (item.monthNumber < 6) {
      item.status = 'waiting'
    } else if (financingType === 'cekilisli') {
      if (item.monthNumber < accessibleMonth) {
        item.status = 'lucky'
      } else if (item.monthNumber === accessibleMonth) {
        item.status = 'accessible'
        financingObtained = true
      }
    } else { // Çekilişsiz
      if (item.monthNumber < accessibleMonth) {
        item.status = 'waiting'
      } else if (item.monthNumber === accessibleMonth) {
        item.status = 'accessible'
        financingObtained = true
      }
    }
  })

  return {
    schedule,
    totalPayment: financingAmount, // Sadece finansman tutarı (organizasyon ücreti ayrı)
    installmentCount,
    organizationFee,
    netFinancing: financingAmount - downPayment,
    requiredPayment: accessibilityThreshold,
    accessibleMonth
  }
} 