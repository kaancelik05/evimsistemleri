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

// Kullanıcının geçmiş hesaplamalarını getir (profil sayfası için)
export const getUserCalculationHistory = async (userId: string, userEmail?: string) => {
  try {
    console.log('🔍 Looking for calculations with user_id:', userId);
    
    // Supabase auth state'ini kontrol et
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 Current Supabase user:', user);
    console.log('❌ Auth error:', authError);
    console.log('🆔 Auth user ID:', user?.id);
    console.log('🔄 User ID match:', user?.id === userId);
    
    // Session bilgisini de kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔑 Current session:', session ? 'EXISTS' : 'NULL');
    console.log('❌ Session error:', sessionError);
    
    // İlk olarak user_id ile sorgula
    const { data, error } = await supabase
      .from('user_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('📊 Direct user_id query result:', data);
    console.log('❌ Direct user_id query error:', error);

    if (error) {
      throw error;
    }

         // Eğer veri bulunamadıysa, tablodaki tüm user_id'leri kontrol et
     if (!data || data.length === 0) {
       console.log('⚠️ No data found with user_id, checking all user_ids in table...');
       
       const { data: allData, error: allError } = await supabase
         .from('user_calculations')
         .select('user_id, id, calculation_type, created_at')
         .limit(20);
         
       console.log('📋 All user_ids in table:', allData?.map(row => row.user_id));
       console.log('🔍 Looking for user_id:', userId);
       console.log('🔄 User_id type:', typeof userId);
       
       // User_id'lerin tiplerini ve değerlerini karşılaştır
       if (allData) {
         const uniqueIds = Array.from(new Set(allData.map(row => row.user_id)));
         console.log('👥 Unique user_ids:', uniqueIds);
         console.log('🔍 Match check:', uniqueIds.map(id => ({
           id,
           type: typeof id,
           matches: id === userId,
           stringMatch: String(id) === String(userId)
         })));
       }
       
                // Eğer email verilmişse, email ile de arama yapmayı deneyelim
         if (userEmail) {
           console.log('🔍 Trying to find calculations by email:', userEmail);
           
                       // user_calculations tablosunda user_email field'i kontrol et
            const { data: emailData, error: emailError } = await supabase
              .from('user_calculations')
              .select('*')
              .eq('user_email', userEmail)
              .order('created_at', { ascending: false });
            
            console.log('📧 User email query result:', emailData);
           
           if (emailData && emailData.length > 0) {
             console.log('✅ Found calculations by email!');
             return { data: emailData, error: null };
           }
           
           // Eğer email field'i yoksa, user_session ile dene (belki eski hesaplamalar email ile kaydedilmiş)
           const { data: sessionData, error: sessionError } = await supabase
             .from('user_calculations')
             .select('*')
             .eq('user_session', userEmail)
             .order('created_at', { ascending: false });
           
           console.log('🔑 User session (email) query result:', sessionData);
           
                       if (sessionData && sessionData.length > 0) {
              console.log('✅ Found calculations by user_session (email)!');
              return { data: sessionData, error: null };
            }
            
            // Son olarak eski calculations tablosunda da kontrol et
            console.log('🔍 Checking old calculations table...');
            const { data: oldCalcData, error: oldCalcError } = await supabase
              .from('calculations')
              .select('*')
              .eq('user_session', userEmail)
              .order('created_at', { ascending: false });
            
            console.log('📊 Old calculations table result:', oldCalcData);
            
            if (oldCalcData && oldCalcData.length > 0) {
              console.log('✅ Found calculations in old calculations table!');
              return { data: oldCalcData, error: null };
            }
          }
       }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user calculation history:', error);
    return { data: null, error };
  }
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
      user_calculations: {
        Row: {
          id: string
          user_id: string
          user_email: string | null
          calculation_type: 'ev' | 'araba'
          financing_type: 'cekilisli' | 'cekilissiz'
          financing_amount: number
          down_payment: number
          organization_fee_rate: number
          monthly_payment: number
          annual_increase_rate: number | null
          total_payment: number
          installment_count: number
          organization_fee: number
          net_financing: number
          required_payment: number
          accessible_month: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_email?: string | null
          calculation_type: 'ev' | 'araba'
          financing_type: 'cekilisli' | 'cekilissiz'
          financing_amount: number
          down_payment?: number
          organization_fee_rate: number
          monthly_payment: number
          annual_increase_rate?: number | null
          total_payment: number
          installment_count: number
          organization_fee: number
          net_financing: number
          required_payment: number
          accessible_month?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string | null
          calculation_type?: 'ev' | 'araba'
          financing_type?: 'cekilisli' | 'cekilissiz'
          financing_amount?: number
          down_payment?: number
          organization_fee_rate?: number
          monthly_payment?: number
          annual_increase_rate?: number | null
          total_payment?: number
          installment_count?: number
          organization_fee?: number
          net_financing?: number
          required_payment?: number
          accessible_month?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_payment_schedules: {
        Row: {
          id: string
          user_calculation_id: string
          month_number: number
          payment_date: string
          payment_amount: number
          remaining_balance: number
          can_access_financing: boolean
          status: 'waiting' | 'lucky' | 'unlucky' | 'accessible' | 'financing_obtained'
          cumulative_payment: number
          created_at: string
        }
        Insert: {
          id?: string
          user_calculation_id: string
          month_number: number
          payment_date: string
          payment_amount: number
          remaining_balance: number
          can_access_financing?: boolean
          status: 'waiting' | 'lucky' | 'unlucky' | 'accessible' | 'financing_obtained'
          cumulative_payment: number
          created_at?: string
        }
        Update: {
          id?: string
          user_calculation_id?: string
          month_number?: number
          payment_date?: string
          payment_amount?: number
          remaining_balance?: number
          can_access_financing?: boolean
          status?: 'waiting' | 'lucky' | 'unlucky' | 'accessible' | 'financing_obtained'
          cumulative_payment?: number
          created_at?: string
        }
      }
    }
  }
}

// Auth utility functions
export const getCurrentUser = async () => {
  try {
    console.log('[AUTH] getCurrentUser başladı')
    
    // İlk olarak Supabase'in kendi session'ını kontrol et
    const { data: { user }, error } = await supabase.auth.getUser()
    console.log('[AUTH] Supabase session kontrolü:', { user: !!user, error: !!error })
    
    if (user && !error) {
      console.log('[AUTH] Supabase session\'dan kullanıcı bulundu:', user.email)
      return user
    }

    // Eğer Supabase session'ı yoksa, localStorage'daki token'ları kontrol et
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('supabase_access_token')
      const refreshToken = localStorage.getItem('supabase_refresh_token')
      const expiresAt = localStorage.getItem('token_expires_at')
      
      console.log('[AUTH] localStorage token kontrolü:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        expiresAt 
      })
      
      if (accessToken && refreshToken) {
        // Token'ın süresinin dolup dolmadığını kontrol et
        if (expiresAt) {
          const expirationTime = parseInt(expiresAt) * 1000 // Unix timestamp to milliseconds
          const isExpired = Date.now() > expirationTime
          console.log('[AUTH] Token süresi kontrolü:', { 
            expirationTime, 
            currentTime: Date.now(), 
            isExpired 
          })
          
          if (isExpired) {
            console.log('[AUTH] Token süresi dolmuş, localStorage temizleniyor')
            // Token süresi dolmuş, localStorage'ı temizle
            localStorage.removeItem('supabase_access_token')
            localStorage.removeItem('supabase_refresh_token')
            localStorage.removeItem('token_expires_at')
            localStorage.removeItem('user_logged_in')
            localStorage.removeItem('login_timestamp')
            return null
          }
        }

        console.log('[AUTH] localStorage token\'ları Supabase session\'ına yükleniyor')
        // Token'ları Supabase session'ına set et
        const sessionResult = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        console.log('[AUTH] Session set edildi:', { 
          success: !sessionResult.error, 
          error: sessionResult.error?.message 
        })

        // Yeniden kullanıcıyı getir
        const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()
        console.log('[AUTH] Session set sonrası kullanıcı kontrolü:', { 
          user: !!sessionUser, 
          error: sessionError?.message 
        })
        
        if (sessionUser && !sessionError) {
          console.log('[AUTH] localStorage token\'larından kullanıcı bulundu:', sessionUser.email)
          return sessionUser
        }
      }
    }

    console.log('[AUTH] Kullanıcı bulunamadı')
    return null
  } catch (error) {
    console.error('[AUTH] Error getting current user:', error)
    return null
  }
}

