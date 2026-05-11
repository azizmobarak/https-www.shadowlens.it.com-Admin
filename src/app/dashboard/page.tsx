'use client';

import React, { useEffect, useState } from 'react';
import { 
  Shield, Activity, Users, Layers, AlertCircle, 
  ArrowUpRight, Globe, Server, Cpu
} from 'lucide-react';
import SuperSidebar from '@/components/layout/SuperSidebar';
import clsx from 'clsx';

export default function SuperDashboard() {
  const [stats, setStats] = useState({ totalTenants: 0, totalAgents: 0, totalViolations: 0, systemHealth: '...' });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) setStats(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white font-sans flex">
      <SuperSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl px-8 flex items-center justify-between">
           <div>
              <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white">Global Command Center</h1>
              <p className="text-[10px] text-purple-500 uppercase font-bold mt-1 italic">Master Instance Authorized</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Network Secure</span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           {/* Global Stats */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Clients', value: stats.totalTenants, sub: 'B2B Entities', icon: Layers, color: 'blue' },
                { label: 'Global Nodes', value: stats.totalAgents, sub: 'Active Agents', icon: Cpu, color: 'purple' },
                { label: 'Intercepted Data', value: stats.totalViolations, sub: 'Global Hits', icon: Shield, color: 'red' },
                { label: 'Master Pulse', value: stats.systemHealth, sub: 'Stable', icon: Activity, color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className={clsx("p-2 rounded-xl bg-opacity-10", 
                        stat.color === 'blue' ? 'bg-blue-500' : 
                        stat.color === 'purple' ? 'bg-purple-500' : 
                        stat.color === 'red' ? 'bg-red-500' : 'bg-green-500')}>
                         <stat.icon className={clsx("w-5 h-5", 
                           stat.color === 'blue' ? 'text-blue-500' : 
                           stat.color === 'purple' ? 'text-purple-500' : 
                           stat.color === 'red' ? 'text-red-500' : 'text-green-500')} />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-700" />
                   </div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                   <div className="text-3xl font-black text-white">{stat.value}</div>
                   <p className="text-[10px] text-gray-700 font-bold mt-2 uppercase tracking-tighter">{stat.sub}</p>
                </div>
              ))}
           </div>

           {/* System Insights */}
           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Production Infrastructure</h3>
                 </div>
                 
                 <div className="bg-white/[0.01] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
                       <Server className="text-blue-500 w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Cloud Synced</h4>
                    <p className="text-gray-500 text-center max-w-sm text-sm">
                      Global telemetry is being received and processed by the api.shadowlens.it.com communicator.
                    </p>
                 </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-8">System Alerts</h3>
                 <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 flex gap-4">
                       <Shield className="text-green-500 w-5 h-5 flex-shrink-0" />
                       <p className="text-[10px] uppercase font-bold text-gray-400">All Master Keys are currently encrypted and secured.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
      `}</style>
    </main>
  );
}
