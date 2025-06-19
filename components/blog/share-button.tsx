'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  text: string
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = async () => {
    // Bu fonksiyon sadece tarayıcıda çalışır
    if (typeof window === 'undefined') return

    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    }

    // Modern "Web Share API" desteği varsa onu kullan
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Kullanıcı paylaşımı iptal ederse hata vermemesi için boş bırakıldı.
      }
    } else {
      // Desteklenmiyorsa, panoya kopyalama yedeği
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Bağlantı panoya kopyalandı!')
      } catch (err) {
        toast.error('Bağlantı kopyalanamadı.')
        console.error('Kopyalama hatası: ', err)
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Paylaş
    </Button>
  )
} 