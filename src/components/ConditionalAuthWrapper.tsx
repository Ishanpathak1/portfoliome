'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Load Firebase wrapper only on the client and only when rendered
const FirebaseAuthWrapper = dynamic(
  () => import('./FirebaseAuthWrapper').then(m => m.FirebaseAuthWrapper),
  { ssr: false }
);

interface ConditionalAuthWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalAuthWrapper({ children }: ConditionalAuthWrapperProps) {
  const pathname = usePathname();
  
  // Pages that need Firebase authentication
  const authRequiredPaths = ['/dashboard', '/features', '/templates', '/faq', '/contact', '/how-it-works', '/blog', '/admin'];
  
  // Check if current path needs authentication.
  // When pathname is null/undefined (initial load/hydration), assume we need auth so Navigation has context.
  const needsAuth = pathname == null ? true : (
    authRequiredPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    ) || pathname === '/'
  );
  
  // For portfolio pages (like /[id]), don't load Firebase
  if (!needsAuth) {
    return <>{children}</>;
  }
  
  // For dashboard and home page, load Firebase
  return (
    <FirebaseAuthWrapper>
      {children}
    </FirebaseAuthWrapper>
  );
} 