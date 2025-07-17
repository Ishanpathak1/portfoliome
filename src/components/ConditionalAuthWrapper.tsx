'use client';

import { usePathname } from 'next/navigation';
import { FirebaseAuthWrapper } from './FirebaseAuthWrapper';

interface ConditionalAuthWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalAuthWrapper({ children }: ConditionalAuthWrapperProps) {
  const pathname = usePathname();
  
  // Pages that need Firebase authentication
  const authRequiredPaths = ['/dashboard'];
  
  // Check if current path needs authentication
  const needsAuth = authRequiredPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  ) || pathname === '/'; // Only exact match for home page
  
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