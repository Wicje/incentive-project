"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IdentityModal() {
  const identity = useStore((state) => state.identity);
  const setIdentity = useStore((state) => state.setIdentity);
  
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || identity) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === 'admin123' && email) {
      setIdentity({ uid: email, name: email.split('@')[0], email: email });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#242E3D] rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-[#37818D]/20">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-gray-100">Welcome to Agency OS</h2>
            <p className="text-zinc-500 dark:text-gray-400 mt-2 text-sm">Please sign in to securely access your workspace.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Email</label>
              <Input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-white dark:bg-[#37818D]/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-gray-300">Password</label>
              <Input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-white dark:bg-[#37818D]/10"
              />
            </div>
            <Button 
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 dark:bg-[#37818D] dark:text-white"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
