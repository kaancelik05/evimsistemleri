'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createBlogPost, getBlogCategories, generateSlug, calculateReadTime, BlogCategory } from '@/lib/blog'
import { toast } from 'sonner'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
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
    published: false,
    meta_title: '',
    meta_description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Başlık değiştiğinde slug'ı otomatik oluştur
    if (formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }))
    }
  }, [formData.title])

  const loadCategories = async () => {
    try {
      const result = await getBlogCategories()
      setCategories(result)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Kategoriler yüklenirken hata oluştu')
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Başlık, içerik ve yazar alanları zorunludur')
      return
    }

    try {
      setLoading(true)
      
      const postData = {
        ...formData,
        published: publish,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        read_time: calculateReadTime(formData.content),
        slug: formData.slug || generateSlug(formData.title)
      }

      const result = await createBlogPost(postData)
      
      if (result) {
        toast.success(publish ? 'Blog yazısı yayınlandı!' : 'Blog yazısı taslak olarak kaydedildi!')
        router.push('/admin/blog')
      } else {
        toast.error('Blog yazısı kaydedilirken hata oluştu')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Blog yazısı kaydedilirken hata oluştu')
    } finally {
      setLoading(false)
    }
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
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/blog" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Blog Yönetimine Dön</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
          <p className="text-gray-600">Yeni bir blog yazısı oluşturun</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      placeholder="url-dostu-baslik"
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
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yayın Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Yayınla</Label>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleChange('published', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Öne Çıkar</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleChange('featured', checked)}
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category_id} onValueChange={(value) => handleChange('category_id', value)}>
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
                    />
                    <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Görsel URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Taslak Kaydet
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="w-full"
                    variant="default"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Yayınla
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}