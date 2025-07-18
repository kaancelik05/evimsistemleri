"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Ad Soyad kontrolü
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ad Soyad alanı zorunludur.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Ad Soyad en az 2 karakter olmalıdır.";
    }

    // E-posta kontrolü
    if (!formData.email.trim()) {
      newErrors.email = "E-posta alanı zorunludur.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin.";
    }

    // Telefon kontrolü
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası zorunludur.";
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Geçerli bir telefon numarası girin.";
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = "Şifre alanı zorunludur.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    // Şifre onay kontrolü
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifre onayı zorunludur.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor.";
    }

    // KVKK onay kontrolü
    if (!kvkkAccepted) {
      newErrors.kvkkAcceptance = "KVKK aydınlatma metnini kabul etmeniz zorunludur.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleKvkkChange = (checked: boolean) => {
    setKvkkAccepted(checked);
    
    // Clear error when user checks the box
    if (errors.kvkkAcceptance && checked) {
      setErrors(prev => ({ ...prev, kvkkAcceptance: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            kvkk_accepted: kvkkAccepted,
            kvkk_accepted_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        toast({
          title: "Kayıt Hatası",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Başarılı!",
          description: "Hesabınız oluşturuldu. E-posta adresinizi kontrol ederek hesabınızı onaylayın.",
        });
        
        // Redirect to login page
        router.push("/login?registered=true");
      }
    } catch (error) {
      toast({
        title: "Beklenmeyen Hata",
        description: "Kayıt olurken bir hata oluştu, lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                Hesap Oluştur
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Finansman hesaplamalarınızı kaydetmek için hesap oluşturun
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ad Soyad */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Ad Soyad *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Adınız ve soyadınız"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className={`pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500 ${
                      errors.fullName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* E-posta */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-posta Adresi *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500 ${
                      errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Telefon Numarası *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0555 123 45 67"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500 ${
                      errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Şifre */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Şifre *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500 ${
                      errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
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
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Şifre Onayı */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Şifre Onayı *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 pr-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500 ${
                      errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* KVKK Onayı */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="kvkkAcceptance"
                    checked={kvkkAccepted}
                    onCheckedChange={handleKvkkChange}
                    className={`mt-1 ${
                      errors.kvkkAcceptance ? "border-red-300" : ""
                    }`}
                  />
                  <div className="space-y-1 leading-none">
                    <Label 
                      htmlFor="kvkkAcceptance" 
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="text-sky-600 hover:text-sky-700 underline cursor-pointer">
                            KVKK aydınlatma metnini
                          </span>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-gray-900">
                              📄 KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) AYDINLATMA METNİ
                            </DialogTitle>
                          </DialogHeader>
                          <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">1. Veri Sorumlusunun Kimliği</h3>
                              <p>İşbu Aydınlatma Metni, evimsistemleri.com ("Web Sitesi") tarafından, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla hazırlanmıştır.</p>
                              <p><strong>İletişim Bilgileri:</strong><br />
                              Web Sitesi: https://www.evimsistemleri.com<br />
                              E-posta: contact@evimsistemleri.com</p>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">2. İşlenen Kişisel Veriler</h3>
                              <p>Web sitemize Google hesabınız ile giriş yapmanız halinde aşağıdaki kişisel verileriniz işlenebilmektedir:</p>
                              <ul className="list-disc ml-5">
                                <li>Ad ve soyad</li>
                                <li>E-posta adresi</li>
                                <li>Profil fotoğrafı</li>
                                <li>Telefon numarası (Google hesabınızda tanımlıysa ve izin verdiyseniz)</li>
                                <li>IP adresi</li>
                                <li>Oturum bilgileri ve işlem geçmişi</li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">3. Kişisel Verilerin İşlenme Amaçları</h3>
                              <p>Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                              <ul className="list-disc ml-5">
                                <li>Kullanıcı kimlik doğrulamasının sağlanması</li>
                                <li>Hizmetlerimizin sunulması, geliştirilmesi ve optimize edilmesi</li>
                                <li>Hesap oluşturma ve kullanıcı yönetimi süreçlerinin yürütülmesi</li>
                                <li>Kullanıcı destek hizmetlerinin sağlanması</li>
                                <li>Hizmet kullanım istatistiklerinin oluşturulması</li>
                                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                <li>Kötüye kullanımın önlenmesi ve güvenliğin sağlanması</li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">4. Kişisel Verilerin Aktarılması</h3>
                              <p>Kişisel verileriniz:</p>
                              <ul className="list-disc ml-5">
                                <li>Supabase Inc. (kimlik doğrulama ve veri barındırma hizmet sağlayıcısı)</li>
                                <li>Google LLC (Google OAuth kimlik doğrulama hizmeti sağlayıcısı)</li>
                                <li>İlgili yasal merciler ve kamu kurumları (gerekli hallerde)</li>
                              </ul>
                              <p>ile yurt içi ve yurt dışında paylaşılabilir.</p>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h3>
                              <p>Kişisel verileriniz;</p>
                              <ul className="list-disc ml-5">
                                <li>Google OAuth kimlik doğrulama hizmeti aracılığıyla,</li>
                                <li>Web sitemiz üzerinden, otomatik yollarla,</li>
                              </ul>
                              <p>toplanmakta olup, aşağıdaki hukuki sebeplerle işlenmektedir:</p>
                              <ul className="list-disc ml-5">
                                <li>Açık rızanızın alınması (telefon numarası gibi ek veriler için)</li>
                                <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması</li>
                                <li>Veri sorumlusunun meşru menfaati</li>
                                <li>İlgili mevzuatlarda öngörülen yasal yükümlülüklerin yerine getirilmesi</li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">6. KVKK Kapsamındaki Haklarınız</h3>
                              <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
                              <ul className="list-disc ml-5">
                                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                                <li>KVKK kapsamında kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                                <li>Bu taleplerinizin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                                <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi sonucunda aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                                <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
                              </ul>
                              <p>Bu haklarınızı kullanmak için bize contact@evimsistemleri.com adresinden ulaşabilirsiniz.</p>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900">7. Yürürlük ve Güncellemeler</h3>
                              <p>İşbu Aydınlatma Metni [18.07.2025] tarihinde güncellenmiş olup, www.evimsistemleri.com adresinde yayımlanarak kullanıcıların erişimine sunulmuştur. Metin, ihtiyaç duyuldukça güncellenebilir.</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {" "}okudum ve kabul ediyorum. *
                    </Label>
                  </div>
                </div>
                {errors.kvkkAcceptance && (
                  <p className="text-sm text-red-600">{errors.kvkkAcceptance}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Hesap oluşturuluyor...</span>
                  </div>
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-6">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                Giriş yapın
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-8">
          Kayıt olarak{" "}
          <Link href="/gizlilik-politikasi" className="underline hover:text-gray-700">
            Gizlilik Politikamızı
          </Link>{" "}
          ve{" "}
          <Link href="/kullanici-sozlesmesi" className="underline hover:text-gray-700">
            Kullanıcı Sözleşmesini
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
} 