'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  HeadphonesIcon
} from 'lucide-react'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'
import { useEffect } from 'react'

export default function IletisimPage() {
  // EmailJS'i initialize et
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY')
  }, [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // EmailJS ile e-posta gönderimi
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_evimsistemleri',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_contact',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          to_email: 'contact@evimsistemleri.com'
        }
      )

      console.log('EmailJS result:', result)
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('EmailJS error:', error)
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    }
    
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              İletişim
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Faizsiz finansman konularında sorularınız için bize ulaşın. Uzman ekibimiz size yardımcı olmaktan mutluluk duyar. 
              Müşteri hizmetleri ile yanınızdayız.
            </p>
          </div>
        </div>
      </section>

      {/* İletişim Bilgileri */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
            <p className="text-xl text-gray-600">Size en uygun iletişim kanalını seçin</p>
          </div>
          
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* İletişim Formu */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Bize Mesaj Gönderin</span>
                </CardTitle>
                <p className="text-gray-600">Finansman konularında uzman ekibimizden destek alın</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0555 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Konu *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Ev finansmanı, araba finansmanı vb."
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mesaj *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Finansman ihtiyacınız ve sorularınızı detaylı olarak yazın..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Gönderiliyor...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Mesaj Gönder</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Çalışma Saatleri ve Ek Bilgiler */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Çalışma Saatleri</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pazartesi - Cuma</span>
                      <span className="font-medium">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cumartesi</span>
                      <span className="font-medium">09:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pazar</span>
                      <span className="font-medium text-red-600">Kapalı</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HeadphonesIcon className="h-5 w-5" />
                    <span>Uzman Destek Alanları</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Ev Finansmanı Danışmanlığı</h4>
                      <p className="text-gray-600 text-sm">
                        Faizsiz ev finansmanı, peşinat hesaplama, ödeme planları ve başvuru süreçleri
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Araba Finansmanı Danışmanlığı</h4>
                      <p className="text-gray-600 text-sm">
                        Faizsiz araba finansmanı, organizasyon ücreti hesaplama ve ödeme seçenekleri
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Teknik Destek</h4>
                      <p className="text-gray-600 text-sm">
                        Web sitesi kullanımı, hesaplama araçları ve başvuru takibi
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Genel Bilgilendirme</h4>
                      <p className="text-gray-600 text-sm">
                        İslami finansman, katılım bankacılığı ve faizsiz sistem hakkında bilgi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SSS Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-xl text-gray-600">En çok merak edilen konular</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Faizsiz finansman nasıl çalışır?</h3>
              <p className="text-gray-600 mb-4">
                Faizsiz finansman sisteminde faiz yerine organizasyon ücreti alınır. 
                Bu ücret şeffaf şekilde hesaplanır ve sabit kalır.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Başvuru süreci ne kadar sürer?</h3>
              <p className="text-gray-600 mb-4">
                Online hesaplama anında yapılır. Başvuru değerlendirme süreci 
                genellikle 2-3 iş günü içinde tamamlanır.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Peşinat zorunlu mu?</h3>
              <p className="text-gray-600 mb-4">
                Peşinat zorunlu değildir. Hem peşinatlı hem de peşinatsız 
                finansman seçenekleri mevcuttur.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hangi şehirlerde hizmet veriyorsunuz?</h3>
              <p className="text-gray-600 mb-4">
                Türkiye genelinde hizmet vermekteyiz. Online başvuru ve 
                değerlendirme sistemi ile tüm illere ulaşıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}