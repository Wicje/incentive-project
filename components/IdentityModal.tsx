"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IdentityModal() {
  const identity = useStore((state) => state.identity);
  const setIdentity = useStore((state) => state.setIdentity);
  
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || identity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIdentity({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Welcome to Agency OS</h2>
            <p className="text-zinc-500 mt-2 text-sm">Please identify yourself to interact with projects and tasks.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
              <Input 
                autoFocus
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Jane Doe" 
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Work Email</label>
              <Input 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="jane@agency.com" 
                className="w-full"
                required
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">Continue to Dashboard</Button>
            </div>
          </form>
        </div>
        <div className="px-8 py-4 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500 text-center">
          Data is stored locally and synced via external services (Google Sheets).
        </div>
      </div>
    </div>
  );
}
