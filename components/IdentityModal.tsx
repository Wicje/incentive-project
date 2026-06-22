"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase';
import { Input } from '@/components/ui/input';

export default function IdentityModal() {
  const identity = useStore((state) => state.identity);
  const setIdentity = useStore((state) => state.setIdentity);
  
  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIdentity({ uid: user.uid, name: user.displayName || user.email?.split('@')[0] || 'Anonymous', email: user.email || '' });
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
        setIdentity({ uid: result.user.uid, name: result.user.displayName || result.user.email?.split('@')[0] || 'Anonymous', email: result.user.email || '' });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to log in with Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsAuthenticating(true);
    setError('');
    
    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) {
           setIdentity({ uid: result.user.uid, name: result.user.email?.split('@')[0] || 'Anonymous', email: result.user.email || '' });
        }
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
           setIdentity({ uid: result.user.uid, name: result.user.email?.split('@')[0] || 'Anonymous', email: result.user.email || '' });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-stone-800">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-100">Welcome to Agency OS</h2>
            <p className="text-zinc-500 dark:text-stone-400 mt-2 text-sm">Please sign in to securely access your workspace.</p>
          </div>
          
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-11 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
              <Button type="submit" disabled={isAuthenticating} className="w-full h-11 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold">
                {isAuthenticating ? 'Processing...' : (mode === 'login' ? 'Sign in with Email' : 'Create Account')}
              </Button>
            </form>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
              <span className="text-xs text-stone-400">OR</span>
              <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
            </div>

            <Button 
              onClick={handleGoogleLogin} 
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
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

            <div className="text-center mt-4">
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 underline underline-offset-2">
                {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-zinc-50 dark:bg-stone-900 border-t border-zinc-100 dark:border-stone-800 text-xs text-zinc-500 text-center">
          Data is securely stored in Google Firebase.
        </div>
      </div>
    </div>
  );
}
