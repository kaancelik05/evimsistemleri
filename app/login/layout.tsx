import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Giriş Yap - Evim Sistemleri",
  description: "Evim Sistemleri hesabınıza giriş yapın ve finansman hesaplamalarınıza erişin.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster />
    </div>
  );
} 