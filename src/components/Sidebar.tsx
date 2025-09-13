'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BarChart3, Palette, User as UserIcon, FileText, Layers, Briefcase, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from './FirebaseAuthWrapper';
import { LogOut, User, Moon, Sun, ExternalLink } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';

interface UserPortfolio {
  slug: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  let user: any = null;
  let signInWithGoogle = () => {};
  let signOut = () => {};
  try {
    const auth = useAuth();
    user = auth.user;
    signInWithGoogle = auth.signInWithGoogle;
    signOut = auth.signOut;
  } catch {}

  const [userPortfolio, setUserPortfolio] = useState<UserPortfolio | null>(null);
  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const response = await fetch('/api/user-portfolio', {
          headers: { 'Authorization': `Bearer ${await user.getIdToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.portfolio) setUserPortfolio(data.portfolio);
        }
      } catch (e) {
        console.error('Error fetching user portfolio', e);
      }
    };
    run();
  }, [user]);

  const dashboardTabs = [
    { id: 'overview', title: 'Overview', icon: BarChart3 },
    { id: 'design', title: 'Design & Theme', icon: Palette },
    { id: 'content', title: 'Content & Info', icon: UserIcon },
    { id: 'cover-letter', title: 'Cover Letter', icon: FileText },
    { id: 'custom', title: 'Custom Sections', icon: Layers },
    { id: 'jobs', title: 'My Jobs', icon: Briefcase },
    { id: 'settings', title: 'Settings', icon: SettingsIcon },
  ];
  const isActiveTab = (tabId: string) => {
    const currentTab = searchParams?.get('tab');
    if (!currentTab) return tabId === 'overview' && pathname === '/dashboard';
    return currentTab === tabId;
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-[rgb(var(--border))] bg-[rgb(var(--card))] h-screen sticky top-0">
      <div className="h-16 px-4 flex items-center justify-between border-b border-[rgb(var(--border))]">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[rgb(var(--accent-600))] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="font-bold text-[rgb(var(--fg))] dark:text-white">PortfolioHub</span>
        </Link>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[rgb(var(--border))]/40 dark:hover:bg-white/10"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {dashboardTabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard?tab=${tab.id}`}
              aria-current={isActiveTab(tab.id) ? 'page' : undefined}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActiveTab(tab.id)
                  ? 'bg-[rgb(var(--accent-600))]/15 text-[rgb(var(--fg))] dark:text-white border-l-2 border-l-[rgb(var(--accent-600))]'
                  : 'text-gray-600 hover:bg-[rgb(var(--border))]/40 hover:text-gray-800'
              }`}
              style={!isActiveTab(tab.id) ? { color: 'var(--fg)' } : undefined}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-[rgb(var(--border))] space-y-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[rgb(var(--border))]/40 hover:text-gray-800"
          style={{ color: 'var(--fg)' }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {user ? (
          <>
            <a
              href={userPortfolio ? `/${userPortfolio.slug}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 border border-[rgb(var(--border))] px-3 py-2 rounded-lg transition-colors text-gray-600 ${
                userPortfolio ? 'hover:bg-[rgb(var(--border))]/40 hover:text-gray-800' : 'cursor-not-allowed opacity-60'
              }`}
              style={{ color: 'var(--fg)' }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live</span>
            </a>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-[rgb(var(--border))]/40 hover:text-gray-800"
              style={{ color: 'var(--fg)' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center space-x-2 bg-[rgb(var(--accent-600))] text-white px-3 py-2 rounded-lg hover:bg-[rgb(var(--accent))]"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
}


