import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  User,
  BookOpen,
  TrendingUp,
  Home,
  Car,
  Shield,
  Calculator,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { getBlogPosts, getBlogCategories, BlogPost, BlogCategory } from '@/lib/blog'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Metadata } from 'next'

// Dummy data for when Supabase is not configured
const DUMMY_CATEGORIES: BlogCategory[] = [
  { id: 'cat-1', name: 'Ev Finansmanı', slug: 'ev-finansmani', description: 'Ev satın alma ve finansman rehberleri', icon: 'Home', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Araba Finansmanı', slug: 'araba-finansmani', description: 'Araba kredisi ve leasing rehberleri', icon: 'Car', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'İslami Finansman', slug: 'islami-finansman', description: 'Faizsiz finansman çözümleri', icon: 'Shield', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Finansal Planlama', slug: 'finansal-planlama', description: 'Yatırım ve tasarruf rehberleri', icon: 'Calculator', created_at: new Date().toISOString() },
]

const DUMMY_POSTS: BlogPost[] = [
  {
    id: 'dummy-1',
    slug: 'faizsiz-finansman-avantajlari',
    title: 'Faizsiz Finansmanın Avantajları (Örnek)',
    excerpt: 'Bu yazı, veritabanı bağlantısı olmadığında gösterilen bir yedek içeriktir. Lütfen Supabase yapılandırmanızı kontrol edin.',
    content: '',
    author: 'Sistem Yöneticisi',
    category: DUMMY_CATEGORIES[2],
    tags: ['örnek', 'yapılandırma'],
    image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
    published: true,
    read_time: '3 dk',
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dummy-2',
    slug: 'ev-satin-alirken-dikkat-edilmesi-gerekenler',
    title: 'Ev Satın Alırken Dikkat Edilmesi Gerekenler (Örnek)',
    excerpt: 'Bu yazı, veritabanı bağlantısı olmadığında gösterilen bir yedek içeriktir. Lütfen Supabase yapılandırmanızı kontrol edin.',
    content: '',
    author: 'Sistem Yöneticisi',
    category: DUMMY_CATEGORIES[0],
    tags: ['örnek', 'yapılandırma'],
    image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
    published: true,
    read_time: '5 dk',
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dummy-3',
    slug: 'araba-finansmaninda-dogru-secim',
    title: 'Araba Finansmanında Doğru Seçim (Örnek)',
    excerpt: 'Bu yazı, veritabanı bağlantısı olmadığında gösterilen bir yedek içeriktir. Lütfen Supabase yapılandırmanızı kontrol edin.',
    content: '',
    author: 'Sistem Yöneticisi',
    category: DUMMY_CATEGORIES[1],
    tags: ['örnek', 'yapılandırma'],
    image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
    published: true,
    read_time: '4 dk',
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const iconMap = {
  TrendingUp,
  Home,
  Car,
  Shield,
  Calculator,
  BarChart3,
  BookOpen
}

export const metadata: Metadata = {
  title: 'Blog | Evim Sistemleri - Faizsiz Finansman Rehberleri',
  description: 'Faizsiz finansman, ev ve araba kredisi konularında uzman rehberleri. İslami bankacılık, katılım bankacılığı ve finansal planlama ipuçları.',
  keywords: ['blog', 'finansman rehberi', 'faizsiz kredi', 'ev kredisi', 'araba kredisi', 'İslami finansman'],
  openGraph: {
    title: 'Blog | Evim Sistemleri',
    description: 'Faizsiz finansman konularında uzman rehberleri ve güncel bilgiler.',
    images: ['/og-blog.jpg'],
  },
}

async function getBlogData() {
  let posts: BlogPost[] = []
  let categories: BlogCategory[] = []

  if (isSupabaseConfigured()) {
    try {
      const [postsResult, categoriesResult] = await Promise.all([
        getBlogPosts({ limit: 12 }),
        getBlogCategories()
      ])
      posts = postsResult.posts
      categories = categoriesResult
    } catch (error) {
      console.error('Error fetching blog data:', error)
      posts = DUMMY_POSTS
      categories = DUMMY_CATEGORIES
    }
  } else {
    posts = DUMMY_POSTS
    categories = DUMMY_CATEGORIES
  }

  return { posts, categories }
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const getCategoryIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || BookOpen
    return <Icon className="h-4 w-4" />
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.image_url || 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
        {post.featured && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
            <TrendingUp className="h-3 w-3 mr-1" />
            Öne Çıkan
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          {post.category && (
            <Badge variant="secondary" className="flex items-center space-x-1 w-fit bg-blue-50 text-blue-700 border border-blue-200">
              {getCategoryIcon(post.category.icon)}
              <span>{post.category.name}</span>
            </Badge>
          )}
          
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
            <Link href={`/blog/${post.slug}`} className="line-clamp-2">
              {post.title}
            </Link>
          </h2>
          
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.read_time}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('tr-TR')}
              </time>
            </div>
          </div>
          
          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Link href={`/blog/${post.slug}`} className="flex items-center justify-center space-x-2">
              <span>Devamını Oku</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300" />
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3" />
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function BlogPage() {
  const { posts, categories } = await getBlogData()
  const featuredPosts = posts.filter(post => post.featured)
  const otherPosts = posts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20">
              <BookOpen className="h-4 w-4 mr-2" />
              Uzman Rehberler
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Finansman Rehberleri
            </h1>
            <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Faizsiz finansman, ev ve araba kredisi konularında uzman rehberleri. 
              Finansal hedeflerinize ulaşmanız için gerekli bilgileri edinin.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 via-white/50 to-transparent"></div>
      </section>

      {/* Main Content */}
      <section className="py-20 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kategoriler</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  İhtiyacınıza uygun kategoriyi seçerek ilgili rehberlere ulaşabilirsiniz
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((category) => {
                  const Icon = iconMap[category.icon as keyof typeof iconMap] || BookOpen;
                  return (
                    <Link key={category.id} href={`/blog/kategori/${category.slug}`} className="block group">
                      <Card className="text-center p-6 h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white group-hover:scale-105">
                        <div className="flex justify-center mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Yazılar</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  En popüler ve güncel finansman rehberlerimizi keşfedin
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {featuredPosts.length > 0 ? 'Diğer Yazılar' : 'Tüm Yazılar'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Finansman dünyasından en güncel bilgiler ve uzman tavsiyeleri
              </p>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Henüz blog yazısı yok</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {!isSupabaseConfigured() 
                    ? 'Veritabanı bağlantısı kurulamadı. Lütfen yapılandırmanızı kontrol edin.'
                    : 'Blog yazıları yayınlandığında burada görünecek.'
                  }
                </p>
              </div>
            ) : (
              <Suspense fallback={<BlogSkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(featuredPosts.length > 0 ? otherPosts : posts).map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </Suspense>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-20">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white border-0 shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
              <CardContent className="relative p-12 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20">
                  <Calculator className="h-4 w-4 mr-2" />
                  Hesaplayıcı Araçları
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Finansman Hesaplayıcı
                </h2>
                <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
                  Hayalinizdeki ev veya araba için ödeme planınızı hemen hesaplayın
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link href="/ev-finansmani">
                      <Home className="mr-2 h-5 w-5" />
                      Ev Finansmanı
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link href="/araba-finansmani">
                      <Car className="mr-2 h-5 w-5" />
                      Araba Finansmanı
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}