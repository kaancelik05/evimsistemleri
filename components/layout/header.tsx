"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  HousePlus,
  Home,
  Car,
  Info,
  Phone,
  Menu,
  X,
  BookOpen,
  LogIn,
  UserPlus,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Anasayfa", href: "/", icon: Home },
  { name: "Ev Finansmanı", href: "/ev-finansmani", icon: HousePlus },
  { name: "Araba Finansmanı", href: "/araba-finansmani", icon: Car },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Hakkımızda", href: "/hakkimizda", icon: Info },
  { name: "İletişim", href: "/iletisim", icon: Phone },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('user_logged_in');
      const accessToken = localStorage.getItem('supabase_access_token');
      setIsLoggedIn(loggedIn === 'true' && !!accessToken);
    };

    // Initial check
    checkAuth();
    
    // Listen for storage changes (when user logs in/out from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Listen for custom auth-change event (when user logs in via OAuth)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear all auth-related localStorage items
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('login_timestamp');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('sb-fmfwhsmlfselwfxbivux-auth-token');
    
    // Clear any other potential Supabase auth keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    
    // Trigger custom event to update other components
    window.dispatchEvent(new Event('auth-change'));
    
    // Optionally redirect to home page
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-y-1">
            <img src="/evim-sistemleri-logo.png" alt="Evim Sistemleri" width={32} height={32} />
            <span className="text-lg font-bold text-sky-800">
              Evim Sistemleri
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden desktop:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href ||
                        (item.href === "/blog" && pathname.startsWith("/blog"))
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden desktop:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <Link href="/profil">
                    <Button variant="outline" size="sm" className="text-sky-700 border-sky-200 hover:bg-sky-50">
                      <User className="h-4 w-4 mr-1" />
                      Profil
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="text-sky-700 border-sky-200 hover:bg-sky-50">
                      <LogIn className="h-4 w-4 mr-1" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="desktop:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="desktop:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2 mb-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href ||
                        (item.href === "/blog" && pathname.startsWith("/blog"))
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 px-3">
              {isLoggedIn ? (
                <>
                  <Link href="/profil" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-sky-700 border-sky-200 hover:bg-sky-50 justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-sky-700 border-sky-200 hover:bg-sky-50 justify-start"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      size="sm" 
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white justify-start"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
