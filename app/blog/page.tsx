import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User,
  Share2,
  BookOpen,
  TrendingUp,
  Home,
  Car,
  Shield,
  Calculator,
  BarChart3
} from 'lucide-react'
import { getBlogPost, getRelatedPosts, getBlogPosts, BlogPost } from '@/lib/blog'
import type { Metadata } from 'next'

const iconMap = {
  TrendingUp,
  Home,
  Car,
  Shield,
  Calculator,
  BarChart3,
  BookOpen
}

// Statik sayfa oluşturma için gerekli
export async function generateStaticParams() {
  try {
    // Use the existing getBlogPosts utility which has proper error handling
    const result = await getBlogPosts()
    
    // If we have posts from database, use them
    if (result.posts && result.posts.length > 0) {
      return result.posts.map((post) => ({
        slug: post.slug,
      }))
    }
    
    // Fallback: Return predefined static paths for build when database is not available
    console.log('Using fallback static paths for blog posts')
    return [
      { slug: 'faizsiz-finansman-avantajlari' },
      { slug: 'ev-satin-alirken-dikkat-edilmesi-gerekenler' },
      { slug: 'araba-finansmaninda-dogru-secim' },
      { slug: 'islami-finansman-nedir' },
      { slug: 'katilim-bankaciligi-rehberi' },
      { slug: 'ev-finansmaninda-onemli-ipuclar' },
      { slug: 'araba-kredisi-vs-leasing' },
      { slug: 'finansal-planlama-rehberi' },
      { slug: 'yatirim-tavsiyeleri' },
      { slug: 'sigorta-secim-rehberi' }
    ]
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // Always return fallback static paths for successful builds
    console.log('Using fallback static paths due to error')
    return [
      { slug: 'faizsiz-finansman-avantajlari' },
      { slug: 'ev-satin-alirken-dikkat-edilmesi-gerekenler' },
      { slug: 'araba-finansmaninda-dogru-secim' },
      { slug: 'islami-finansman-nedir' },
      { slug: 'katilim-bankaciligi-rehberi' },
      { slug: 'ev-finansmaninda-onemli-ipuclar' },
      { slug: 'araba-kredisi-vs-leasing' },
      { slug: 'finansal-planlama-rehberi' },
      { slug: 'yatirim-tavsiyeleri' },
      { slug: 'sigorta-secim-rehberi' }
    ]
  }
}

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug)

    if (!post) {
      return {
        title: 'Blog Yazısı Bulunamadı | Evim Sistemleri',
        description: 'Aradığınız blog yazısı bulunamadı.',
      }
    }

    return {
      title: `${post.title} | Evim Sistemleri Blog`,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      keywords: post.tags || [],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: post.image_url ? [post.image_url] : ['/og-blog-default.jpg'],
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.author],
        section: post.category?.name,
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: post.image_url ? [post.image_url] : ['/twitter-blog-default.jpg'],
      },
      alternates: {
        canonical: `https://evimsistemler.com/blog/${post.slug}`,
      },
      other: {
        'article:author': post.author,
        'article:published_time': post.created_at,
        'article:modified_time': post.updated_at,
        'article:section': post.category?.name || 'Finansman',
        'article:tag': post.tags?.join(',') || '',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Yazısı | Evim Sistemleri',
      description: 'Evim Sistemleri blog yazısı.',
    }
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  let post: BlogPost | null = null
  
  try {
    post = await getBlogPost(params.slug)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    // If database is not available, show a fallback message
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Yazısı Yükleniyor</h1>
          <p className="text-gray-600 mb-4">
            Blog yazısı şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
          </p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700">
            Blog'a Dön
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  let relatedPosts: BlogPost[] = []
  try {
    relatedPosts = await getRelatedPosts(post.id, post.category?.id)
  } catch (error) {
    console.error('Error fetching related posts:', error)
    // Continue without related posts
  }

  const getCategoryIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || BookOpen
    return <Icon className="h-4 w-4" />
  }

  // Structured data for article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
    "image": post.image_url || "https://evimsistemler.com/og-blog-default.jpg",
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://evimsistemler.com/hakkimizda"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Evim Sistemleri",
      "logo": {
        "@type": "ImageObject",
        "url": "https://evimsistemler.com/logo.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://evimsistemler.com/blog/${post.slug}`
    },
    "articleSection": post.category?.name || "Finansman",
    "keywords": post.tags?.join(', ') || '',
    "wordCount": post.content.replace(/<[^>]*>/g, '').split(' ').length,
    "timeRequired": post.read_time,
    "inLanguage": "tr-TR"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center space-x-2 text-blue-200 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Blog'a Dön</span>
            </Link>
            
            <div className="space-y-4">
              {post.category && (
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 flex items-center space-x-1 w-fit">
                  {getCategoryIcon(post.category.icon)}
                  <span>{post.category.name}</span>
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-blue-100">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-blue-200">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.read_time} okuma</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <article className="lg:col-span-3">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    {/* Featured Image */}
                    {post.image_url && (
                      <div className="mb-8">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-64 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Article Content */}
                    <div 
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-8 pt-8 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Etiketler:</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Share */}
                    <div className="mt-8 pt-8 border-t">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Bu yazıyı paylaş:</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              if (navigator.share) {
                                navigator.share({
                                  title: post.title,
                                  text: post.excerpt || '',
                                  url: window.location.href
                                })
                              } else {
                                navigator.clipboard.writeText(window.location.href)
                              }
                            }
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Paylaş
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Author Info */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Yazar Hakkında</h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <p className="text-sm text-gray-600">Finansman Uzmanı</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Faizsiz finansman alanında uzman. 
                        İslami finansman sistemleri konusunda danışmanlık vermektedir.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  {relatedPosts.length > 0 && (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">İlgili Yazılar</h3>
                        <div className="space-y-4">
                          {relatedPosts.map((relatedPost) => (
                            <Link 
                              key={relatedPost.id} 
                              href={`/blog/${relatedPost.slug}`}
                              className="block group"
                            >
                              <article className="flex space-x-3">
                                <img
                                  src={relatedPost.image_url || 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=200'}
                                  alt={relatedPost.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  loading="lazy"
                                />
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {relatedPost.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {relatedPost.read_time} okuma
                                  </p>
                                </div>
                              </article>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* CTA */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                        <h3 className="font-semibold mb-2">Finansman Hesaplayıcı</h3>
                        <p className="text-sm text-blue-100 mb-4">
                          Hayalinizdeki ev veya araba için ödeme planınızı hemen hesaplayın.
                        </p>
                        <Button asChild variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                          <Link href="/ev-finansmani">
                            Hesapla
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}