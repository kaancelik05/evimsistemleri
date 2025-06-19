'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { BlogPostInsert, calculateReadTime, generateSlug } from '@/lib/blog'

// Bu arayüz, form verilerinin tip güvenliğini sağlar
interface FormState {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category_id: string
  tags: string
  image_url: string
  featured: boolean
  meta_title: string
  meta_description: string
}

// Bu Server Action, formdan gelen veriyi alıp güvenli bir şekilde Supabase'e ekleyecek
export async function createPostAction(
  formData: FormState,
  isPublish: boolean
): Promise<{ error?: string; success?: boolean }> {
  
  // Ortam değişkenlerini sunucu tarafında kontrol et
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: 'Sunucu tarafında Supabase ortam değişkenleri ayarlanmamış.' }
  }

  // Form verilerini doğrula
  if (!formData.title || !formData.content || !formData.author) {
    return { error: 'Başlık, içerik ve yazar alanları zorunludur.' }
  }

  // Güçlü `service_key` ile sunucuya özel bir Supabase client oluştur
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const postToInsert: BlogPostInsert = {
    ...formData,
    published: isPublish,
    tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
    read_time: calculateReadTime(formData.content),
    slug: formData.slug || generateSlug(formData.title),
  }

  // Veritabanına ekleme işlemi
  const { error } = await supabaseAdmin.from('blog_posts').insert(postToInsert)

  if (error) {
    console.error('Supabase insert error:', error)
    return { error: `Veritabanı hatası: ${error.message}` }
  }

  // İlgili sayfaların önbelleğini temizleyerek anında güncellenmesini sağla
  revalidatePath('/blog')
  revalidatePath(`/blog/${postToInsert.slug}`)
  revalidatePath('/admin/blog')

  return { success: true }
} 