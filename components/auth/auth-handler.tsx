"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function AuthHandlerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const loginSuccess = searchParams.get('login');

    if (loginSuccess === 'success') {
      // Check if tokens are already in localStorage (from callback page)
      const accessToken = localStorage.getItem('supabase_access_token');
      const refreshToken = localStorage.getItem('supabase_refresh_token');
      
      if (accessToken && refreshToken) {
        // Show success message
        toast({
          title: "Başarılı!",
          description: "Google ile giriş yapıldı! Hoş geldiniz.",
        });

        // Trigger custom event to notify header component
        window.dispatchEvent(new Event('auth-change'));

        // Clean URL by removing login parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('login');
        
        // Use router.replace to update URL without page reload
        router.replace(url.pathname + url.search);
      } else {
        toast({
          title: "Hata",
          description: "Giriş bilgileri bulunamadı.",
          variant: "destructive",
        });
      }
    }
  }, [searchParams, router, toast]);

  return null; // This component doesn't render anything
}

export function AuthHandler() {
  return (
    <Suspense fallback={null}>
      <AuthHandlerContent />
    </Suspense>
  );
} 