import { addMonths } from 'date-fns'
import { CalculationParams, CalculationResult, PaymentScheduleItem } from '@/lib/types';

// This function is the entry point for the worker
self.onmessage = (event: MessageEvent<CalculationParams>) => {
  const result = calculatePaymentPlan(event.data);
  self.postMessage(result);
};

// The following functions are moved from lib/calculations.ts

function calculatePaymentPlan(params: CalculationParams): CalculationResult {
  const {
    financingAmount,
    downPayment = 0,
    organizationFeeRate,
    monthlyPayment,
    financingType
  } = params

  const organizationFee = financingAmount * (organizationFeeRate / 100)
  const netFinancing = financingAmount - downPayment

  const requiredPayment = downPayment > 0
    ? netFinancing * 0.25
    : financingAmount * 0.40

  const totalPayment = financingAmount + organizationFee

  const remainingAmount = totalPayment - downPayment
  const installmentCount = Math.ceil(remainingAmount / monthlyPayment)

  const schedule = generatePaymentSchedule({
    installmentCount,
    monthlyPayment,
    financingType,
    requiredPayment,
    downPayment,
    remainingAmount
  })

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

    let status: PaymentScheduleItem['status'] = 'waiting'
    let canAccessFinancing = false

    if (month <= 5) {
      status = 'waiting'
      canAccessFinancing = false
    } else if (cumulativePayment >= requiredPayment) {
      if (financingType === 'cekilissiz') {
        status = 'accessible'
        canAccessFinancing = true
      } else {
        const isLucky = Math.random() > 0.5
        status = isLucky ? 'lucky' : 'unlucky'
        canAccessFinancing = isLucky
      }
    }

    schedule.push({
      monthNumber: month,
      paymentDate: paymentDate.toISOString(), // Use string to pass through worker
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