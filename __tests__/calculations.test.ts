import { calculatePaymentPlan, formatCurrency, validateCalculationParams } from '@/lib/calculations'
import { CalculationParams } from '@/lib/types'

describe('Calculation Functions', () => {
  const mockParams: CalculationParams = {
    financingAmount: 500000,
    downPayment: 100000,
    organizationFeeRate: 7,
    monthlyPayment: 5000,
    financingType: 'cekilissiz',
    calculationType: 'ev'
  }

  describe('calculatePaymentPlan', () => {
    it('should calculate payment plan correctly', () => {
      const result = calculatePaymentPlan(mockParams)
      
      expect(result.organizationFee).toBe(35000) // 500000 * 0.07
      expect(result.netFinancing).toBe(400000) // 500000 - 100000
      expect(result.totalPayment).toBe(535000) // 500000 + 35000
      expect(result.schedule).toHaveLength(result.installmentCount)
    })

    it('should handle zero down payment', () => {
      const paramsWithoutDownPayment = { ...mockParams, downPayment: 0 }
      const result = calculatePaymentPlan(paramsWithoutDownPayment)
      
      expect(result.requiredPayment).toBe(200000) // 40% of financing amount
    })

    it('should calculate required payment correctly with down payment', () => {
      const result = calculatePaymentPlan(mockParams)
      
      expect(result.requiredPayment).toBe(100000) // 25% of net financing (400000 * 0.25)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(500000)).toBe('₺500.000')
      expect(formatCurrency(1234567)).toBe('₺1.234.567')
    })
  })

  describe('validateCalculationParams', () => {
    it('should return no errors for valid params', () => {
      const errors = validateCalculationParams(mockParams)
      expect(errors).toHaveLength(0)
    })

    it('should return error for low financing amount', () => {
      const invalidParams = { ...mockParams, financingAmount: 30000 }
      const errors = validateCalculationParams(invalidParams)
      expect(errors).toContain('Finansman tutarı en az 50.000 TL olmalıdır')
    })

    it('should return error for high down payment', () => {
      const invalidParams = { ...mockParams, downPayment: 300000 }
      const errors = validateCalculationParams(invalidParams)
      expect(errors).toContain('Peşinat tutarı finansman tutarının %50\'sini geçemez')
    })
  })
})