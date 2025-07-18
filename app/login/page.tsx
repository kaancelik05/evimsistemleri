"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Chrome } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Handle auth errors and success messages from URL parameters
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = "Giriş yapılırken bir hata oluştu.";
      
      switch (error) {
        case 'auth_failed':
          errorMessage = "Google ile giriş yapılamadı. Lütfen tekrar deneyin.";
          break;
        case 'unexpected':
          errorMessage = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
          break;
        case 'no_code':
          errorMessage = "Giriş işlemi tamamlanamadı. Lütfen tekrar deneyin.";
          break;
      }
      
      toast({
        title: "Giriş Hatası",
        description: errorMessage,
        variant: "destructive",
      });
    }

    const loginSuccess = searchParams.get('login');
    if (loginSuccess === 'success') {
      toast({
        title: "Başarılı!",
        description: "Google ile giriş yapıldı!",
      });
    }

    const registered = searchParams.get('registered');
    if (registered === 'true') {
      toast({
        title: "Kayıt Başarılı!",
        description: "Hesabınız oluşturuldu. E-posta adresinizi kontrol ederek hesabınızı onaylayın, ardından giriş yapabilirsiniz.",
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Giriş Hatası",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user && data.session) {
        // Save tokens to localStorage
        localStorage.setItem('supabase_access_token', data.session.access_token);
        localStorage.setItem('supabase_refresh_token', data.session.refresh_token);
        localStorage.setItem('user_logged_in', 'true');
        localStorage.setItem('login_timestamp', new Date().toISOString());
        
        // Also save user info for future use
        localStorage.setItem('user_email', data.user.email || '');
        localStorage.setItem('user_name', data.user.user_metadata?.full_name || '');

        // Trigger custom event to notify header component
        window.dispatchEvent(new Event('auth-change'));

        toast({
          title: "Başarılı!",
          description: "Giriş yapıldı, yönlendiriliyorsunuz...",
        });
        
        // Small delay to allow the event to be processed
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (error) {
      toast({
        title: "Beklenmeyen Hata",
        description: "Bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Google Giriş Hatası",
          description: error.message,
          variant: "destructive",
        });
        setIsGoogleLoading(false);
      }
      // Loading state will be cleared by the redirect
    } catch (error) {
      toast({
        title: "Beklenmeyen Hata",
        description: "Google ile giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="bg-sky-100 p-3 rounded-full">
                <img 
                  src="/evim-sistemleri-logo.png" 
                  alt="Evim Sistemleri" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Hoş Geldiniz
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Hesabınıza giriş yaparak finansman hesaplamalarınıza devam edin
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-posta Adresi
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Şifre
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Beni hatırla
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Şifremi unuttum
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Giriş yapılıyor...</span>
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  veya
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-12 border-gray-200 hover:bg-gray-50"
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span>Google'a yönlendiriliyor...</span>
                </div>
              ) : (
                <>
                  <Chrome className="h-5 w-5 mr-2" />
                  Google ile Giriş Yap
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center pt-6">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                Kayıt olun
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-8">
          Giriş yaparak{" "}
          <Link href="/gizlilik-politikasi" className="underline hover:text-gray-700">
            Gizlilik Politikamızı
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <LoginPageContent />
    </Suspense>
  );
} 