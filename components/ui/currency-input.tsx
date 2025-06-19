'use client'

import { forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
  className?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^\d]/g, '')
      const numericValue = parseInt(rawValue) || 0
      onChange?.(numericValue)
    }

    const formatValue = (val: number) => {
      return new Intl.NumberFormat('tr-TR').format(val)
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={value ? formatValue(value) : ''}
          onChange={handleChange}
          className={cn('pr-12', className)}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-sm">TL</span>
        </div>
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'