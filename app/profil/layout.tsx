import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil - Evim Sistemleri",
  description: "Kullanıcı profili ve geçmiş hesaplamalarınızı görüntüleyin.",
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 