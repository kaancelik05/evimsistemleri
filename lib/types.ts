export interface CalculationParams {
  financingAmount: number
  downPayment: number
  organizationFeeRate: number
  monthlyPayment: number
  financingType: 'cekilisli' | 'cekilissiz'
  calculationType: 'ev' | 'araba'
  annualIncreaseRate?: number
}

export interface PaymentScheduleItem {
  monthNumber: number
  paymentDate: string
  paymentAmount: number
  remainingBalance: number
  canAccessFinancing: boolean
  status: 'waiting' | 'lucky' | 'unlucky' | 'accessible' | 'financing_obtained'
  cumulativePayment: number
}

export interface CalculationResult {
  schedule: PaymentScheduleItem[]
  totalPayment: number
  installmentCount: number
  organizationFee: number
  netFinancing: number
  requiredPayment: number
  accessibleMonth: number | null
}

export interface FormData {
  financingType: 'cekilisli' | 'cekilissiz'
  financingAmount: number
  downPayment: number
  organizationFeeRate: number
  monthlyPayment: number
  annualIncreaseRate?: number
}

// Blog types moved to lib/blog.ts for better organization