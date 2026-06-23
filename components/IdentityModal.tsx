"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged } from '@/lib/firebase';

export default function IdentityModal() {
  const identity = useStore((state) => state.identity);
  const setIdentity = useStore((state) => state.setIdentity);
  
  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIdentity({ uid: user.uid, name: user.displayName || 'Anonymous', email: user.email || '' });
      }
    });
    return () => unsubscribe();
  }, [setIdentity]);

  if (!mounted || identity) return null;

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIdentity({ uid: result.user.uid, name: result.user.displayName || 'Anonymous', email: result.user.email || '' });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to log in with Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Welcome to Agency OS</h2>
            <p className="text-zinc-500 mt-2 text-sm">Please sign in to securely access your workspace.</p>
          </div>
          
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full h-12 flex items-center justify-center gap-2"
              disabled={isAuthenticating}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isAuthenticating ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </div>
        </div>
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 text-center">
          Data is securely stored in Google Firebase.
        </div>
      </div>
    </div>
  );
}
