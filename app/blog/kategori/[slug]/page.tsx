import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  User,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Home,
  Car
} from 'lucide-react'
import { getBlogPosts, getCategoryBySlug, BlogPost, BlogCategory } from '@/lib/blog'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Metadata, ResolvingMetadata } from 'next'

// Re-using BlogPostCard from the main blog page, could be moved to a component
function BlogPostCard({ post }: { post: BlogPost }) {
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
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300" />
          <CardContent className="p-6 space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3" />
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: 'Kategori Bulunamadı | Evim Sistemleri Blog'
    }
  }

  return {
    title: `${category.name} | Evim Sistemleri Blog`,
    description: category.description || `Finansman, ev ve araba kredisi konularında ${category.name} kategorisindeki yazılar.`,
    keywords: [category.name, 'blog', 'finansman rehberi', 'faizsiz kredi'],
    openGraph: {
      title: `${category.name} | Evim Sistemleri Blog`,
      description: category.description || `Finansman, ev ve araba kredisi konularında ${category.name} kategorisindeki yazılar.`,
    },
  }
}

export default async function CategoryBlogPage({ params }: Props) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Veritabanı Yapılandırılmamış</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Blog kategorilerini görüntülemek için lütfen Supabase veritabanı bağlantınızı yapılandırın.
        </p>
      </div>
    )
  }

  const category = await getCategoryBySlug(params.slug)
  const { posts } = await getBlogPosts({ category: params.slug })

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/blog" className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20 hover:bg-white/20 transition-colors">
              <BookOpen className="h-4 w-4 mr-2" />
              Tüm Kategoriler
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 via-white/50 to-transparent"></div>
      </section>

      <section className="py-20 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bu Kategorideki Yazılar
              </h2>
            </div>
            
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Henüz bu kategoride yazı yok</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Bu kategoriye yeni yazılar eklendiğinde burada görünecek.
                </p>
                <Button asChild className="mt-8">
                    <Link href="/blog">Tüm Yazıları Gör</Link>
                </Button>
              </div>
            ) : (
              <Suspense fallback={<BlogSkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </Suspense>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 