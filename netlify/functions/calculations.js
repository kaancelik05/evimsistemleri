const { createClient } = require('@supabase/supabase-js')

// Supabase istemcisini başlat
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in environment variables')
}
const supabase = createClient(supabaseUrl, supabaseKey)

// Gelen isteği doğrulamak için yardımcı fonksiyon
function validateCalculationParams(body) {
  const errors = []
  if (!body.financingAmount || body.financingAmount < 50000 || body.financingAmount > 5000000) {
    errors.push('Finansman tutarı 50.000 TL ile 5.000.000 TL arasında olmalıdır.')
  }
  if (body.downPayment && body.financingAmount && body.downPayment > body.financingAmount * 0.5) {
    errors.push("Peşinat, finansman tutarının %50'sini geçemez.")
  }
  if (!body.monthlyPayment || body.monthlyPayment < 1000) {
    errors.push('Aylık taksit en az 1.000 TL olmalıdır.')
  }
  if (!body.organizationFeeRate || body.organizationFeeRate < 5 || body.organizationFeeRate > 10) {
    errors.push('Organizasyon ücreti %5 ile %10 arasında olmalıdır.')
  }
  return errors
}

// Ana Netlify Function Handler
exports.handler = async (event) => {
  // Gelen isteklere izin vermek için CORS başlıkları
  const headers = {
    'Access-Control-Allow-Origin': '*', // Veya daha güvenli bir alan adı: 'https://loquacious-halva-e5d680.netlify.app'
    'Access-Control-Allow-Headers': 'Content-Type, x-session-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Tarayıcıların CORS kontrolü için gönderdiği OPTIONS isteğini işle
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    }
  }

  // Sadece POST isteklerini kabul et
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    const validationErrors = validateCalculationParams(body)

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Validation failed', details: validationErrors })
      }
    }

    // Supabase'e veriyi ekle
    const { data, error } = await supabase
      .from('calculations')
      .insert({
        user_session: event.headers['x-session-id'] || 'anonymous',
        calculation_type: body.calculationType,
        financing_type: body.financingType,
        financing_amount: body.financingAmount,
        down_payment: body.downPayment || 0,
        organization_fee_rate: body.organizationFeeRate,
        monthly_payment: body.monthlyPayment,
        total_installments: Math.ceil(
          (body.financingAmount +
            (body.financingAmount * body.organizationFeeRate) / 100 -
            (body.downPayment || 0)) /
            body.monthlyPayment
        )
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save calculation to the database.' })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Calculation saved successfully', data })
    }
  } catch (error) {
    console.error('Internal function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'An internal error occurred.' })
    }
  }
} 