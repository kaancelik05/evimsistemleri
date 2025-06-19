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
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={post.image_url || 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {post.featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
            Öne Çıkan
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          {post.category && (
            <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
              {getCategoryIcon(post.category.icon)}
              <span>{post.category.name}</span>
            </Badge>
          )}
          
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            <Link href={`/blog/${post.slug}`} className="line-clamp-2">
              {post.title}
            </Link>
          </h2>
          
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
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
          
          <Button asChild variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
            <Link href={`/blog/${post.slug}`} className="flex items-center space-x-2">
              <span>Devamını Oku</span>
              <ArrowRight className="h-4 w-4" />
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
        <Card key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <CardContent className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded w-full" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Finansman Rehberleri
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Faizsiz finansman, ev ve araba kredisi konularında uzman rehberleri. 
              Finansal hedeflerinize ulaşmanız için gerekli bilgileri edinin.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Kategoriler</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categories.map((category) => {
                  const Icon = iconMap[category.icon as keyof typeof iconMap] || BookOpen;
                  return (
                    <Link key={category.id} href={`/blog/kategori/${category.slug}`} className="block">
                      <Card className="text-center p-4 h-full hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-center mb-2">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Öne Çıkan Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {featuredPosts.length > 0 ? 'Diğer Yazılar' : 'Tüm Yazılar'}
            </h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz blog yazısı yok</h3>
                <p className="text-gray-600">
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
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Finansman Hesaplayıcı</h2>
                <p className="text-blue-100 mb-6">
                  Hayalinizdeki ev veya araba için ödeme planınızı hemen hesaplayın
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/ev-finansmani">Ev Finansmanı</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/araba-finansmani">Araba Finansmanı</Link>
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