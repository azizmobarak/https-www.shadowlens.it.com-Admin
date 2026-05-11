'use client';

import React, { useState } from 'react';
import { 
  Shield, Lock, Key, Copy, Check, RefreshCw
} from 'lucide-react';
import SuperSidebar from '@/components/layout/SuperSidebar';

export default function MasterKeysPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const authorize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/master-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        const data = await res.json();
        setMasterKey(data.masterKey);
        setIsAuthorized(true);
      } else {
        alert('Authorization Failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(masterKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white font-sans flex">
      <SuperSidebar />
      <div className="flex-1 p-12 overflow-y-auto max-w-4xl">
         <header className="mb-12">
            <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">Master Protocols</h1>
            <p className="text-gray-500 font-medium">Access rotating global recovery keys for emergency endpoint removal.</p>
         </header>

         {!isAuthorized ? (
           <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[40px] text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
                 <Lock className="text-purple-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vault Locked</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-8 leading-relaxed">
                 Enter your Master Key to reveal the Global Recovery Key.
              </p>
              <form onSubmit={authorize} className="space-y-4">
                 <input 
                  required
                  type="password" 
                  placeholder="Confirm Master Key" 
                  className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-500 text-center text-sm text-white"
                  onChange={e => setPassword(e.target.value)}
                 />
                 <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 rounded-2xl transition-all shadow-2xl disabled:opacity-30">
                    {loading ? 'Decrypting...' : 'Reveal Protocol'}
                 </button>
              </form>
           </div>
         ) : (
           <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px]" />
                 <div className="flex items-center gap-3 mb-8">
                    <Key className="text-purple-500 w-5 h-5" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-500">Rotating Recovery Key</h3>
                 </div>
                 <div className="flex items-center justify-between bg-black border border-white/10 p-6 rounded-2xl">
                    <code className="text-lg font-mono text-white tracking-widest">{masterKey}</code>
                    <button 
                      onClick={copyToClipboard}
                      className="p-3 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white"
                    >
                       {copied ? <Check className="text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                 </div>
                 <div className="mt-8 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-4">
                    <RefreshCw className="text-red-500 w-5 h-5 flex-shrink-0 animate-spin-slow" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 leading-relaxed">
                      ONE-TIME USE ACTIVE. THIS KEY WILL SELF-DESTRUCT AND ROTATE IMMEDIATELY AFTER A SUCCESSFUL UNINSTALLATION.
                    </p>
                 </div>
              </div>
           </div>
         )}
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </main>
  );
}
