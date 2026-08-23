'use client';

import { usePathname } from 'next/navigation';
import { FirebaseAuthWrapper } from './FirebaseAuthWrapper';

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
  
  // For portfolio pages (like /[id]), don't wrap in Firebase
  if (!needsAuth) {
    return <>{children}</>;
  }
  
  return (
    <FirebaseAuthWrapper>
      {children}
    </FirebaseAuthWrapper>
  );
}
