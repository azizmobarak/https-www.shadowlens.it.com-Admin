'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, Activity, Users, Lock, BarChart3, LogOut, Settings, Layers
} from 'lucide-react';
import clsx from 'clsx';

export default function SuperSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "super_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/';
  };

  const navItems = [
    { id: 'overview', icon: Activity, label: 'Global Stats', href: '/dashboard' },
    { id: 'tenants', icon: Layers, label: 'Manage Clients', href: '/dashboard/tenants' },
    { id: 'security', icon: Lock, label: 'Master Keys', href: '/dashboard/master-keys' },
    { id: 'agents', icon: Users, label: 'Live Nodes', href: '#' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col justify-between hidden lg:flex h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
             <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-white">Master</span>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em]",
                pathname === item.href 
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Mode</p>
           <p className="text-[10px] font-mono text-purple-400 uppercase">System God Mode</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4" />
          Terminate Access
        </button>
      </div>
    </aside>
  );
}
