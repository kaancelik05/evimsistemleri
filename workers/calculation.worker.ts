import { addMonths } from 'date-fns'
import { CalculationParams, CalculationResult, PaymentScheduleItem } from '@/lib/types';

// This function is the entry point for the worker
self.onmessage = (event: MessageEvent<CalculationParams>) => {
  const result = calculatePaymentPlan(event.data);
  self.postMessage(result);
};

// The following functions are moved from lib/calculations.ts

function calculateStandardAccessibleMonth(params: CalculationParams): number | null {
  const { downPayment = 0, financingAmount, organizationFeeRate, monthlyPayment } = params;
  
  const organizationFee = financingAmount * (organizationFeeRate / 100);
  const netFinancing = financingAmount - downPayment;
  const requiredPayment = downPayment > 0 ? netFinancing * 0.25 : financingAmount * 0.40;
  const totalPayment = financingAmount + organizationFee;
  const remainingAmount = totalPayment - downPayment;
  const installmentCount = Math.ceil(remainingAmount / monthlyPayment);

  let cumulativePayment = downPayment;
  for (let month = 1; month <= installmentCount; month++) {
    if (month > 5 && cumulativePayment >= requiredPayment) {
      return month;
    }
    const isLastPayment = month === installmentCount;
    const currentPayment = isLastPayment ? (totalPayment - downPayment) - cumulativePayment : monthlyPayment;
    cumulativePayment += currentPayment;
  }
  return null;
}

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
  const requiredPayment = downPayment > 0 ? netFinancing * 0.25 : financingAmount * 0.40
  
  // Total cost for user, for display purposes.
  const totalPaymentForDisplay = financingAmount + organizationFee
  
  // The amount to be paid off via installments is only the financing amount minus downpayment.
  const amountToFinanceViaInstallments = financingAmount - downPayment
  const installmentCount = Math.ceil(amountToFinanceViaInstallments / monthlyPayment)

  const { schedule, accessibleMonth } = generatePaymentSchedule({
    installmentCount,
    monthlyPayment,
    financingType,
    requiredPayment,
    downPayment,
    remainingAmount: amountToFinanceViaInstallments,
    totalPayment: financingAmount, // Pass the financing amount as the total to be paid back.
  })

  return {
    schedule,
    totalPayment: totalPaymentForDisplay,
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
  totalPayment: number
}

function generatePaymentSchedule(params: ScheduleParams): { schedule: PaymentScheduleItem[], accessibleMonth: number | null } {
  const { installmentCount, monthlyPayment, financingType, requiredPayment, downPayment, remainingAmount, totalPayment } = params
  const schedule: PaymentScheduleItem[] = []
  const startDate = new Date()
  
  // 1. Determine the single, standard accessible month.
  let standardAccessibleMonth: number | null = null;
  let tempCumulative = downPayment;
  for (let m = 1; m <= installmentCount; m++) {
      if (m > 5 && tempCumulative >= requiredPayment) {
          standardAccessibleMonth = m;
          break; 
      }
      const isLast = m === installmentCount;
      const payment = isLast ? remainingAmount - (tempCumulative - downPayment) : monthlyPayment;
      tempCumulative += payment;
  }
  // Check last month separately
  if (!standardAccessibleMonth && tempCumulative >= requiredPayment && installmentCount > 5) {
    standardAccessibleMonth = installmentCount;
  }


  // 2. The access month is now deterministic for both types.
  const finalAccessibleMonth = standardAccessibleMonth;

  // 3. Build the schedule array with the correct statuses based on financing type
  let cumulativePayment = downPayment;
  let remainingBalance = remainingAmount;

  for (let month = 1; month <= installmentCount; month++) {
    const paymentDate = addMonths(startDate, month)
    const isLastPayment = month === installmentCount
    const currentPayment = isLastPayment ? remainingBalance : monthlyPayment
    
    cumulativePayment += currentPayment
    remainingBalance -= currentPayment

    let status: PaymentScheduleItem['status'] = 'waiting';
    let canAccessFinancing = false;
    
    if (financingType === 'cekilissiz') {
        if (finalAccessibleMonth) {
            if (month < finalAccessibleMonth) {
                status = 'waiting';
            } else if (month === finalAccessibleMonth) {
                canAccessFinancing = true;
                status = 'accessible';
            } else { // month > finalAccessibleMonth
                status = 'financing_obtained';
            }
        } else {
            status = 'waiting';
        }
    } else { // financingType === 'cekilisli'
        if (finalAccessibleMonth) {
            if (month <= 5) {
                status = 'waiting';
            } else if (month > 5 && month <= finalAccessibleMonth) {
                status = 'lucky'; // "Şanslı Çekiliş" periyodu
            } else { // month > finalAccessibleMonth
                status = 'unlucky'; // "Şanssız Çekiliş" periyodu
            }
            
            if (month === finalAccessibleMonth) {
                canAccessFinancing = true;
            }
        } else {
            // Never eligible
            status = 'waiting';
        }
    }

    schedule.push({
      monthNumber: month,
      paymentDate: paymentDate.toISOString(),
      paymentAmount: currentPayment,
      remainingBalance: Math.max(0, remainingBalance),
      canAccessFinancing,
      status,
      cumulativePayment
    });
  }

  return { schedule, accessibleMonth: finalAccessibleMonth };
} 