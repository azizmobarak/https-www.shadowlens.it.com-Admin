'use client';

import React, { useState } from 'react';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const error = await res.json();
        alert(error.error || 'Login Failed');
      }
    } catch (err) {
      alert('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-6 shadow-2xl">
            <Shield className="text-blue-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Super Admin</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Shadow AI Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Admin Email</label>
             <input 
              required
              type="email"
              placeholder="admin@shadowlens.it"
              className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-800 text-sm"
              onChange={(e) => setEmail(e.target.value)}
             />
          </div>
          <div className="space-y-1 text-white">
             <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Master Key</label>
             <input 
              required
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-800 text-sm"
              onChange={(e) => setPassword(e.target.value)}
             />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 rounded-2xl transition-all shadow-2xl disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
          >
            {loading ? 'Authenticating...' : 'Access Command Center'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center mt-10 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
           Property of Shadow AI Intelligence © 2026
        </p>
      </div>
    </main>
  );
}
