"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Home, 
  Car, 
  ArrowLeft,
  Calculator,
  TrendingUp,
  Clock,
  RotateCcw,
  Table,
  Eye
} from "lucide-react";
import { getUserCalculationHistory, supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { decodeJWT } from "@/lib/utils";
import { PaymentScheduleTable } from "@/components/calculation/payment-schedule-table";
import { CalculationResult, FormData } from "@/lib/types";

interface Calculation {
  id: string;
  calculation_type: 'ev' | 'araba';
  financing_type: 'cekilisli' | 'cekilissiz';
  financing_amount: number;
  down_payment: number;
  organization_fee_rate: number;
  monthly_payment: number;
  annual_increase_rate?: number;
  installment_count: number;
  accessible_month?: number;
  total_payment?: number;
  organization_fee?: number;
  net_financing?: number;
  required_payment?: number;
  created_at: string;
}

export default function ProfilPage() {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name: string;
    loginTimestamp: string;
  } | null>(null);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentTable, setShowPaymentTable] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState<Calculation | null>(null);
  const [paymentScheduleData, setPaymentScheduleData] = useState<{
    result: CalculationResult;
    formData: FormData;
  } | null>(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Kullanıcı giriş yapmış mı kontrol et
    const checkAuth = () => {
      const accessToken = localStorage.getItem('supabase_access_token');
      const isLoggedIn = localStorage.getItem('user_logged_in');
      
      if (!accessToken || isLoggedIn !== 'true') {
        toast({
          title: "Erişim Hatası",
          description: "Bu sayfaya erişmek için giriş yapmanız gerekiyor.",
          variant: "destructive",
        });
        router.push('/login');
        return false;
      }
      return true;
    };

    const loadUserData = async () => {
      if (!checkAuth()) return;

            try {
        // localStorage'dan kullanıcı bilgilerini al
        let email = localStorage.getItem('user_email') || '';
        let name = localStorage.getItem('user_name') || '';
        const loginTimestamp = localStorage.getItem('login_timestamp') || '';

        // Eğer kullanıcı bilgileri yoksa JWT token'dan çıkar
        const accessToken = localStorage.getItem('supabase_access_token');
        if (accessToken && (!email || !name)) {
          try {
            const payload = decodeJWT(accessToken);
            
            if (!email && payload.email) {
              email = payload.email;
              localStorage.setItem('user_email', email);
            }
            
            if (!name && payload.user_metadata) {
              const fullName = payload.user_metadata.full_name || payload.user_metadata.name || '';
              if (fullName) {
                name = fullName;
                localStorage.setItem('user_name', name);
              }
            }
          } catch (tokenError) {
            console.error('JWT token decode hatası:', tokenError);
          }
        }

        setUserInfo({ email, name, loginTimestamp });

                 // Kullanıcının hesaplamalarını getir
         // user_session için decoded JWT token'dan user ID'yi alacağız
           if (accessToken) {
             try {
               // JWT token'ı decode et (UTF-8 uyumlu)
               const payload = decodeJWT(accessToken);
               const userId = payload.sub;
               const userEmail = payload.email;

               console.log('🆔 User ID from JWT:', userId);
               console.log('📧 User Email from JWT:', userEmail);

               // Supabase auth state'ini manuel olarak set et
               const refreshToken = localStorage.getItem('supabase_refresh_token');
               if (refreshToken) {
                 console.log('🔄 Setting Supabase auth session...');
                 const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                   access_token: accessToken,
                   refresh_token: refreshToken
                 });
                 console.log('✅ Session set result:', sessionData ? 'SUCCESS' : 'FAILED');
                 console.log('❌ Session set error:', sessionError);
               }

               const { data, error } = await getUserCalculationHistory(userId, userEmail);
               
               if (error) {
                 console.error('Hesaplamalar yüklenirken hata:', error);
                 toast({
                   title: "Veri Yükleme Hatası",
                   description: `Hesaplamalar yüklenirken hata: ${(error as any)?.message || String(error)}`,
                   variant: "destructive",
                 });
                                } else {
                   setCalculations(data || []);
                 }
             } catch (tokenError) {
               console.error('JWT token decode hatası:', tokenError);
               toast({
                 title: "Token Hatası",
                 description: "Kullanıcı bilgileri okunamadı.",
                 variant: "destructive",
               });
             }
           }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
        toast({
          title: "Veri Yükleme Hatası",
          description: "Kullanıcı bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getCalculationTypeLabel = (type: 'ev' | 'araba') => {
    return type === 'ev' ? 'Ev Finansmanı' : 'Araba Finansmanı';
  };

  const getFinancingTypeLabel = (type: 'cekilisli' | 'cekilissiz') => {
    return type === 'cekilisli' ? 'Çekilişli' : 'Çekilişsiz';
  };

  const getAccessibilityInfo = (calculation: Calculation) => {
    // Önce accessible_month varsa onu göster (financing_type'a bakmaksızın)
    if (calculation.accessible_month) {
      return `${calculation.accessible_month}. ayda erişim`;
    } else if (calculation.financing_type === 'cekilissiz') {
      return 'İstediğin zaman';
    } else {
      return 'Çekiliş beklemede';
    }
  };

  const handleRecalculate = (calculation: Calculation) => {
    // Hesaplama parametrelerini URL query'sine ekle
    const params = new URLSearchParams({
      financingType: calculation.financing_type,
      financingAmount: calculation.financing_amount.toString(),
      downPayment: calculation.down_payment.toString(),
      monthlyPayment: calculation.monthly_payment.toString(),
      organizationFeeRate: calculation.organization_fee_rate.toString(),
      annualIncreaseRate: calculation.annual_increase_rate?.toString() || '0'
    });

    // Hesaplama türüne göre ilgili sayfaya yönlendir
    const targetPath = calculation.calculation_type === 'ev' 
      ? '/ev-finansmani' 
      : '/araba-finansmani';
    
    router.push(`${targetPath}?${params.toString()}`);
  };

  const handleShowPaymentTable = async (calculation: Calculation) => {
    setIsLoadingSchedule(true);
    setSelectedCalculation(calculation);
    setShowPaymentTable(true);

    try {
      // Worker'ı kullanarak hesaplamayı yeniden yap
      const worker = new Worker(new URL('@/workers/calculation.worker.ts', import.meta.url));

      worker.onmessage = (event: MessageEvent<CalculationResult>) => {
        const result = event.data;
        
        // FormData formatına dönüştür
        const formData: FormData = {
          financingType: calculation.financing_type,
          financingAmount: calculation.financing_amount,
          downPayment: calculation.down_payment,
          organizationFeeRate: calculation.organization_fee_rate,
          monthlyPayment: calculation.monthly_payment,
          annualIncreaseRate: calculation.annual_increase_rate || 0
        };

        setPaymentScheduleData({ result, formData });
        setIsLoadingSchedule(false);
        worker.terminate();
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        toast({
          title: "Hata",
          description: "Ödeme tablosu yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
        setIsLoadingSchedule(false);
        setShowPaymentTable(false);
        worker.terminate();
      };

      // Worker'a veri gönder
      worker.postMessage({
        financingType: calculation.financing_type,
        financingAmount: calculation.financing_amount,
        downPayment: calculation.down_payment,
        organizationFeeRate: calculation.organization_fee_rate,
        monthlyPayment: calculation.monthly_payment,
        annualIncreaseRate: calculation.annual_increase_rate || 0,
        calculationType: calculation.calculation_type
      });
    } catch (error) {
      console.error('Error showing payment table:', error);
      toast({
        title: "Hata",
        description: "Ödeme tablosu yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
      setIsLoadingSchedule(false);
      setShowPaymentTable(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Sol Taraf - Kullanıcı Bilgileri */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100">
                    <AvatarFallback className="text-lg sm:text-2xl font-bold text-sky-600">
                      {userInfo.name
                        ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900">
                  {userInfo.name || 'Kullanıcı'}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm sm:text-base">
                  Evim Sistemleri Üyesi
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 text-xs sm:text-sm">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{userInfo.email}</span>
                  </div>
                  
                  <div className="flex items-start space-x-3 text-xs sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">
                      Son giriş: {userInfo.loginTimestamp ? formatDate(userInfo.loginTimestamp) : 'Bilinmiyor'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs sm:text-sm">
                    <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      {calculations.length} hesaplama yapıldı
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">Hesaplama Özeti</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-sky-50 rounded-lg">
                      <p className="text-xs text-gray-600">Ev Finansmanı</p>
                      <p className="font-semibold text-sky-600 text-sm sm:text-base">
                        {calculations.filter(c => c.calculation_type === 'ev').length}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-gray-600">Araba Finansmanı</p>
                      <p className="font-semibold text-red-600 text-sm sm:text-base">
                        {calculations.filter(c => c.calculation_type === 'araba').length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Geçmiş Hesaplamalar */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                  <span>Geçmiş Hesaplamalar</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Daha önce yaptığınız finansman hesaplamalarının listesi
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6">
                {calculations.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      Henüz hesaplama yapılmamış
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base px-4">
                      İlk finansman hesaplamanızı yapmak için aşağıdaki butonları kullanın.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-sm mx-auto">
                      <Button 
                        onClick={() => router.push('/ev-finansmani')}
                        className="bg-blue-500 hover:bg-blue-600 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="sm:hidden">Ev Finansmanı</span>
                        <span className="hidden sm:inline">Ev Finansmanı Hesapla</span>
                      </Button>
                      <Button 
                        onClick={() => router.push('/araba-finansmani')}
                        className="bg-red-500 hover:bg-red-600 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Car className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="sm:hidden">Araba Finansmanı</span>
                        <span className="hidden sm:inline">Araba Finansmanı Hesapla</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {calculations.map((calculation) => (
                      <Card key={calculation.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                              <div className="flex items-center space-x-3">
                                {calculation.calculation_type === 'ev' ? (
                                  <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                ) : (
                                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                                    {getCalculationTypeLabel(calculation.calculation_type)}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    {getFinancingTypeLabel(calculation.financing_type)} • {calculation.installment_count} taksit
                                  </p>
                                  <p className="text-xs font-medium text-sky-600 mt-1">
                                    🎯 {getAccessibilityInfo(calculation)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <div className="text-left sm:text-right">
                                  <p className="font-semibold text-sm sm:text-base text-gray-900">
                                    {formatCurrency(calculation.financing_amount)}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    Aylık: {formatCurrency(calculation.monthly_payment)}
                                  </p>
                                </div>
                                
                                <Badge variant="outline" className="flex items-center space-x-1 text-xs whitespace-nowrap">
                                  <Clock className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    {formatDate(calculation.created_at)}
                                  </span>
                                  <span className="sm:hidden">
                                    {new Date(calculation.created_at).toLocaleDateString('tr-TR', {
                                      day: '2-digit',
                                      month: '2-digit'
                                    })}
                                  </span>
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Butonlar */}
                            <div className="flex flex-col sm:flex-row justify-end pt-2 border-t border-gray-100 space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button
                                onClick={() => handleShowPaymentTable(calculation)}
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-xs sm:text-sm"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="sm:hidden">Tablo</span>
                                <span className="hidden sm:inline">Ödeme Tablosu</span>
                              </Button>
                              <Button
                                onClick={() => handleRecalculate(calculation)}
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-xs sm:text-sm"
                              >
                                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="sm:hidden">Yeniden</span>
                                <span className="hidden sm:inline">Tekrar Hesapla</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ödeme Tablosu Modal */}
      <Dialog open={showPaymentTable} onOpenChange={setShowPaymentTable}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:max-w-7xl h-[85vh] sm:h-[90vh] overflow-hidden flex flex-col p-3 sm:p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Table className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              <span className="truncate">
                {selectedCalculation?.calculation_type === 'ev' ? 'Ev' : 'Araba'} Finansmanı
                <span className="hidden sm:inline"> - Ödeme Planı</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto mt-2 sm:mt-4 -mx-3 sm:-mx-6 px-3 sm:px-6">
            {isLoadingSchedule ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Ödeme planı hazırlanıyor...</p>
              </div>
            ) : paymentScheduleData && selectedCalculation ? (
              <div className="w-full">
                <PaymentScheduleTable
                  result={paymentScheduleData.result}
                  formData={paymentScheduleData.formData}
                  calculationType={selectedCalculation.calculation_type}
                  financingType={selectedCalculation.financing_type}
                />
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 text-sm sm:text-base">Ödeme planı yüklenemedi.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 