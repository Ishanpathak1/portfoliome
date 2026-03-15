'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './FirebaseAuthWrapper';
import { useState, useEffect } from 'react';
import { 
  LogIn,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { navItems as navigation } from '@/components/nav-config';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface NavigationProps {
  showDashboardMode?: boolean;
}

interface UserPortfolio {
  slug: string;
}

export function Navigation({ showDashboardMode = false }: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null);
  
  // Handle cases where auth context might not be available (during SSR)
  let user = null;
  let signInWithGoogle = () => {};
  let signOut = () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    signInWithGoogle = auth.signInWithGoogle;
    signOut = auth.signOut;
  } catch {
    // Auth context not available yet (during hydration or before FirebaseAuthWrapper loads)
  }

  // Fetch user's portfolio data when user is available
  useEffect(() => {
    const fetchUserPortfolio = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user-portfolio', {
            headers: {
              'Authorization': `Bearer ${await user.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.portfolio) {
              setUserPortfolio(data.portfolio);
            }
          }
        } catch (error) {
          console.error('Error fetching user portfolio:', error);
        }
      }
    };

    fetchUserPortfolio();
  }, [user]);

  // Auto-detect dashboard mode if not explicitly set
  const isDashboard = showDashboardMode || pathname === '/dashboard';

  // navigation imported from shared config

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--card))]/80 backdrop-blur-xl border-b border-[rgb(var(--border))]/60 ${isDashboard && user ? 'lg:left-64' : ''}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo / Dashboard Title */}
          {isDashboard && user ? (
            <div className="flex items-center gap-3 flex-shrink-0 min-w-[220px] ml-[-12px] sm:ml-[-24px] lg:ml-[-32px]">
              <div className="w-10 h-10 bg-[rgb(var(--accent-600))] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[rgb(var(--fg))] dark:text-white">
                  Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">Dashboard</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-[rgb(var(--fg))] dark:text-white">Dashboard</h1>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[rgb(var(--accent-600))] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-xl text-[rgb(var(--fg))] dark:text-white">PortfolioHub</span>
            </Link>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center ${
                  isActive(item.href)
                    ? 'bg-[rgb(var(--accent-600))]/15 text-[rgb(var(--fg))] dark:text-white'
                    : 'text-gray-600 hover:bg-[rgb(var(--border))]/40'
                }`}
                style={!isActive(item.href) ? { color: 'var(--fg)' } : undefined}
              >
                <span className="flex items-center gap-1.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons, Notification Bell & Mobile Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-3">
                {isDashboard ? (
                  // Dashboard mode - View Live, Sign Out, and theme toggle are in the left sidebar; only show NotificationBell on desktop, mobile menu always
                  <>
                    <NotificationBell isDashboard />
                  </>
                ) : (
                  // Regular mode - show dashboard link
                  <>
                    <NotificationBell />
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 bg-[rgb(var(--accent-600))]/10 rounded-md text-[rgb(var(--fg))] dark:text-white hover:bg-[rgb(var(--accent-600))]/20 transition-colors whitespace-nowrap"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-1 text-gray-600 hover:text-[rgb(var(--fg))] transition-colors px-3 py-2 rounded-md hover:bg-[rgb(var(--border))]/40"
                      style={{ color: 'var(--fg)' }}
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
                className="flex items-center gap-2 bg-[rgb(var(--accent-600))] text-white px-4 py-2 rounded-md hover:bg-[rgb(var(--accent))] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-[rgb(var(--border))]/40 transition-colors"
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
        <div className="lg:hidden border-t border-[rgb(var(--border))]/60 bg-[rgb(var(--card))]/70 dark:bg-black/30 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[rgb(var(--accent-600))]/10 text-[rgb(var(--fg))] dark:text-white'
                    : 'text-gray-600 hover:bg-[rgb(var(--border))]/40'
                }`}
                style={!isActive(item.href) ? { color: 'var(--fg)' } : undefined}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            {isDashboard && user && (
              <>
                <a
                  href={userPortfolio ? `/${userPortfolio.slug}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!userPortfolio) e.preventDefault();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    userPortfolio ? 'text-gray-600 hover:bg-[rgb(var(--border))]/40' : 'opacity-60 cursor-not-allowed'
                  }`}
                  style={userPortfolio ? { color: 'var(--fg)' } : undefined}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>{userPortfolio ? 'View Live' : 'Loading...'}</span>
                </a>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium w-full text-left text-gray-600 hover:bg-[rgb(var(--border))]/40"
                  style={{ color: 'var(--fg)' }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 