export const isUserLoggedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

// User calculation functions
export const saveUserCalculation = async (
  formData: import('./types').FormData,
  result: import('./types').CalculationResult,
  calculationType: 'ev' | 'araba'
) => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış')
    }

    // Insert calculation
    const { data: calculation, error: calcError } = await supabase
      .from('user_calculations')
      .insert({
        user_id: user.id,
        user_email: user.email,
        calculation_type: calculationType,
        financing_type: formData.financingType,
        financing_amount: formData.financingAmount,
        down_payment: formData.downPayment,
        organization_fee_rate: formData.organizationFeeRate,
        monthly_payment: formData.monthlyPayment,
        annual_increase_rate: formData.annualIncreaseRate,
        total_payment: result.totalPayment,
        installment_count: result.installmentCount,
        organization_fee: result.organizationFee,
        net_financing: result.netFinancing,
        required_payment: result.requiredPayment,
        accessible_month: result.accessibleMonth
      })
      .select()
      .single()

    if (calcError) throw calcError

    // Insert payment schedules
    const scheduleInserts = result.schedule.map(item => ({
      user_calculation_id: calculation.id,
      month_number: item.monthNumber,
      payment_date: item.paymentDate,
      payment_amount: item.paymentAmount,
      remaining_balance: item.remainingBalance,
      can_access_financing: item.canAccessFinancing,
      status: item.status,
      cumulative_payment: item.cumulativePayment
    }))

    const { error: scheduleError } = await supabase
      .from('user_payment_schedules')
      .insert(scheduleInserts)

    if (scheduleError) throw scheduleError

    return { success: true, calculationId: calculation.id }
  } catch (error) {
    console.error('Error saving user calculation:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
  }
}

export const getUserCalculations = async (calculationType?: 'ev' | 'araba') => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış')
    }

    let query = supabase
      .from('user_calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (calculationType) {
      query = query.eq('calculation_type', calculationType)
    }

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error getting user calculations:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
  }
}