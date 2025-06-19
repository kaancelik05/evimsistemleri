'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Key, 
  Globe,
  Table,
  Shield,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'loading' | 'success' | 'error'
  message: string
  details?: any
}

export default function TestSupabasePage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Environment Variables', status: 'loading', message: 'Kontrol ediliyor...' },
    { name: 'URL Format Kontrolü', status: 'loading', message: 'URL formatı kontrol ediliyor...' },
    { name: 'Supabase Bağlantısı', status: 'loading', message: 'Bağlantı test ediliyor...' },
    { name: 'Calculations Tablosu', status: 'loading', message: 'Tablo varlığı kontrol ediliyor...' },
    { name: 'Payment Schedules Tablosu', status: 'loading', message: 'Tablo varlığı kontrol ediliyor...' },
    { name: 'RLS Politikaları', status: 'loading', message: 'Güvenlik politikaları kontrol ediliyor...' }
  ])

  const [showEnvVars, setShowEnvVars] = useState(false)
  const [envVars, setEnvVars] = useState({
    url: '',
    key: ''
  })

  const updateTest = (index: number, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, details } : test
    ))
  }

  const checkEnvironmentVariables = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvVars({
      url: supabaseUrl || 'BULUNAMADI',
      key: supabaseKey || 'BULUNAMADI'
    })

    if (!supabaseUrl || supabaseUrl === 'your-project-url' || supabaseUrl === '') {
      updateTest(0, 'error', 'NEXT_PUBLIC_SUPABASE_URL bulunamadı veya varsayılan değerde')
      return false
    }

    if (!supabaseKey || supabaseKey === 'your-anon-key' || supabaseKey === '') {
      updateTest(0, 'error', 'NEXT_PUBLIC_SUPABASE_ANON_KEY bulunamadı veya varsayılan değerde')
      return false
    }

    updateTest(0, 'success', 'Environment variables bulundu')
    return true
  }

  const checkUrlFormat = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl) {
      updateTest(1, 'error', 'URL bulunamadı')
      return false
    }

    // Supabase URL formatını kontrol et
    const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
    
    if (!urlPattern.test(supabaseUrl)) {
      updateTest(1, 'error', `URL formatı yanlış. Beklenen format: https://your-project.supabase.co\nMevcut: ${supabaseUrl}`)
      return false
    }

    updateTest(1, 'success', `URL formatı doğru: ${supabaseUrl}`)
    return true
  }

  const testSupabaseConnection = async () => {
    try {
      // Basit bir health check
      const { data, error } = await supabase
        .from('calculations')
        .select('count', { count: 'exact', head: true })

      if (error) {
        // Hata türüne göre daha detaylı mesaj
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          updateTest(2, 'error', 'Bağlantı başarılı ama tablolar bulunamadı. Migration\'ları çalıştırın.')
        } else if (error.message.includes('JWT')) {
          updateTest(2, 'error', 'API Key hatası. Anon key\'i kontrol edin.')
        } else {
          updateTest(2, 'error', `Supabase hatası: ${error.message}`)
        }
        return false
      }

      updateTest(2, 'success', 'Supabase bağlantısı başarılı!')
      return true
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        updateTest(2, 'error', 'CORS hatası veya URL erişilemez. URL\'yi kontrol edin.')
      } else {
        updateTest(2, 'error', `Bağlantı hatası: ${error.message}`)
      }
      return false
    }
  }

  const testTable = async (tableName: string, testIndex: number) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          updateTest(testIndex, 'error', `${tableName} tablosu bulunamadı. Migration çalıştırın.`)
        } else {
          updateTest(testIndex, 'error', `${tableName} hatası: ${error.message}`)
        }
        return false
      } else {
        updateTest(testIndex, 'success', `${tableName} tablosu erişilebilir`)
        return true
      }
    } catch (error: any) {
      updateTest(testIndex, 'error', `${tableName} test hatası: ${error.message}`)
      return false
    }
  }

  const testRLS = async () => {
    try {
      const testData = {
        user_session: 'test-session-' + Date.now(),
        calculation_type: 'ev' as const,
        financing_type: 'cekilissiz' as const,
        financing_amount: 500000,
        down_payment: 100000,
        organization_fee_rate: 7,
        monthly_payment: 5000,
        total_installments: 12
      }

      const { data, error } = await supabase
        .from('calculations')
        .insert(testData)
        .select()

      if (error) {
        updateTest(5, 'error', `RLS hatası: ${error.message}`)
        return false
      } else {
        updateTest(5, 'success', 'RLS çalışıyor, test verisi eklendi!')
        
        // Test verisini temizle
        if (data && data[0]) {
          await supabase
            .from('calculations')
            .delete()
            .eq('id', data[0].id)
        }
        return true
      }
    } catch (error: any) {
      updateTest(5, 'error', `RLS test hatası: ${error.message}`)
      return false
    }
  }

  const runAllTests = async () => {
    // Test 1: Environment Variables
    const envOk = checkEnvironmentVariables()
    if (!envOk) return

    // Test 2: URL Format
    const urlOk = checkUrlFormat()
    if (!urlOk) return

    // Test 3: Supabase Connection
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) return

    // Test 4: Calculations Table
    await testTable('calculations', 3)

    // Test 5: Payment Schedules Table
    await testTable('payment_schedules', 4)

    // Test 6: RLS Test
    await testRLS()
  }

  const resetAndRunTests = async () => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'loading' as const, 
      message: 'Kontrol ediliyor...' 
    })))
    
    await new Promise(resolve => setTimeout(resolve, 500)) // UI için kısa gecikme
    await runAllTests()
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Test Ediliyor</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">✓ Başarılı</Badge>
      case 'error':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">✗ Hata</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const allTestsPassed = tests.every(test => test.status === 'success')
  const hasErrors = tests.some(test => test.status === 'error')
  const isLoading = tests.some(test => test.status === 'loading')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Database className="h-16 w-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Evim Sistemleri - Supabase Bağlantı Testi
          </h1>
          <p className="text-gray-600">
            Supabase bağlantınızı ve veritabanı yapılandırmanızı test edin
          </p>
        </div>

        {/* Environment Variables Debug */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Environment Variables Debug</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEnvVars(!showEnvVars)}
              >
                {showEnvVars ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showEnvVars ? 'Gizle' : 'Göster'}
              </Button>
            </div>
          </CardHeader>
          {showEnvVars && (
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_URL:</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(envVars.url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="block text-xs bg-gray-100 p-2 rounded break-all">
                    {envVars.url}
                  </code>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(envVars.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="block text-xs bg-gray-100 p-2 rounded break-all">
                    {envVars.key.length > 50 ? `${envVars.key.substring(0, 50)}...` : envVars.key}
                  </code>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Genel Durum */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {allTestsPassed ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : hasErrors ? (
                  <XCircle className="h-8 w-8 text-red-500" />
                ) : (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {allTestsPassed ? '🎉 Tüm Testler Başarılı!' : hasErrors ? '⚠️ Bazı Testler Başarısız' : '🔄 Testler Çalışıyor...'}
                  </h3>
                  <p className="text-gray-600">
                    {allTestsPassed 
                      ? 'Supabase bağlantınız ve veritabanınız hazır!'
                      : hasErrors 
                      ? 'Lütfen hataları kontrol edin ve düzeltin'
                      : 'Testler devam ediyor, lütfen bekleyin'
                    }
                  </p>
                </div>
              </div>
              <Button 
                onClick={resetAndRunTests} 
                variant="outline"
                disabled={isLoading}
              >
                <Database className="h-4 w-4 mr-2" />
                {isLoading ? 'Test Ediliyor...' : 'Tekrar Test Et'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Hızlı Çözüm Önerileri */}
        {hasErrors && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Hızlı Çözüm:</strong> En yaygın sorun .env.local dosyasının eksik olması veya yanlış değerler içermesidir. 
              Supabase Dashboard'dan doğru URL ve Key\'i kopyalayıp .env.local dosyasına yapıştırın.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Sonuçları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center space-x-2">
                    {index === 0 && <Key className="h-4 w-4" />}
                    {index === 1 && <Globe className="h-4 w-4" />}
                    {index === 2 && <Database className="h-4 w-4" />}
                    {index === 3 && <Table className="h-4 w-4" />}
                    {index === 4 && <Table className="h-4 w-4" />}
                    {index === 5 && <Shield className="h-4 w-4" />}
                    <span>{test.name}</span>
                  </CardTitle>
                  {getStatusBadge(test.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{test.message}</p>
                    {test.details && (
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detaylı Sorun Giderme */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔧 Detaylı Sorun Giderme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                "Failed to fetch" Hatası
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Sebep 1:</strong> Yanlış Supabase URL</p>
                <p><strong>Çözüm:</strong> URL'nin https://your-project.supabase.co formatında olduğundan emin olun</p>
                
                <p><strong>Sebep 2:</strong> .env.local dosyası yok veya yanlış konumda</p>
                <p><strong>Çözüm:</strong> Dosyanın proje kök dizininde olduğundan emin olun</p>
                
                <p><strong>Sebep 3:</strong> Supabase projesi duraklatılmış</p>
                <p><strong>Çözüm:</strong> Supabase Dashboard'da projenizin aktif olduğunu kontrol edin</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📝 .env.local Dosyası Örneği</h4>
              <pre className="text-xs bg-gray-100 p-3 rounded">
{`# .env.local dosyası (proje kök dizininde)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">🗄️ Migration Çalıştırma</h4>
              <p className="text-sm text-gray-600 mb-2">
                Eğer tablolar bulunamıyor ise, Supabase Dashboard &gt; SQL Editor'da şu migration'ları çalıştırın:
              </p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>supabase/migrations/20250618131555_fierce_meadow.sql</li>
                <li>supabase/migrations/20250618131605_maroon_term.sql</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔄 Geliştirme Sunucusunu Yeniden Başlatın</h4>
              <p className="text-sm text-gray-600">
                .env.local dosyasını değiştirdikten sonra mutlaka geliştirme sunucusunu yeniden başlatın:
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                npm run dev
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}