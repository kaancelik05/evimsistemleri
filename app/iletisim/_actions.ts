'use server'

import { z } from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(1, 'Ad soyad gereklidir.'),
  email: z.string().email('Geçersiz e-posta adresi.'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Konu gereklidir.'),
  message: z.string().min(1, 'Mesaj gereklidir.'),
})

export async function sendContactEmail(formData: unknown) {
  console.log('sendContactEmail called with:', formData)
  
  const parsed = contactFormSchema.safeParse(formData)

  if (!parsed.success) {
    console.log('Validation errors:', parsed.error.format())
    return { success: false, error: parsed.error.format() }
  }

  // Form validation başarılı, client-side EmailJS ile gönderim yapılacak
  return { success: true, data: parsed.data }
} 