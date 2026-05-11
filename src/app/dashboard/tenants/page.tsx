'use client';

import React, { useEffect, useState } from 'react';
import { 
  Layers, Users, Shield, Edit3, Check, X, Search, Plus, Trash2, Mail, Lock, Building
} from 'lucide-react';
import SuperSidebar from '@/components/layout/SuperSidebar';
import clsx from 'clsx';

export default function TenantManagement() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSeats, setNewSeats] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Tenant Form
  const [formData, setFormData] = useState({
    companyName: '',
    adminEmail: '',
    password: '',
    plan: 'starter',
    allowedSeats: 5
  });

  const fetchTenants = async () => {
    try {
      const res = await fetch('/api/dashboard/tenants');
      if (res.ok) setTenants(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/dashboard/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchTenants();
      setFormData({ companyName: '', adminEmail: '', password: '', plan: 'starter', allowedSeats: 5 });
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to create tenant');
    }
  };

  const updateSeats = async (id: string) => {
    const res = await fetch('/api/dashboard/tenants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, allowedSeats: newSeats })
    });
    if (res.ok) {
      setEditingId(null);
      fetchTenants();
    }
  };

  const deleteTenant = async (id: string) => {
    if (!confirm('Are you sure? This will terminate all agents for this client.')) return;
    const res = await fetch(`/api/dashboard/tenants?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchTenants();
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white font-sans flex relative">
      <SuperSidebar />

      <div className="flex-1 p-12 overflow-y-auto">
         <header className="mb-12 flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-black mb-2 tracking-tight uppercase italic">Client Registry</h1>
               <p className="text-gray-500 font-medium uppercase text-[10px] tracking-widest">Global License & Governance Management</p>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
               >
                  <Plus className="w-4 h-4" />
                  Register Client
               </button>
            </div>
         </header>

         {/* Table */}
         <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Corporate Entity</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Administrative Access</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Seat Allocation</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Security Posture</th>
                     <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Operations</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {tenants.map((t: any) => (
                    <tr key={t._id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-6">
                          <p className="font-bold text-white uppercase tracking-tight">{t.companyName}</p>
                          <p className="text-[9px] text-blue-500 font-mono mt-1 uppercase font-black">{t.plan} TIER</p>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2">
                             <Mail className="w-3 h-3 text-gray-600" />
                             <span className="text-xs text-gray-400 font-bold">{t.adminEmail}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          {editingId === t._id ? (
                            <div className="flex items-center gap-2">
                               <input 
                                 type="number" 
                                 defaultValue={t.allowedSeats}
                                 className="w-16 bg-black border border-blue-500/50 rounded-lg p-1 text-center text-xs text-white"
                                 onChange={(e) => setNewSeats(parseInt(e.target.value))}
                               />
                               <button onClick={() => updateSeats(t._id)} className="p-1 hover:text-green-500"><Check className="w-4 h-4" /></button>
                               <button onClick={() => setEditingId(null)} className="p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                               <span className={clsx(
                                 "text-xs font-mono font-black px-2 py-1 rounded-md bg-white/5 border border-white/5",
                                 t.usedSeats >= t.allowedSeats ? "text-red-500" : "text-green-400"
                               )}>
                                 {t.usedSeats || 0} / {t.allowedSeats}
                               </span>
                               <button 
                                 onClick={() => { setEditingId(t._id); setNewSeats(t.allowedSeats); }}
                                 className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-white"
                               >
                                 <Edit3 className="w-3.5 h-3.5" />
                               </button>
                            </div>
                          )}
                       </td>
                       <td className="p-6">
                          <div className={clsx(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            t.status === 'active' ? "bg-green-500/5 text-green-500 border-green-500/20" : "bg-red-500/5 text-red-500 border-red-500/20"
                          )}>
                             <div className={clsx("w-1.5 h-1.5 rounded-full shadow-[0_0_8px]", t.status === 'active' ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50")} />
                             {t.status}
                          </div>
                       </td>
                       <td className="p-6 text-right">
                          <button 
                           onClick={() => deleteTenant(t._id)}
                           className="p-3 hover:bg-red-500/10 rounded-xl transition-all text-gray-700 hover:text-red-500"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
              
              <button 
               onClick={() => setIsModalOpen(false)}
               className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                 <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter">Corporate Enrollment</h2>
                 <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">Initialize new client instance</p>
              </div>

              <form onSubmit={createTenant} className="space-y-6">
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Company Name</label>
                          <input required type="text" className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm" 
                           onChange={e => setFormData({...formData, companyName: e.target.value})} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Initial Seats</label>
                          <input required type="number" defaultValue={5} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm" 
                           onChange={e => setFormData({...formData, allowedSeats: parseInt(e.target.value)})} />
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Admin Email</label>
                       <input required type="email" className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm" 
                        onChange={e => setFormData({...formData, adminEmail: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Temporary Password</label>
                       <input required type="text" className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm" 
                        onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Service Tier</label>
                       <select className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-sm appearance-none"
                        onChange={e => setFormData({...formData, plan: e.target.value})}>
                          <option value="starter" className="bg-black">Starter Protocol</option>
                          <option value="enterprise" className="bg-black">Enterprise Elite</option>
                       </select>
                    </div>
                 </div>

                 <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 rounded-2xl transition-all shadow-2xl mt-4">
                    Authorize & Deploy
                 </button>
              </form>
           </div>
        </div>
      )}
    </main>
  );
}
