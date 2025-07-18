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

// User calculation types for authenticated users
export interface UserCalculation {
  id: string
  user_id: string
  user_email: string | null
  calculation_type: 'ev' | 'araba'
  financing_type: 'cekilisli' | 'cekilissiz'
  financing_amount: number
  down_payment: number
  organization_fee_rate: number
  monthly_payment: number
  annual_increase_rate?: number
  total_payment: number
  installment_count: number
  organization_fee: number
  net_financing: number
  required_payment: number
  accessible_month: number | null
  created_at: string
  updated_at: string
}

export interface UserPaymentSchedule {
  id: string
  user_calculation_id: string
  month_number: number
  payment_date: string
  payment_amount: number
  remaining_balance: number
  can_access_financing: boolean
  status: 'waiting' | 'lucky' | 'unlucky' | 'accessible' | 'financing_obtained'
  cumulative_payment: number
  created_at: string
}

// Blog types moved to lib/blog.ts for better organization