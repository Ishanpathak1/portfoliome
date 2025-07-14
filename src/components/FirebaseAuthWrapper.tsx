'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { User as UserIcon, LogOut, LogIn } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthWrapper');
  }
  return context;
}

interface FirebaseAuthWrapperProps {
  children: ReactNode;
}

export function FirebaseAuthWrapper({ children }: FirebaseAuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-white text-sm font-medium">
                {user.displayName || user.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-gray-300 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthWrapper({ children, requireAuth = false }: AuthWrapperProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Let FirebaseAuthWrapper handle loading state
  }

  if (requireAuth && !user) {
    return <SignInPrompt />;
  }

  return <>{children}</>;
}

function SignInPrompt() {
  const { signInWithGoogle, signInWithGithub } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
          <UserIcon className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-300 mb-8">
            Please sign in to create and manage your portfolio. One portfolio per user.
          </p>
          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              <span>🚀</span>
              <span>Continue with Google</span>
            </button>
            <button
              onClick={signInWithGithub}
              className="w-full flex items-center justify-center space-x-3 bg-gray-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all duration-300"
            >
              <span>💻</span>
              <span>Continue with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 