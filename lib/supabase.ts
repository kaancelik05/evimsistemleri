import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw errors if we're not in build mode and values are clearly invalid
if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
  if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not properly configured. Some features may not work.')
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not properly configured. Some features may not work.')
  }
}

// Validate URL format only if URL is provided and not a placeholder
if (supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co') {
  try {
    new URL(supabaseUrl)
  } catch (error) {
    console.error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: ${supabaseUrl}. Expected format: https://your-project-id.supabase.co`)
  }
}

// Use fallback values for build if environment variables are not set
const finalSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co'
const finalSupabaseAnonKey = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey)

// Supabase'in doğru konfigüre edilip edilmediğini kontrol eden utility fonksiyon
export const isSupabaseConfigured = (): boolean => {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.endsWith('.supabase.co')
  )
}

export type Database = {
  public: {
    Tables: {
      calculations: {
        Row: {
          id: string
          user_session: string | null
          calculation_type: 'ev' | 'araba'
          financing_type: 'cekilisli' | 'cekilissiz'
          financing_amount: number
          down_payment: number
          organization_fee_rate: number
          monthly_payment: number
          total_installments: number
          created_at: string
        }
        Insert: {
          id?: string
          user_session?: string | null
          calculation_type: 'ev' | 'araba'
          financing_type: 'cekilisli' | 'cekilissiz'
          financing_amount: number
          down_payment?: number
          organization_fee_rate: number
          monthly_payment: number
          total_installments: number
          created_at?: string
        }
        Update: {
          id?: string
          user_session?: string | null
          calculation_type?: 'ev' | 'araba'
          financing_type?: 'cekilisli' | 'cekilissiz'
          financing_amount?: number
          down_payment?: number
          organization_fee_rate?: number
          monthly_payment?: number
          total_installments?: number
          created_at?: string
        }
      }
      payment_schedules: {
        Row: {
          id: string
          calculation_id: string
          month_number: number
          payment_date: string
          payment_amount: number
          remaining_balance: number
          can_access_financing: boolean
          status: 'waiting' | 'lucky' | 'unlucky' | 'accessible'
        }
        Insert: {
          id?: string
          calculation_id: string
          month_number: number
          payment_date: string
          payment_amount: number
          remaining_balance: number
          can_access_financing?: boolean
          status?: 'waiting' | 'lucky' | 'unlucky' | 'accessible'
        }
        Update: {
          id?: string
          calculation_id?: string
          month_number?: number
          payment_date?: string
          payment_amount?: number
          remaining_balance?: number
          can_access_financing?: boolean
          status?: 'waiting' | 'lucky' | 'unlucky' | 'accessible'
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          author: string
          category_id?: string | null
          tags?: string[]
          image_url?: string | null
          featured?: boolean
          published?: boolean
          read_time?: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          author?: string
          category_id?: string | null
          tags?: string[]
          image_url?: string | null
          featured?: boolean
          published?: boolean
          read_time?: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}