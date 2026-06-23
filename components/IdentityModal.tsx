"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IdentityModal() {
  const identity = useStore((state) => state.identity);
  const setIdentity = useStore((state) => state.setIdentity);
  
  const [mounted, setMounted] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || identity) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsAuthenticating(true);
    setError('');
    
    // Hardcoded fallback for app access without Google OAuth
    if (email === 'chiemeziem60@gmail.com' && password === 'admin123') {
      setIdentity({ uid: 'chiemeziem60', name: 'Chiemeziem', email: email });
      setIsAuthenticating(false);
      return;
    }

    setError('Invalid email or password.');
    setIsAuthenticating(false);
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
                {isAuthenticating ? 'Processing...' : 'Sign in securely'}
              </Button>
            </form>
          </div>
        </div>
        <div className="px-8 py-4 bg-zinc-50 dark:bg-stone-900 border-t border-zinc-100 dark:border-stone-800 text-xs text-zinc-500 text-center">
          Secure private workspace access.
        </div>
      </div>
    </div>
  );
}
