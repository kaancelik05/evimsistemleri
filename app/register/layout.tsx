import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Kayıt Ol - Evim Sistemleri",
  description: "Evim Sistemleri'ne kayıt olun ve finansman hesaplamalarınızı kaydedin.",
};

export default function RegisterLayout({
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