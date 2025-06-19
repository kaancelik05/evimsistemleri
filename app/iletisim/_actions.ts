'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const contactFormSchema = z.object({
  name: z.string().min(1, 'Ad soyad gereklidir.'),
  email: z.string().email('Geçersiz e-posta adresi.'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Konu gereklidir.'),
  message: z.string().min(1, 'Mesaj gereklidir.'),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: unknown) {
  const parsed = contactFormSchema.safeParse(formData)

  if (!parsed.success) {
    return { success: false, error: parsed.error.format() }
  }

  const { name, email, phone, subject, message } = parsed.data

  try {
    const { data, error } = await resend.emails.send({
      from: 'EvimSistemleri <contact@evimsistemleri.com>', // Bu alanın Resend'de doğruladığınız bir domain olması gerekiyor.
      to: ['contact@evimsistemleri.com'],
      subject: `Yeni İletişim Formu Mesajı: ${subject}`,
      html: `
        <h1>Yeni İletişim Formu Mesajı</h1>
        <p><strong>Gönderen:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        <hr>
        <h2>Konu: ${subject}</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: 'E-posta gönderilemedi.' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'E-posta gönderilirken bir hata oluştu.' }
  }
} 