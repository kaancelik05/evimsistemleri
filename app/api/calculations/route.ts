import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabase'
// import { CalculationParams } from '@/lib/types'
// import { validateCalculationParams } from '@/lib/calculations'

export async function POST(request: NextRequest) {
  // Geçici olarak tüm mantığı devre dışı bırakıp basit bir yanıt döndürüyoruz.
  // Bu, Netlify'ın API rotasını doğru şekilde oluşturup oluşturmadığını test etmek içindir.
  return NextResponse.json({
    status: 'success',
    message: 'API route is working correctly on Netlify.',
    timestamp: new Date().toISOString()
  })

  /*
  // -- ORİJİNAL KOD --
  try {
    const body: CalculationParams = await request.json()
    
    // Validasyon
    const errors = validateCalculationParams(body)
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Veritabanına kaydet
    const { data, error } = await supabase
      .from('calculations')
      .insert({
        user_session: request.headers.get('x-session-id') || 'anonymous',
        calculation_type: body.calculationType,
        financing_type: body.financingType,
        financing_amount: body.financingAmount,
        down_payment: body.downPayment,
        organization_fee_rate: body.organizationFeeRate,
        monthly_payment: body.monthlyPayment,
        total_installments: Math.ceil(
          (body.financingAmount + (body.financingAmount * body.organizationFeeRate / 100) - (body.downPayment || 0)) / body.monthlyPayment
        )
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save calculation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
  */
}