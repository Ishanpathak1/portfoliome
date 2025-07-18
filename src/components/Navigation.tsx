'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './FirebaseAuthWrapper';
import { useState } from 'react';
import { 
  Home,
  Layout,
  Info,
  HelpCircle,
  Mail,
  LogIn,
  User,
  LogOut,
  BookOpen,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface NavigationProps {
  showDashboardMode?: boolean;
}

export function Navigation({ showDashboardMode = false }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle cases where auth context might not be available (during SSR)
  let user = null;
  let signInWithGoogle = () => {};
  let signOut = () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    signInWithGoogle = auth.signInWithGoogle;
    signOut = auth.signOut;
  } catch (error) {
    // Auth context not available (during SSR)
    console.log('Auth context not available, using defaults');
  }

  // Auto-detect dashboard mode if not explicitly set
  const isDashboard = showDashboardMode || pathname === '/dashboard';

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Features', href: '/features', icon: Layout },
    { name: 'Templates', href: '/templates', icon: Layout },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'How It Works', href: '/how-it-works', icon: Info },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Dashboard Title */}
          {isDashboard && user ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">
                  Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-300 text-sm">Dashboard</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-white">Dashboard</h1>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-white font-bold text-xl">PortfolioHub</span>
            </Link>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {isDashboard ? (
                  // Dashboard mode - show portfolio link
                  <>
                    <a
                      href={`/${user.email?.split('@')[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">View Live</span>
                    </a>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </>
                ) : (
                  // Regular mode - show dashboard link
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 