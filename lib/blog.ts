import { supabase } from './supabase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  category: {
    id: string
    name: string
    slug: string
    icon: string
  } | null
  tags: string[]
  image_url: string | null
  featured: boolean
  published: boolean
  read_time: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface BlogPostInsert {
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  category_id: string | null
  tags: string[]
  image_url: string | null
  featured: boolean
  published: boolean
  read_time: string
  meta_title: string | null
  meta_description: string | null
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string
  created_at: string
}

export interface BlogFilters {
  category?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

// Blog yazılarını getir
export async function getBlogPosts(filters: BlogFilters = {}): Promise<{
  posts: BlogPost[]
  total: number
}> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-id.supabase.co' ||
        supabaseAnonKey === 'your-anon-key-here') {
      console.warn('Supabase not configured, returning empty blog posts')
      return { posts: [], total: 0 }
    }

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })

    // Filtreler uygula
    if (filters.category && filters.category !== 'Tümü') {
      query = query.eq('category.slug', filters.category)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,tags.cs.{${filters.search}}`)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    // Sayfalama
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Blog posts fetch error:', error)
      return { posts: [], total: 0 }
    }

    return {
      posts: data || [],
      total: count || 0
    }
  } catch (error) {
    console.error('Blog posts fetch error:', error)
    return { posts: [], total: 0 }
  }
}

// Tek blog yazısı getir
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-id.supabase.co' ||
        supabaseAnonKey === 'your-anon-key-here') {
      console.warn('Supabase not configured, returning null for blog post')
      return null
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      console.error('Blog post fetch error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Blog post fetch error:', error)
    return null
  }
}

// Blog kategorilerini getir
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-id.supabase.co' ||
        supabaseAnonKey === 'your-anon-key-here') {
      console.warn('Supabase not configured, returning empty categories')
      return []
    }

    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Blog categories fetch error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Blog categories fetch error:', error)
    return []
  }
}

// İlgili yazıları getir
export async function getRelatedPosts(currentPostId: string, categoryId?: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-id.supabase.co' ||
        supabaseAnonKey === 'your-anon-key-here') {
      console.warn('Supabase not configured, returning empty related posts')
      return []
    }

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .eq('published', true)
      .neq('id', currentPostId)
      .limit(limit)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Related posts fetch error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Related posts fetch error:', error)
    return []
  }
}

// Öne çıkan yazıları getir
export async function getFeaturedPosts(limit: number = 2): Promise<BlogPost[]> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-id.supabase.co' ||
        supabaseAnonKey === 'your-anon-key-here') {
      console.warn('Supabase not configured, returning empty featured posts')
      return []
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Featured posts fetch error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Featured posts fetch error:', error)
    return []
  }
}

// Blog yazısı oluştur (admin için)
export async function createBlogPost(post: BlogPostInsert): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .single()

    if (error) {
      console.error('Blog post create error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Blog post create error:', error)
    return null
  }
}

// Blog yazısı güncelle (admin için)
export async function updateBlogPost(id: string, updates: Partial<BlogPostInsert>): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:blog_categories(id, name, slug, icon)
      `)
      .single()

    if (error) {
      console.error('Blog post update error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Blog post update error:', error)
    return null
  }
}

// Blog yazısı sil (admin için)
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Blog post delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Blog post delete error:', error)
    return false
  }
}

// Slug oluştur
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
    .trim()
}

// Okuma süresi hesapla
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} dk`
}