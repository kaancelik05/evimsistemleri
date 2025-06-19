'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getBlogCategories, BlogCategory, generateSlug } from '@/lib/blog'
import { toast } from 'sonner'
import { createPostAction } from '../_actions'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category_id: '',
    tags: '',
    image_url: '',
    featured: false,
    meta_title: '',
    meta_description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Başlık değiştiğinde ve slug manuel olarak doldurulmadığında otomatik oluştur
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }))
    }
  }, [formData.title])

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories()
      setCategories(result)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Kategoriler yüklenirken bir hata oluştu.')
    }
  }

  const handleSubmit = (isPublish: boolean) => {
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Başlık, İçerik ve Yazar alanları zorunludur.')
      return
    }

    startTransition(async () => {
      const result = await createPostAction(formData, isPublish)
      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        toast.success(isPublish ? 'Blog yazısı başarıyla yayınlandı!' : 'Blog yazısı taslak olarak kaydedildi.')
        router.push('/admin/blog')
      }
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/admin/blog" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Blog Yönetimine Dön</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
          <p className="text-gray-600">Yeni bir blog yazısı oluşturun</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İçerik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Başlık *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Blog yazısının başlığı"
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="url-dostu-baslik"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Özet</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Blog yazısının kısa özeti"
                    rows={3}
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="content">İçerik *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Blog yazısının tam içeriği (HTML kullanabilirsiniz)"
                    rows={15}
                    required
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Başlık</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder="SEO için özel başlık"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Açıklama</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    placeholder="SEO için açıklama"
                    rows={3}
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yayınlama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="flex flex-col space-y-1">
                      <span>Öne Çıkar</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        Yazıyı ana sayfada öne çıkarır.
                      </span>
                    </Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
                      disabled={isPending}
                    />
                  </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detaylar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">Yazar *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                    placeholder="Yazar adı"
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => handleChange('category_id', value)}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Etiketler</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="etiket1, etiket2, etiket3"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Görsel URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://ornek.com/gorsel.jpg"
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Yayınla
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isPending}
                variant="outline"
                className="w-full"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Taslak Olarak Kaydet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}