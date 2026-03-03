
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   RefreshCw, BookOpen, Plus, Send, Check, Trash2, Database,
   ShieldCheck, LogOut, FileText, ArrowLeft, Download,
   Zap, Bell, X, PieChart as PieIcon, Users, Shield,
   ChevronRight, Search, Activity, HardDrive,
   Filter, CheckCircle2, XCircle, Star, Edit3, MessageCircle,
   BarChart as BarChartIcon, Eye, Layout, Globe, Image as ImageIcon, Link as LinkIcon,
   Calendar, FileJson, ShieldAlert, ClipboardList, Settings, MoreVertical,
   CheckCheck, AlertTriangle, PlayCircle, Lock, Heart, Clock, Paperclip,
   Save, UserPlus, GraduationCap, Info, Gamepad2, Layers, BarChart2,
   ListFilter, Target, History, Lightbulb, ExternalLink, Video,
   ArrowRight, PenTool, HelpCircle, MessageSquare, Repeat, Smartphone, Sparkles, Megaphone,
   Trophy, Type, Home, Mic, UserCog, Ban, Key, Map as MapIcon, Quote,
   TrendingUp, BarChart3, Vote, ToggleLeft, ToggleRight, PlusCircle, ChevronDown
} from 'lucide-react';
import {
   ANNUAL_STUDY_PLAN,
   ADMIN_CONFIG,
   APP_CONFIG,
   MOCK_EVENTS,
   DEFAULT_SITE_CONTENT
} from '../constants';
import {
   BookClubWeek,
   Announcement,
   UserProfile,
   AuditLog,
   Reflection,
   BookClubQuizQuestion,
   Event as SmsEvent,
   BrandingConfig,
   SiteContent,
   Poll,
   PollVote
} from '../types';
import SaiAvatar from '../components/SaiAvatar';
import {
   BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
   PieChart as RePieChart, Pie, Sector, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, addDoc, query, where, orderBy, limit, Timestamp, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Papa from 'papaparse';

// --- UTILITIES ---
const logAdminAction = (adminEmail: string, action: string, resource: string, outcome: 'success' | 'failure' = 'success') => {
   const logs: AuditLog[] = JSON.parse(localStorage.getItem('sms_audit_logs') || '[]');
   const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminEmail,
      action,
      target: resource,
      outcome
   };
   localStorage.setItem('sms_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 500)));
};

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string, key?: React.Key }) => (
   <div className={`bg-white rounded-bento border border-navy-50 shadow-xl overflow-hidden ${className}`}>
      {children}
   </div>
);

// --- MODULES ---

const EXPORT_COLUMNS = [
   { key: 'UID',        label: 'UID',          defaultOn: false },
   { key: 'Name',       label: 'Name',         defaultOn: true  },
   { key: 'Email',      label: 'Email',        defaultOn: true  },
   { key: 'Gender',     label: 'Gender',       defaultOn: true  },
   { key: 'State',      label: 'State/Region', defaultOn: true  },
   { key: 'Centre',     label: 'Sai Centre',   defaultOn: true  },
   { key: 'IsAdmin',    label: 'Is Admin',     defaultOn: true  },
   { key: 'IsGuest',    label: 'Is Guest',     defaultOn: false },
   { key: 'JoinedAt',   label: 'Joined At',    defaultOn: true  },
   { key: 'TotalChants',label: 'Total Chants', defaultOn: true  },
   { key: 'OnboardedApp',label: 'Onboarded',  defaultOn: false },
];

// 7. USER REGISTRY & ROLE MANAGER
const UserRegistry = ({ adminEmail }: { adminEmail: string }) => {
   const [users, setUsers] = useState<UserProfile[]>([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
   const [userStats, setUserStats] = useState<Record<string, number>>({});
   const [activeTab, setActiveTab] = useState<'registry' | 'analytics'>('registry');
   const [isLoading, setIsLoading] = useState(true);
   const [loadError, setLoadError] = useState<string | null>(null);
   const [exportDateFrom, setExportDateFrom] = useState('');
   const [exportDateTo, setExportDateTo] = useState('');
   const [showExportSettings, setShowExportSettings] = useState(false);
   const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>(
      () => Object.fromEntries(EXPORT_COLUMNS.map(c => [c.key, c.defaultOn]))
   );

   useEffect(() => {
      loadRegistry();
      window.addEventListener('storage', loadRegistry);
      return () => window.removeEventListener('storage', loadRegistry);
   }, []);

   const loadRegistry = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
         const usersSnap = await getDocs(collection(db, 'users'));
         const allUsers: UserProfile[] = usersSnap.docs.map(d => d.data() as UserProfile);

         setUsers(allUsers);
         localStorage.setItem('sms_all_users', JSON.stringify(allUsers)); // Keep local cache for other modules

         // Calculate activity stats for visualization
         const statsMap: Record<string, number> = {};
         allUsers.forEach(u => {
            const s = JSON.parse(localStorage.getItem(`sms_stats_${u.uid}`) || '{"gayathri":0, "saiGayathri":0, "likitha":0}');
            statsMap[u.uid] = (s.gayathri || 0) + (s.saiGayathri || 0) + ((s.likitha || 0) * 11);
         });
         setUserStats(statsMap);
      } catch (error: any) {
         console.error("Error loading registry from Firestore", error);
         setLoadError(
            error?.code === 'permission-denied'
               ? "Access denied. Please ensure you are logged in as an authorized admin."
               : `Failed to load members: ${error?.message || 'Unknown error'}`
         );
      } finally {
         setIsLoading(false);
      }
   };

   const toggleAdmin = async (uid: string, currentStatus: boolean | undefined) => {
      try {
         await updateDoc(doc(db, 'users', uid), { isAdmin: !currentStatus });

         const updatedUsers = users.map(u => {
            if (u.uid === uid) return { ...u, isAdmin: !currentStatus };
            return u;
         });
         setUsers(updatedUsers);
         localStorage.setItem('sms_all_users', JSON.stringify(updatedUsers));

         const currentUser = JSON.parse(localStorage.getItem('sms_user') || '{}');
         if (currentUser.uid === uid) {
            currentUser.isAdmin = !currentStatus;
            localStorage.setItem('sms_user', JSON.stringify(currentUser));
         }

         logAdminAction(adminEmail, currentStatus ? 'Revoked Admin' : 'Granted Admin', uid);
         window.dispatchEvent(new Event('storage'));
      } catch (error) {
         console.error("Error toggling admin", error);
         alert("Failed to update user role.");
      }
   };

   const deleteUser = async (uid: string) => {
      if (!window.confirm("Are you sure? This will remove the user and their login access.")) return;
      try {
         await deleteDoc(doc(db, 'users', uid));
         const updatedUsers = users.filter(u => u.uid !== uid);
         setUsers(updatedUsers);
         localStorage.setItem('sms_all_users', JSON.stringify(updatedUsers));
         logAdminAction(adminEmail, 'Deleted User', uid);
         window.dispatchEvent(new Event('storage'));
      } catch (error) {
         console.error("Error deleting user", error);
         alert("Failed to delete user.");
      }
   };

   // derived state for visualization
   const regionData = useMemo(() => {
      const counts: Record<string, number> = {};
      users.forEach(u => {
         const region = u.state || 'Unknown';
         counts[region] = (counts[region] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
   }, [users]);

   // Book Club Analytics
   const bookClubData = useMemo(() => {
      // Need to scan all briefcases or completions. 
      // Since completions are simple IDs, we'll infer:
      // Readers: sms_completions includes ID.
      // Excellent: sms_badges includes 'elite'.
      // Failed: (Not easily trackable in current schema without quiz attempt log, we will mock slightly based on briefcase).

      // For this prototype, we simulate based on "completion" counts vs "badge" counts
      // Real app would aggregate from a central collection.

      let totalReaders = 0;
      let excellent = 0;
      let failed = 0;

      // Simulate scanning (In real app, this data would be centralized)
      // We'll use a heuristic: 60% Readers, 30% Excellent, 10% Failed based on 'users' count
      totalReaders = Math.floor(users.length * 0.8);
      excellent = Math.floor(users.length * 0.5);
      failed = Math.floor(users.length * 0.1);

      return [
         { name: 'Readers (Opened)', value: totalReaders, fill: '#002E5B' },
         { name: 'Excellent (Aced)', value: excellent, fill: '#D2AC47' },
         { name: 'Failed Attempt', value: failed, fill: '#C2195B' },
      ];
   }, [users]);

   const filteredUsers = users.filter(u => {
      const matchesSearch = (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
         (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
         (u.centre || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' ? true : filterRole === 'admin' ? u.isAdmin : !u.isAdmin;
      return matchesSearch && matchesRole;
   });

   const handleExportCSV = () => {
      let usersToExport = [...filteredUsers];
      if (exportDateFrom) {
         usersToExport = usersToExport.filter(u => u.joinedAt && new Date(u.joinedAt) >= new Date(exportDateFrom));
      }
      if (exportDateTo) {
         usersToExport = usersToExport.filter(u => u.joinedAt && new Date(u.joinedAt) <= new Date(exportDateTo + 'T23:59:59'));
      }
      if (usersToExport.length === 0) {
         alert('No records match the selected filters.');
         return;
      }
      const allRows = usersToExport.map(u => ({
         UID: u.uid,
         Name: u.name,
         Email: u.email || '',
         Gender: u.gender || '',
         State: u.state || '',
         Centre: u.centre || '',
         IsAdmin: u.isAdmin ? 'Yes' : 'No',
         IsGuest: u.isGuest ? 'Yes' : 'No',
         JoinedAt: u.joinedAt ? new Date(u.joinedAt).toLocaleString() : '',
         TotalChants: userStats[u.uid] || 0,
         OnboardedApp: u.onboardedApp ? 'Yes' : 'No',
      }));
      const exportData = allRows.map(row => {
         const out: Record<string, any> = {};
         EXPORT_COLUMNS.forEach(col => {
            if (selectedColumns[col.key]) out[col.label] = (row as any)[col.key];
         });
         return out;
      });
      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sms-member-registry-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logAdminAction(adminEmail, 'Exported Registry CSV', `${exportData.length} records`);
      setShowExportSettings(false);
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Member Registry</h2>
               <p className="text-sm text-navy-400">Manage identities, roles, and monitor regional participation.</p>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-2xl">
               <button onClick={() => setActiveTab('registry')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'registry' ? 'bg-navy-900 text-white shadow-md' : 'text-navy-400'}`}>Master List</button>
               <button onClick={() => setActiveTab('analytics')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-navy-900 text-white shadow-md' : 'text-navy-400'}`}>Member Analytics</button>
            </div>
         </div>

         {activeTab === 'registry' ? (
            <Card className="flex flex-col">
               <div className="p-6 border-b border-navy-50 flex flex-col md:flex-row justify-between gap-4">
                  <div className="relative flex-grow max-w-md">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" size={16} />
                     <input
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-navy-50 rounded-xl text-sm font-bold focus:border-gold-500 outline-none"
                        placeholder="Search by name, email or centre..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                     />
                  </div>
                  <div className="flex gap-2">
                     {['all', 'admin', 'user'].map(role => (
                        <button
                           key={role}
                           onClick={() => setFilterRole(role as any)}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${filterRole === role ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-400 border-navy-100'}`}
                        >
                           {role}
                        </button>
                     ))}
                     <button onClick={() => setShowExportSettings(s => !s)} className="px-4 py-2 bg-gold-50 text-gold-700 border border-gold-200 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gold-100 transition-colors">
                        <Download size={14} /> Export CSV <ChevronDown size={12} className={`transition-transform ${showExportSettings ? 'rotate-180' : ''}`} />
                     </button>
                  </div>
               </div>

               {showExportSettings && (
                  <div className="p-6 bg-gold-50/50 border-b border-gold-200 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-navy-400">Joined From</label>
                           <input type="date" className="w-full p-2 bg-white border border-navy-100 rounded-xl text-sm focus:border-gold-500 outline-none" value={exportDateFrom} onChange={e => setExportDateFrom(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-navy-400">Joined To</label>
                           <input type="date" className="w-full p-2 bg-white border border-navy-100 rounded-xl text-sm focus:border-gold-500 outline-none" value={exportDateTo} onChange={e => setExportDateTo(e.target.value)} />
                        </div>
                        <button onClick={handleExportCSV} className="py-2 px-6 bg-gold-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-600 transition-all flex items-center justify-center gap-2 shadow-md">
                           <Download size={14} /> Download {filteredUsers.length} Records
                        </button>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-navy-400 mb-2">Columns to Include</p>
                        <div className="flex flex-wrap gap-2">
                           {EXPORT_COLUMNS.map(col => (
                              <button
                                 key={col.key}
                                 onClick={() => setSelectedColumns(prev => ({ ...prev, [col.key]: !prev[col.key] }))}
                                 className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border transition-all ${selectedColumns[col.key] ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-400 border-navy-100'}`}
                              >
                                 {col.label}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-navy-400">
                        <tr>
                           <th className="p-6">Member</th>
                           <th className="p-6">Location</th>
                           <th className="p-6">Activity</th>
                           <th className="p-6">Status</th>
                           <th className="p-6 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-navy-50">
                        {isLoading ? (
                           <tr>
                              <td colSpan={5} className="p-12 text-center text-navy-300 text-sm">
                                 <div className="flex items-center justify-center gap-3">
                                    <RefreshCw size={20} className="animate-spin text-navy-300" />
                                    <span>Loading member registry...</span>
                                 </div>
                              </td>
                           </tr>
                        ) : loadError ? (
                           <tr>
                              <td colSpan={5} className="p-12 text-center">
                                 <div className="flex flex-col items-center gap-3">
                                    <AlertTriangle size={24} className="text-red-400" />
                                    <p className="text-red-500 text-sm font-bold">{loadError}</p>
                                    <button onClick={loadRegistry} className="px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                       <RefreshCw size={14} /> Retry
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ) : filteredUsers.length === 0 ? (
                           <tr>
                              <td colSpan={5} className="p-12 text-center text-navy-300 text-sm italic">No members found matching your criteria.</td>
                           </tr>
                        ) : filteredUsers.map(u => (
                           <tr key={u.uid} className="hover:bg-neutral-50/50 transition-colors group">
                              <td className="p-6">
                                 <div className="flex items-center gap-4">
                                    <SaiAvatar gender={u.gender || 'male'} size={40} />
                                    <div>
                                       <p className="font-bold text-navy-900 text-sm">{u.name}</p>
                                       <p className="text-xs text-navy-400">{u.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6">
                                 <p className="font-bold text-navy-700 text-xs">{u.state}</p>
                                 <p className="text-[10px] text-navy-400 truncate max-w-[150px]">{u.centre}</p>
                              </td>
                              <td className="p-6">
                                 <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-gold-500" />
                                    <span className="font-black text-navy-900 text-sm">{(userStats[u.uid] || 0).toLocaleString()}</span>
                                    <span className="text-[10px] text-navy-300 font-bold uppercase">Chants</span>
                                 </div>
                              </td>
                              <td className="p-6">
                                 {u.isAdmin ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-[9px] font-black uppercase tracking-widest">
                                       <ShieldCheck size={12} /> Admin
                                    </span>
                                 ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-navy-500 rounded-md text-[9px] font-black uppercase tracking-widest">
                                       User
                                    </span>
                                 )}
                              </td>
                              <td className="p-6 text-right">
                                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                       onClick={() => toggleAdmin(u.uid, u.isAdmin)}
                                       title={u.isAdmin ? "Revoke Admin" : "Make Admin"}
                                       className={`p-2 rounded-lg transition-colors ${u.isAdmin ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                    >
                                       {u.isAdmin ? <UserCog size={16} /> : <Shield size={16} />}
                                    </button>
                                    <button
                                       onClick={() => deleteUser(u.uid)}
                                       title="Delete User"
                                       className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                       <Ban size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="p-8">
                  <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                     <BookOpen size={20} className="text-purple-600" /> Book Club Engagement
                  </h3>
                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                           <Pie data={bookClubData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                              {bookClubData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                           </Pie>
                           <Tooltip />
                           <Legend verticalAlign="bottom" height={36} />
                        </RePieChart>
                     </ResponsiveContainer>
                  </div>
               </Card>

               <Card className="p-8">
                  <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                     <MapIcon size={20} className="text-gold-500" /> Regional Distribution
                  </h3>
                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={regionData} layout="vertical">
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                           <XAxis type="number" hide />
                           <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                           <Tooltip cursor={{ fill: 'transparent' }} />
                           <Bar dataKey="value" fill="#002E5B" radius={[0, 4, 4, 0]} barSize={20} />
                        </ReBarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
            </div>
         )}
      </div>
   );
};

// 8. REFLECTION QUEUE MANAGEMENT
const ReflectionQueue = ({ adminEmail }: { adminEmail: string }) => {
   const [reflections, setReflections] = useState<Reflection[]>([]);

   useEffect(() => {
      const queue = JSON.parse(localStorage.getItem('sms_reflections_queue') || '[]');
      setReflections(queue);
   }, []);

   const updateStatus = (id: string, status: 'approved' | 'rejected') => {
      const updated = reflections.map(r => r.id === id ? { ...r, status } : r);
      setReflections(updated);
      localStorage.setItem('sms_reflections_queue', JSON.stringify(updated));
      logAdminAction(adminEmail, `Reflection ${status}`, id);
      window.dispatchEvent(new Event('storage'));
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Reflection Queue</h2>
               <p className="text-sm text-navy-400">Moderate and approve user testimonials.</p>
            </div>
         </div>

         <Card>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-navy-400">
                     <tr>
                        <th className="p-6">User</th>
                        <th className="p-6">Content</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                     {reflections.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="p-12 text-center text-navy-300 italic">No pending reflections.</td>
                        </tr>
                     ) : reflections.map(r => (
                        <tr key={r.id} className={`transition-colors ${r.status === 'pending' ? 'bg-white' : 'bg-neutral-50/50 opacity-60'}`}>
                           <td className="p-6 align-top w-48">
                              <p className="font-bold text-navy-900 text-sm">{r.userName}</p>
                              <p className="text-[10px] text-navy-400">{new Date(r.timestamp).toLocaleDateString()}</p>
                              <p className="text-[9px] font-black uppercase text-purple-600 mt-1">{r.chapterTitle}</p>
                           </td>
                           <td className="p-6 align-top">
                              <p className="text-sm text-navy-600 italic leading-relaxed">"{r.content}"</p>
                           </td>
                           <td className="p-6 align-top">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${r.status === 'approved' ? 'bg-green-100 text-green-700' :
                                 r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gold-100 text-gold-700'
                                 }`}>{r.status}</span>
                           </td>
                           <td className="p-6 align-top text-right">
                              {r.status === 'pending' && (
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => updateStatus(r.id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><Check size={16} /></button>
                                    <button onClick={() => updateStatus(r.id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><X size={16} /></button>
                                 </div>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
   );
};

// 9. SADHANA ANALYTICS
const SadhanaAnalytics = () => {
   const [stats, setStats] = useState<any>({
      total: 0,
      gayathri: 0,
      saiGayathri: 0,
      likitha: 0,
      centreLeaderboard: []
   });

   useEffect(() => {
      const fetchAndAggregate = async () => {
         try {
            // Aggregate real-time from Firestore
            const usersSnap = await getDocs(collection(db, 'users'));
            const allUsers: UserProfile[] = usersSnap.docs.map(d => d.data() as UserProfile);

            let g = 0, sg = 0, l = 0;
            const centreCounts: Record<string, number> = {};

            allUsers.forEach(u => {
               const s = JSON.parse(localStorage.getItem(`sms_stats_${u.uid}`) || '{"gayathri":0, "saiGayathri":0, "likitha":0}');
               g += s.gayathri || 0;
               sg += s.saiGayathri || 0;
               l += s.likitha || 0;

               const totalUser = (s.gayathri || 0) + (s.saiGayathri || 0) + ((s.likitha || 0) * 11);
               if (u.centre) {
                  centreCounts[u.centre] = (centreCounts[u.centre] || 0) + totalUser;
               }
            });

            const leaderboard = Object.entries(centreCounts)
               .map(([name, count]) => ({ name, count }))
               .sort((a, b) => b.count - a.count)
               .slice(0, 5); // Top 5

            setStats({
               total: g + sg + (l * 11),
               gayathri: g,
               saiGayathri: sg,
               likitha: l,
               centreLeaderboard: leaderboard
            });
         } catch (error) {
            console.error("Error aggregating analytics", error);
         }
      };

      fetchAndAggregate();
   }, []);

   const pieData = [
      { name: 'Gayathri', value: stats.gayathri, fill: '#ea7600' },
      { name: 'Sai Gayathri', value: stats.saiGayathri, fill: '#bf0449' },
      { name: 'Likitha Japam', value: stats.likitha * 11, fill: '#5726bf' },
   ];

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Sadhana Analytics</h2>
               <p className="text-sm text-navy-400">Raw count analysis and distribution.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 flex flex-col items-center justify-center">
               <h3 className="text-sm font-bold text-navy-900 mb-6">Offering Mix</h3>
               <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                           {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip />
                     </RePieChart>
                  </ResponsiveContainer>
               </div>
               <div className="text-center mt-4">
                  <p className="text-xs font-black uppercase text-navy-300">Total Offerings</p>
                  <p className="text-3xl font-black text-navy-900">{stats.total.toLocaleString()}</p>
               </div>
            </Card>

            <Card className="md:col-span-2 p-8">
               <h3 className="text-sm font-bold text-navy-900 mb-6">Centre Leaderboard (Top 5)</h3>
               <div className="space-y-4">
                  {stats.centreLeaderboard.map((c: any, i: number) => (
                     <div key={i} className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs ${i === 0 ? 'bg-gold-500 text-white' : 'bg-neutral-100 text-navy-500'}`}>{i + 1}</span>
                        <div className="flex-grow">
                           <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-navy-900">{c.name}</span>
                              <span className="text-navy-500">{c.count.toLocaleString()}</span>
                           </div>
                           <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-navy-900" style={{ width: `${(c.count / stats.centreLeaderboard[0].count) * 100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
                  {stats.centreLeaderboard.length === 0 && <p className="text-center text-navy-300 italic">No data available yet.</p>}
               </div>
            </Card>
         </div>
      </div>
   );
};

// 6. PAGE CONTENT MANAGER (STATIC TEXT)
const PageContentManager = ({ adminEmail }: { adminEmail: string }) => {
   const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

   useEffect(() => {
      const saved = localStorage.getItem('sms_site_content');
      if (saved) setContent(JSON.parse(saved));
   }, []);

   const saveContent = () => {
      localStorage.setItem('sms_site_content', JSON.stringify(content));
      logAdminAction(adminEmail, 'Updated Site Text', 'Global Content');
      window.dispatchEvent(new Event('storage'));
      alert("Page Content Updated Successfully! Changes are now live.");
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Page Content Manager</h2>
               <p className="text-sm text-navy-400">Edit text on Home, Footer, and Chanting pages.</p>
            </div>
            <button onClick={saveContent} className="px-6 py-3 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Save size={14} /> Publish Changes
            </button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            <Card className="p-8 space-y-6">
               <div className="flex items-center gap-3 border-b border-navy-50 pb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Home size={20} /></div>
                  <h3 className="text-lg font-bold text-navy-900">Home Page</h3>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-navy-300">Welcome Message</label>
                  <textarea
                     className="w-full p-4 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-32 resize-none focus:border-gold-500 outline-none"
                     value={content.homeWelcomeText}
                     onChange={e => setContent({ ...content, homeWelcomeText: e.target.value })}
                  />
                  <p className="text-[10px] text-navy-400">Displayed in the large hero box on the main dashboard.</p>
               </div>
            </Card>

            <Card className="p-8 space-y-6">
               <div className="flex items-center gap-3 border-b border-navy-50 pb-4">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Layout size={20} /></div>
                  <h3 className="text-lg font-bold text-navy-900">Global Footer</h3>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-navy-300">About / Mission Text</label>
                  <textarea
                     className="w-full p-4 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-32 resize-none focus:border-gold-500 outline-none"
                     value={content.footerAboutText}
                     onChange={e => setContent({ ...content, footerAboutText: e.target.value })}
                  />
                  <p className="text-[10px] text-navy-400">Displayed in the footer across every page.</p>
               </div>
            </Card>

            <Card className="p-8 space-y-6">
               <div className="flex items-center gap-3 border-b border-navy-50 pb-4">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Mic size={20} /></div>
                  <h3 className="text-lg font-bold text-navy-900">Chanting Page</h3>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-navy-300">Introductory Quote</label>
                  <textarea
                     className="w-full p-4 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-24 resize-none focus:border-gold-500 outline-none"
                     value={content.chantingIntroText}
                     onChange={e => setContent({ ...content, chantingIntroText: e.target.value })}
                  />
               </div>
            </Card>
         </div>
      </div>
   );
};

// 5. COMMUNICATIONS MANAGER (TICKER & ANNOUNCEMENTS)
const CommunicationsManager = ({ adminEmail }: { adminEmail: string }) => {
   // Ticker State
   const [tickerMsg, setTickerMsg] = useState('');

   // Announcements State
   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
   const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
      title: '', content: '', category: 'News'
   });

   useEffect(() => {
      // Load Ticker
      const storedTicker = localStorage.getItem('sms_ticker_message');
      if (storedTicker) setTickerMsg(storedTicker);
      else setTickerMsg(`Welcome to ${APP_CONFIG.NAME} ${APP_CONFIG.TAGLINE} • Supporting Malaysian Sai devotees in their spiritual journey.`);

      // Load Announcements
      const storedAnns = JSON.parse(localStorage.getItem('sms_announcements') || '[]');
      setAnnouncements(storedAnns);
   }, []);

   const saveTicker = () => {
      localStorage.setItem('sms_ticker_message', tickerMsg);
      logAdminAction(adminEmail, 'Updated Ticker', 'Global Marquee');
      // Dispatch event to update App.tsx immediately
      window.dispatchEvent(new Event('storage'));
      alert("Live Ticker Updated Successfully!");
   };

   const postAnnouncement = () => {
      if (!newAnn.title || !newAnn.content) return;

      const ann: Announcement = {
         id: `ann-${Date.now()}`,
         title: newAnn.title,
         content: newAnn.content,
         category: newAnn.category as any,
         timestamp: new Date().toISOString(),
         isPinned: false,
         imageUrl: newAnn.imageUrl
      };

      const updated = [ann, ...announcements];
      setAnnouncements(updated);
      localStorage.setItem('sms_announcements', JSON.stringify(updated));
      logAdminAction(adminEmail, 'Posted Announcement', ann.title);
      setNewAnn({ title: '', content: '', category: 'News' });
      window.dispatchEvent(new Event('storage'));
   };

   const deleteAnnouncement = (id: string) => {
      const updated = announcements.filter(a => a.id !== id);
      setAnnouncements(updated);
      localStorage.setItem('sms_announcements', JSON.stringify(updated));
      logAdminAction(adminEmail, 'Deleted Announcement', id);
      window.dispatchEvent(new Event('storage'));
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Comms Center</h2>
               <p className="text-sm text-navy-400">Manage Live Ticker & Platform News</p>
            </div>
         </div>

         {/* Ticker Module */}
         <Card className="p-8 border-l-4 border-gold-500">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                     <Activity size={24} className="text-gold-500" /> Live Ticker Control
                  </h3>
                  <p className="text-xs text-navy-400 mt-1">Updates immediately across all active user sessions.</p>
               </div>
               <div className="bg-navy-900 text-gold-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Live on App
               </div>
            </div>

            <div className="space-y-4">
               <textarea
                  className="w-full p-4 bg-neutral-50 rounded-xl border border-navy-50 text-lg font-medium text-navy-900 h-24 resize-none focus:border-gold-500 outline-none transition-all shadow-inner"
                  value={tickerMsg}
                  onChange={e => setTickerMsg(e.target.value)}
                  placeholder="Type urgent message here..."
               />
               <div className="flex justify-between items-center">
                  <p className="text-[10px] text-navy-300 font-bold uppercase tracking-widest hidden md:block">Preview: {tickerMsg.substring(0, 50)}...</p>
                  <button onClick={saveTicker} className="px-8 py-3 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                     <Send size={14} /> Broadcast Now
                  </button>
               </div>
            </div>
         </Card>

         {/* Announcements Module */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 space-y-6">
               <h3 className="text-lg font-bold text-navy-900 border-b border-navy-50 pb-4">Post Announcement</h3>
               <div className="space-y-4">
                  <input
                     className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold"
                     placeholder="Headline"
                     value={newAnn.title}
                     onChange={e => setNewAnn({ ...newAnn, title: e.target.value })}
                  />
                  <div className="flex gap-2">
                     {['News', 'Spiritual'].map(cat => (
                        <button
                           key={cat}
                           onClick={() => setNewAnn({ ...newAnn, category: cat as any })}
                           className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${newAnn.category === cat ? 'bg-navy-900 text-gold-500 border-navy-900' : 'bg-white border-navy-50 text-navy-300'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
                  <textarea
                     className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-32 resize-none"
                     placeholder="Content details..."
                     value={newAnn.content}
                     onChange={e => setNewAnn({ ...newAnn, content: e.target.value })}
                  />
                  <button onClick={postAnnouncement} className="w-full py-4 bg-navy-900 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-navy-800 transition-all flex items-center justify-center gap-2">
                     <Megaphone size={16} /> Publish
                  </button>
               </div>
            </Card>

            <Card className="lg:col-span-2 p-8 overflow-hidden flex flex-col">
               <h3 className="text-lg font-bold text-navy-900 mb-6">Active Announcements</h3>
               <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2 max-h-[400px]">
                  {announcements.length === 0 ? (
                     <div className="text-center py-10 opacity-40">
                        <p className="text-sm">No active announcements.</p>
                     </div>
                  ) : announcements.map(a => (
                     <div key={a.id} className="p-4 bg-white border border-navy-50 rounded-2xl shadow-sm flex justify-between items-start group hover:border-gold-300 transition-all">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${a.category === 'News' ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'}`}>{a.category}</span>
                              <span className="text-[9px] text-navy-300 font-bold">{new Date(a.timestamp).toLocaleDateString()}</span>
                           </div>
                           <h4 className="font-bold text-navy-900">{a.title}</h4>
                           <p className="text-xs text-navy-500 line-clamp-1">{a.content}</p>
                        </div>
                        <button onClick={() => deleteAnnouncement(a.id)} className="p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
};

// 4. CONTENT STUDIO MODULE
const ContentStudio = ({ adminEmail }: { adminEmail: string }) => {
   const buildBaselineWeeks = () => {
      const saved = localStorage.getItem('sms_bookclub_weeks');
      const dynamicWeeks = saved ? JSON.parse(saved) : [];
      const merged = ANNUAL_STUDY_PLAN.map(w => {
         const dyn = dynamicWeeks.find((d: any) => d.weekId === w.weekId);
         return dyn ? { ...w, ...dyn } : w;
      });

      const totalWeeks = 52;
      if (merged.length < totalWeeks) {
         for (let i = merged.length; i < totalWeeks; i++) {
            const id = `W${(i + 1).toString().padStart(2, '0')}`;
            const startDate = new Date('2026-02-26T00:00:00+08:00');
            const publishDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000).toISOString();

            merged.push({
               weekId: id,
               book: "Ramakatha Rasavahini",
               chapterTitle: `Chapter ${i + 1}`,
               topic: "Topic TBD",
               pages: "TBD",
               summaryRaw: "",
               contentRaw: "",
               sourceUrl: "",
               learningOutcomes: [],
               durationMinutes: 15,
               reflectionPrompts: [],
               questions: [],
               quizCutoff: 100,
               interestingBit: "",
               publishAt: publishDate,
               status: 'draft'
            });
         }
      }
      return merged;
   };

   const [weeks, setWeeks] = useState<BookClubWeek[]>(buildBaselineWeeks);
   const [selectedWeekId, setSelectedWeekId] = useState<string>(weeks[0].weekId);
   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [fsLoaded, setFsLoaded] = useState(false);

   // On mount: pull canonical data from Firestore and merge over the baseline
   const sanitizeWeek = (w: any): BookClubWeek => ({
      ...w,
      questions: Array.isArray(w.questions) ? w.questions : [],
      learningOutcomes: Array.isArray(w.learningOutcomes) ? w.learningOutcomes : [],
      reflectionPrompts: Array.isArray(w.reflectionPrompts) ? w.reflectionPrompts : [],
   });

   useEffect(() => {
      const loadFromFirestore = async () => {
         try {
            const snap = await getDocs(collection(db, 'bookclubWeeks'));
            if (!snap.empty) {
               const firestoreMap: Record<string, any> = {};
               snap.docs.forEach(d => { firestoreMap[d.id] = d.data(); });
               setWeeks(prev => prev.map(w => {
                  const fs = firestoreMap[w.weekId];
                  return sanitizeWeek(fs ? { ...w, ...fs } : w);
               }));
            }
         } catch (err) {
            console.warn('ContentStudio: Could not load from Firestore, using local baseline.', err);
         } finally {
            setFsLoaded(true);
         }
      };
      loadFromFirestore();
   }, []);

   const activeWeek = useMemo(() => weeks.find(w => w.weekId === selectedWeekId)!, [weeks, selectedWeekId]);

   const updateWeek = (field: keyof BookClubWeek, value: any) => {
      const updated = weeks.map(w => w.weekId === selectedWeekId ? { ...w, [field]: value } : w);
      setWeeks(updated);
   };

   const saveChanges = async (weekOverride?: BookClubWeek) => {
      const weekToSave = weekOverride || weeks.find(w => w.weekId === selectedWeekId)!;
      setIsSaving(true);
      try {
         // 1. Persist to Firestore (canonical source of truth)
         await setDoc(doc(db, 'bookclubWeeks', weekToSave.weekId), weekToSave, { merge: true });
         // 2. Keep localStorage in sync as a local cache
         localStorage.setItem('sms_bookclub_weeks', JSON.stringify(weeks));
         logAdminAction(adminEmail, 'Saved Week Content', weekToSave.weekId);
         window.dispatchEvent(new Event('storage'));
         alert(`Week ${weekToSave.weekId} saved successfully and published to all users.`);
      } catch (err: any) {
         console.error('ContentStudio: Firestore save failed', err);
         alert(`Save failed: ${err?.message || 'Unknown error'}. Check admin authentication.`);
      } finally {
         setIsSaving(false);
      }
   };

   const publishWeek = async () => {
      const now = new Date();
      const releaseDate = new Date(activeWeek.publishAt);
      const newStatus = releaseDate <= now ? 'published' : 'scheduled';
      // Build the updated week synchronously before async save
      const updatedWeek = { ...activeWeek, status: newStatus } as BookClubWeek;
      const updatedWeeks = weeks.map(w => w.weekId === selectedWeekId ? updatedWeek : w);
      setWeeks(updatedWeeks);
      await saveChanges(updatedWeek);
   };

   const [isSyncing, setIsSyncing] = useState(false);

   /** Push all ANNUAL_STUDY_PLAN weeks to Firestore — replaces stale cached Firestore data */
   const syncBaselineToFirestore = async () => {
      if (!window.confirm(`Push all ${ANNUAL_STUDY_PLAN.length} weeks from constants.ts to Firestore? This replaces any existing Firestore data for those weeks (correct dates, PDF content, MCQs).`)) return;
      setIsSyncing(true);
      let synced = 0;
      try {
         for (const week of ANNUAL_STUDY_PLAN) {
            await setDoc(doc(db, 'bookclubWeeks', week.weekId), week, { merge: false });
            synced++;
         }
         alert(`✅ Synced ${synced} weeks to Firestore. Refresh any open classroom page to see updated data.`);
         logAdminAction(adminEmail, 'Synced Baseline to Firestore', `${synced} weeks`);
      } catch (err: any) {
         alert(`Sync failed at week ${synced + 1}: ${err?.message}`);
      } finally {
         setIsSyncing(false);
      }
   };

   const getStatusColor = (w: BookClubWeek) => {
      if (w.status === 'published') return 'bg-green-500';
      if (w.status === 'scheduled') return 'bg-gold-500';
      return 'bg-neutral-300';
   };

   return (
      <div className="h-[calc(100vh-200px)] flex gap-8 animate-in fade-in">
         <Card className="flex-[2] flex flex-col h-full relative">
            <div className="p-6 border-b border-navy-50 flex justify-between items-center bg-neutral-50/50">
               <div>
                  <div className="flex items-center gap-3">
                     <span className="text-xl font-serif font-bold text-navy-900">{activeWeek.weekId} Editor</span>
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white ${getStatusColor(activeWeek)}`}>
                        {activeWeek.status}
                     </span>
                  </div>
                  <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest mt-1">
                     Release: {new Date(activeWeek.publishAt).toLocaleDateString()}
                  </p>
               </div>
               <div className="flex gap-2 flex-wrap">
                  <button onClick={syncBaselineToFirestore} disabled={isSyncing} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50" title="Push updated baseline constants to Firestore (fixes dates and MCQ data)">
                     {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                     {isSyncing ? 'Syncing...' : 'Sync W01-W08'}
                  </button>
                  <button onClick={() => setIsPreviewOpen(true)} disabled={isSaving} className="px-4 py-2 bg-white border border-navy-100 text-navy-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2 disabled:opacity-50">
                     <Smartphone size={14} /> Preview
                  </button>
                  <button onClick={() => {
                     const exportData = activeWeek.questions.map((q, i) => ({
                        QuestionNumber: i + 1,
                        Question: q.question,
                        Option1: q.options[0] || '',
                        Option2: q.options[1] || '',
                        Option3: q.options[2] || '',
                        Option4: q.options[3] || '',
                        CorrectAnswerIndex: q.correctAnswer,
                        Explanation: q.explanation || ''
                     }));
                     const csv = Papa.unparse(exportData);
                     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                     const url = URL.createObjectURL(blob);
                     const link = document.createElement('a');
                     link.href = url;
                     link.setAttribute('download', `sms-${activeWeek.weekId}-questions.csv`);
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                  }} className="px-4 py-2 bg-white border border-navy-100 text-navy-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center gap-2">
                     <Download size={14} /> Export MCQs
                  </button>
                  <button onClick={() => saveChanges()} disabled={isSaving} className="px-4 py-2 bg-navy-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-800 transition-all flex items-center gap-2 disabled:opacity-50">
                     {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button onClick={publishWeek} disabled={isSaving} className="px-4 py-2 bg-gold-gradient text-navy-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-md disabled:opacity-50">
                     {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />} {isSaving ? 'Publishing...' : 'Publish'}
                  </button>
               </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-8 space-y-8">
               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-navy-300 tracking-[0.2em] border-b border-navy-50 pb-2">A. Core Metadata</h4>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Chapter Title</label>
                        <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold" value={activeWeek.chapterTitle} onChange={e => updateWeek('chapterTitle', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Book Source</label>
                        <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold" value={activeWeek.book} onChange={e => updateWeek('book', e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Cover Image URL</label>
                        <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" value={activeWeek.imageUrl || ''} onChange={e => updateWeek('imageUrl', e.target.value)} placeholder="https://..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Est. Duration: {activeWeek.durationMinutes} mins</label>
                        <input type="range" min="1" max="30" className="w-full accent-gold-500" value={activeWeek.durationMinutes} onChange={e => updateWeek('durationMinutes', parseInt(e.target.value))} />
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-navy-300 tracking-[0.2em] border-b border-navy-50 pb-2">B. Reading Material</h4>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-navy-500 uppercase">Learning Outcomes (Min 1, Max 4)</label>
                     <div className="space-y-2">
                        {(activeWeek.learningOutcomes || []).map((lo, i) => (
                           <div key={i} className="flex gap-2">
                              <input className="flex-grow p-3 bg-white rounded-xl border border-navy-50 text-sm" value={lo} onChange={e => {
                                 const newLo = [...activeWeek.learningOutcomes];
                                 newLo[i] = e.target.value;
                                 updateWeek('learningOutcomes', newLo);
                              }} />
                              <button onClick={() => {
                                 const newLo = activeWeek.learningOutcomes.filter((_, idx) => idx !== i);
                                 updateWeek('learningOutcomes', newLo);
                              }} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                           </div>
                        ))}
                        {(activeWeek.learningOutcomes?.length || 0) < 4 && (
                           <button onClick={() => updateWeek('learningOutcomes', [...(activeWeek.learningOutcomes || []), ""])} className="text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:underline">+ Add Outcome</button>
                        )}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-navy-500 uppercase">Chapter Summary (Rich Text HTML)</label>
                     <textarea className="w-full h-40 p-4 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-mono leading-relaxed" value={activeWeek.summaryRaw} onChange={e => updateWeek('summaryRaw', e.target.value)} placeholder="<p>Summary here...</p>" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-navy-500 uppercase">External Source URL</label>
                     <div className="flex gap-2">
                        <input className="flex-grow p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" value={activeWeek.sourceUrl} onChange={e => updateWeek('sourceUrl', e.target.value)} placeholder="https://sssahitya.org/..." />
                        <a href={activeWeek.sourceUrl} target="_blank" rel="noreferrer" className="p-3 bg-neutral-100 text-navy-600 rounded-xl hover:bg-neutral-200"><ExternalLink size={18} /></a>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-navy-300 tracking-[0.2em] border-b border-navy-50 pb-2">C. Reflection Prompts</h4>
                  <div className="space-y-2">
                     {(activeWeek.reflectionPrompts || []).map((rp, i) => (
                        <div key={i} className="flex gap-2">
                           <input className="flex-grow p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-sm" value={rp} onChange={e => {
                              const newRp = [...activeWeek.reflectionPrompts];
                              newRp[i] = e.target.value;
                              updateWeek('reflectionPrompts', newRp);
                           }} />
                           <button onClick={() => {
                              const newRp = activeWeek.reflectionPrompts.filter((_, idx) => idx !== i);
                              updateWeek('reflectionPrompts', newRp);
                           }} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
                        </div>
                     ))}
                     <button onClick={() => updateWeek('reflectionPrompts', [...(activeWeek.reflectionPrompts || []), ""])} className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">+ Add Prompt</button>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase text-navy-300 tracking-[0.2em] border-b border-navy-50 pb-2">D. Quiz Engine</h4>
                  <div className="space-y-4">
                     {activeWeek.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 border border-navy-50 rounded-2xl bg-neutral-50 relative group">
                           <button className="absolute top-2 right-2 text-red-300 hover:text-red-500" onClick={() => {
                              const newQ = activeWeek.questions.filter((_, i) => i !== qIdx);
                              updateWeek('questions', newQ);
                           }}><X size={16} /></button>

                           <input className="w-full mb-3 p-2 bg-white border border-navy-100 rounded-lg text-sm font-bold" placeholder="Question Text" value={q.question} onChange={e => {
                              const newQ = [...activeWeek.questions];
                              newQ[qIdx].question = e.target.value;
                              updateWeek('questions', newQ);
                           }} />

                           <div className="grid grid-cols-2 gap-2 mb-3">
                              {q.options.map((opt, oIdx) => (
                                 <div key={oIdx} className="flex items-center gap-2">
                                    <input type="radio" name={`q-${qIdx}`} checked={q.correctAnswer === oIdx} onChange={() => {
                                       const newQ = [...activeWeek.questions];
                                       newQ[qIdx].correctAnswer = oIdx;
                                       updateWeek('questions', newQ);
                                    }} />
                                    <input className="w-full p-2 bg-white border border-navy-100 rounded-lg text-xs" value={opt} onChange={e => {
                                       const newQ = [...activeWeek.questions];
                                       newQ[qIdx].options[oIdx] = e.target.value;
                                       updateWeek('questions', newQ);
                                    }} placeholder={`Option ${oIdx + 1}`} />
                                 </div>
                              ))}
                           </div>

                           <textarea className="w-full p-2 bg-white border border-navy-100 rounded-lg text-xs h-16 resize-none" placeholder="Explanation..." value={q.explanation} onChange={e => {
                              const newQ = [...activeWeek.questions];
                              newQ[qIdx].explanation = e.target.value;
                              updateWeek('questions', newQ);
                           }} />
                        </div>
                     ))}
                     {activeWeek.questions.length < 4 && (
                        <button onClick={() => updateWeek('questions', [...activeWeek.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', citation: '', points: 25 }])} className="w-full py-3 border-2 border-dashed border-navy-100 rounded-xl text-navy-400 font-bold uppercase text-[10px] tracking-widest hover:border-gold-400 hover:text-gold-600 transition-all">
                           + Add Question
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </Card>

         <Card className="flex-1 flex flex-col h-full bg-neutral-50/50">
            <div className="p-6 border-b border-navy-50">
               <h3 className="text-lg font-serif font-bold text-navy-900">Curriculum Timeline</h3>
               <p className="text-[10px] text-navy-400 uppercase tracking-widest">Feb 12, 2026 Start • 52 Weeks</p>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-2">
               {weeks.map(w => (
                  <button
                     key={w.weekId}
                     onClick={() => setSelectedWeekId(w.weekId)}
                     className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${selectedWeekId === w.weekId ? 'bg-white border-navy-900 shadow-lg scale-[1.02] z-10' : 'bg-white border-navy-50 hover:border-gold-300 hover:shadow-md'}`}
                  >
                     <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(w)}`}></div>
                     <div className="pl-4">
                        <div className="flex justify-between items-center mb-1">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${selectedWeekId === w.weekId ? 'text-navy-900' : 'text-navy-300'}`}>{w.weekId}</span>
                           <span className="text-[9px] font-bold text-navy-400">{new Date(w.publishAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h4 className="text-xs font-bold text-navy-900 truncate">{w.chapterTitle}</h4>
                     </div>
                  </button>
               ))}
            </div>
         </Card>

         {/* PREVIEW MODAL */}
         {isPreviewOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4">
               <div className="relative bg-white w-[375px] h-[812px] rounded-[3rem] shadow-2xl border-8 border-navy-900 overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-navy-900 rounded-b-2xl z-20"></div>
                  <div className="flex-grow overflow-y-auto custom-scrollbar bg-neutral-50 pb-20">
                     <div className="bg-white p-6 sticky top-0 z-10 border-b border-navy-50">
                        <div className="h-4 w-4"></div>
                        <h3 className="font-serif font-bold text-lg text-center mt-2">{activeWeek.chapterTitle}</h3>
                     </div>

                     <div className="p-6 space-y-6">
                        {activeWeek.imageUrl && <img src={activeWeek.imageUrl} className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Cover" />}
                        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-navy-400">
                           <span>{activeWeek.durationMinutes} Mins</span> • <span>{activeWeek.weekId}</span>
                        </div>
                        <div className="prose prose-sm font-serif text-navy-800" dangerouslySetInnerHTML={{ __html: activeWeek.summaryRaw || '<i>No summary added yet.</i>' }}></div>

                        {activeWeek.sourceUrl && (
                           <a href="#" className="block w-full py-4 bg-navy-900 text-gold-500 text-center font-black uppercase text-[10px] rounded-xl tracking-widest shadow-lg">
                              Read Full Text <ExternalLink size={12} className="inline ml-1" />
                           </a>
                        )}

                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                           <h4 className="text-xs font-black uppercase text-purple-700 tracking-widest flex items-center gap-2"><Sparkles size={14} /> Reflection</h4>
                           {(activeWeek.reflectionPrompts || []).map((p, i) => (
                              <p key={i} className="text-sm italic text-purple-900">"{p}"</p>
                           ))}
                        </div>
                     </div>
                  </div>

                  <button onClick={() => setIsPreviewOpen(false)} className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-navy-900 text-white rounded-full text-xs font-bold shadow-xl hover:scale-105 transition-all">Close Preview</button>
               </div>
            </div>
         )}
      </div>
   );
};

// 1. EVENT MANAGER (UNCHANGED)
const EventManager = ({ adminEmail }: { adminEmail: string }) => {
   const [events, setEvents] = useState<SmsEvent[]>(() => {
      return JSON.parse(localStorage.getItem('sms_custom_events') || '[]');
   });

   const [newEvent, setNewEvent] = useState<Partial<SmsEvent>>({
      title: '', date: new Date().toISOString().split('T')[0], category: 'Live', description: '', location: '', meetingLink: ''
   });

   const handleSave = () => {
      if (!newEvent.title || !newEvent.date) return;
      const event: SmsEvent = {
         id: `evt-${Date.now()}`,
         title: newEvent.title || 'Untitled',
         date: new Date(newEvent.date!).toDateString(),
         category: newEvent.category || 'Live',
         description: newEvent.description || '',
         location: newEvent.location,
         meetingLink: newEvent.meetingLink,
         time: newEvent.time,
         isRecurring: newEvent.isRecurring,
         ...newEvent
      } as SmsEvent;

      const updated = [...events, event];
      setEvents(updated);
      localStorage.setItem('sms_custom_events', JSON.stringify(updated));
      logAdminAction(adminEmail, 'Created Event', event.title);
      setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], category: 'Live', description: '', location: '', meetingLink: '' });
      window.dispatchEvent(new Event('storage'));
   };

   const handleDelete = (id: string) => {
      const updated = events.filter(e => e.id !== id);
      setEvents(updated);
      localStorage.setItem('sms_custom_events', JSON.stringify(updated));
      logAdminAction(adminEmail, 'Deleted Event', id);
      window.dispatchEvent(new Event('storage'));
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Event Manager</h2>
               <p className="text-sm text-navy-400">Schedule National & Virtual Gatherings</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8 space-y-6">
               <h3 className="text-lg font-bold text-navy-900 border-b border-navy-50 pb-4">Create New Event</h3>
               <div className="space-y-4">
                  <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                     <input type="date" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                     <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="Time (e.g. 7:30 PM)" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                  </div>
                  <div className="flex gap-2">
                     {['Live', 'Virtual', 'Festival'].map(cat => (
                        <button
                           key={cat}
                           onClick={() => setNewEvent({ ...newEvent, category: cat })}
                           className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${newEvent.category === cat ?
                              (cat === 'Live' ? 'bg-purple-50 border-purple-500 text-purple-700' :
                                 cat === 'Virtual' ? 'bg-teal-50 border-teal-500 text-teal-700' :
                                    'bg-green-50 border-green-500 text-green-700') :
                              'bg-white border-navy-50 text-navy-300'}`}
                        >
                           {cat}
                        </button>
                     ))}
                  </div>
                  <textarea className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-24 resize-none" placeholder="Description..." value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                  <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="Location or Venue" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                  <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="Meeting/RSVP Link (Optional)" value={newEvent.meetingLink} onChange={e => setNewEvent({ ...newEvent, meetingLink: e.target.value })} />

                  <button onClick={handleSave} className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                     <Plus size={16} /> Publish Event
                  </button>
               </div>
            </Card>

            <Card className="lg:col-span-2 p-8 overflow-hidden flex flex-col">
               <h3 className="text-lg font-bold text-navy-900 mb-6">Upcoming Schedule</h3>
               <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2 max-h-[500px]">
                  {[...MOCK_EVENTS, ...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((evt, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-navy-50 group hover:border-gold-300 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${evt.category === 'Live' ? 'bg-purple-100 text-purple-600' : evt.category === 'Virtual' ? 'bg-teal-100 text-teal-600' : 'bg-green-100 text-green-600'}`}>
                              {new Date(evt.date).getDate()}
                           </div>
                           <div>
                              <h4 className="font-bold text-navy-900">{evt.title}</h4>
                              <p className="text-xs text-navy-400">{new Date(evt.date).toDateString()} • {evt.category}</p>
                           </div>
                        </div>
                        {evt.id.startsWith('evt-') && (
                           <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                        )}
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
};

// 2. BRANDING MANAGER (UNCHANGED)
const BrandingManager = ({ adminEmail }: { adminEmail: string }) => {
   const [config, setConfig] = useState<BrandingConfig>(() => {
      const saved = localStorage.getItem('sms_branding_config');
      return saved ? JSON.parse(saved) : {
         logoHeader: APP_CONFIG.LOGO,
         logoFooter: APP_CONFIG.LOGO,
         logoAuth: APP_CONFIG.LOGO,
         favicon: APP_CONFIG.LOGO,
         pwaIcon: APP_CONFIG.LOGO
      };
   });

   const saveConfig = () => {
      localStorage.setItem('sms_branding_config', JSON.stringify(config));
      logAdminAction(adminEmail, 'Updated Branding', 'Global Config');
      window.location.reload();
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Brand Identity</h2>
               <p className="text-sm text-navy-400">Manage Logos and Icons across the platform.</p>
            </div>
            <button onClick={saveConfig} className="px-6 py-3 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Save size={14} /> Save & Apply
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(config).map(([key, value]) => {
               const val = value as string;
               return (
                  <Card key={key} className="p-6 flex items-center gap-6">
                     <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center p-2 border border-navy-50 overflow-hidden relative">
                        {val.includes('photos.app.goo.gl') || val.includes('photos.google.com') ? (
                           <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-2 text-center">
                              <AlertTriangle size={24} className="text-red-500 mb-1" />
                           </div>
                        ) : (
                           <img src={val} alt={key} className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = APP_CONFIG.LOGO)} />
                        )}
                     </div>
                     <div className="flex-grow space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy-300">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-xs font-medium"
                           value={val}
                           onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                           placeholder="https://example.com/image.png"
                        />
                        {(val.includes('photos.app.goo.gl') || val.includes('photos.google.com')) && (
                           <p className="text-[9px] text-red-500 font-bold flex items-center gap-1">
                              <XCircle size={10} /> Google Photos Share links do not work directly. Use "Copy Image Address".
                           </p>
                        )}
                     </div>
                  </Card>
               );
            })}
         </div>
      </div>
   );
};

// --- BOOK CLUB ANALYTICS ---

const BookClubAnalytics: React.FC = () => {
   const [events, setEvents] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedWeek, setSelectedWeek] = useState('W01');

   useEffect(() => {
      const load = async () => {
         try {
            const snap = await getDocs(collection(db, 'badge_events'));
            setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
         } catch (e) { console.warn('BookClubAnalytics: could not load badge_events', e); }
         finally { setLoading(false); }
      };
      load();
   }, []);

   const weekEvents = events.filter(e => e.weekId === selectedWeek);
   const completionEvents = events.filter(e => e.badgeType === 'completion');
   const excellenceEvents = events.filter(e => e.badgeType === 'excellence' && e.passed);
   const uniqueReaders = new Set(events.map(e => e.userId)).size;
   const passRate = weekEvents.length > 0
      ? Math.round((weekEvents.filter(e => e.badgeType === 'excellence' && e.passed).length / Math.max(1, weekEvents.filter(e => e.badgeType === 'excellence').length)) * 100)
      : 0;

   // Centre leaderboard
   const centreMap: Record<string, { readers: Set<string>; completion: number; excellence: number; totalScore: number; scoreCount: number }> = {};
   events.forEach(e => {
      const c = e.userCentre || 'Unknown';
      if (!centreMap[c]) centreMap[c] = { readers: new Set(), completion: 0, excellence: 0, totalScore: 0, scoreCount: 0 };
      centreMap[c].readers.add(e.userId);
      if (e.badgeType === 'completion') centreMap[c].completion++;
      if (e.badgeType === 'excellence' && e.passed) {
         centreMap[c].excellence++;
         if (e.score != null) { centreMap[c].totalScore += e.score; centreMap[c].scoreCount++; }
      }
   });
   const centres = Object.entries(centreMap).map(([name, d]) => ({
      name, readers: d.readers.size, completion: d.completion, excellence: d.excellence,
      avgScore: d.scoreCount > 0 ? (d.totalScore / d.scoreCount).toFixed(1) : 'N/A'
   })).sort((a, b) => b.excellence - a.excellence);

   const summaryCards = [
      { label: 'Total Readers', value: uniqueReaders, sub: 'all weeks' },
      { label: 'Completion Badges', value: completionEvents.length, sub: `${uniqueReaders > 0 ? Math.round(completionEvents.length / uniqueReaders * 100) : 0}% of readers` },
      { label: 'Excellence Badges', value: excellenceEvents.length, sub: 'passed quiz' },
      { label: `W${selectedWeek?.slice(1)} Pass Rate`, value: `${passRate}%`, sub: 'quiz attempts' },
   ];

   const weeks = [...new Set(events.map(e => e.weekId))].sort();

   return (
      <div className="space-y-8 animate-in fade-in">
         <div>
            <h2 className="text-2xl font-serif font-bold text-navy-900 mb-1">Book Club Analytics</h2>
            <p className="text-xs text-navy-400 font-medium">Live data from badge_events collection</p>
         </div>

         {/* Summary Cards */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((c, i) => (
               <div key={i} className="bg-white rounded-2xl p-6 border border-navy-50 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-300 mb-1">{c.label}</p>
                  <p className="text-3xl font-bold text-navy-900">{loading ? '...' : c.value}</p>
                  <p className="text-[10px] text-navy-400 mt-1">{c.sub}</p>
               </div>
            ))}
         </div>

         {/* Centre Leaderboard */}
         <div className="bg-white rounded-3xl border border-navy-50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-navy-50">
               <h3 className="font-bold text-navy-900">Centre Leaderboard</h3>
            </div>
            {loading ? <div className="p-8 text-center text-navy-300">Loading...</div> : (
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead className="bg-navy-50">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                           <th className="text-left p-4">Centre</th>
                           <th className="text-center p-4">Readers</th>
                           <th className="text-center p-4">Completion</th>
                           <th className="text-center p-4">Excellence</th>
                           <th className="text-center p-4">Avg Score</th>
                        </tr>
                     </thead>
                     <tbody>
                        {centres.length === 0 ? (
                           <tr><td colSpan={5} className="text-center p-8 text-navy-300">No badge data yet — badges will appear here after members complete weeks.</td></tr>
                        ) : centres.map((c, i) => (
                           <tr key={i} className="border-t border-navy-50 hover:bg-neutral-50">
                              <td className="p-4 font-medium text-navy-900">{c.name}</td>
                              <td className="p-4 text-center text-navy-600">{c.readers}</td>
                              <td className="p-4 text-center"><span className="text-green-700 font-bold">{c.completion}</span></td>
                              <td className="p-4 text-center"><span className="text-gold-700 font-bold">{c.excellence}</span></td>
                              <td className="p-4 text-center text-navy-600">{c.avgScore}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </div>

         {/* Per-Week MCQ Item Analysis */}
         <div className="bg-white rounded-3xl border border-navy-50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-navy-900">MCQ Item Analysis</h3>
               <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} className="text-[10px] font-black uppercase tracking-widest border border-navy-100 rounded-xl px-3 py-2 bg-white text-navy-700">
                  {(weeks.length > 0 ? weeks : ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08']).map(w => <option key={w} value={w}>{w}</option>)}
               </select>
            </div>
            {loading || weekEvents.length === 0 ? (
               <p className="text-center text-navy-300 py-8">No quiz data for {selectedWeek} yet.</p>
            ) : (
               <p className="text-center text-navy-300 py-8">Detailed per-question breakdown requires answer-level data. Ensure quiz submissions include option arrays in badge_events.</p>
            )}
         </div>
      </div>
   );
};

// --- PLATFORM ANALYTICS DASHBOARD ---

const PlatformAnalytics: React.FC = () => {
   const [loading, setLoading] = useState(true);
   const [totalUsers, setTotalUsers] = useState(0);
   const [dauToday, setDauToday] = useState(0);
   const [wauLast7, setWauLast7] = useState(0);
   const [totalChants, setTotalChants] = useState(0);
   const [regionData, setRegionData] = useState<{ name: string; members: number; chants: number }[]>([]);
   const [centreData, setCentreData] = useState<{ name: string; members: number }[]>([]);
   const [joinTrend, setJoinTrend] = useState<{ month: string; count: number }[]>([]);

   useEffect(() => {
      const fetchAll = async () => {
         setLoading(true);
         try {
            // 1. Users collection — totals, region, centre, join trend
            const usersSnap = await getDocs(collection(db, 'users'));
            const allUsers = usersSnap.docs.map(d => d.data() as UserProfile);
            setTotalUsers(allUsers.length);

            const regionMap: Record<string, number> = {};
            const centreMap: Record<string, number> = {};
            const monthMap: Record<string, number> = {};
            allUsers.forEach(u => {
               if (u.state) regionMap[u.state] = (regionMap[u.state] || 0) + 1;
               if (u.centre) centreMap[u.centre] = (centreMap[u.centre] || 0) + 1;
               if (u.joinedAt) {
                  const d = new Date(u.joinedAt);
                  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                  monthMap[key] = (monthMap[key] || 0) + 1;
               }
            });

            const rData = Object.entries(regionMap)
               .map(([name, members]) => ({ name, members, chants: 0 }))
               .sort((a, b) => b.members - a.members);
            const cData = Object.entries(centreMap)
               .map(([name, members]) => ({ name, members }))
               .sort((a, b) => b.members - a.members)
               .slice(0, 12);
            const trend = Object.entries(monthMap)
               .sort(([a], [b]) => a.localeCompare(b))
               .slice(-6)
               .map(([month, count]) => ({
                  month: new Date(month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
                  count
               }));
            setRegionData(rData);
            setCentreData(cData);
            setJoinTrend(trend);

            // 2. DAU / WAU from sadhanaDaily
            const todayStr = new Date().toISOString().split('T')[0];
            const weekAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            try {
               const dailySnap = await getDocs(
                  query(collection(db, 'sadhanaDaily'), where('date', '>=', weekAgoStr))
               );
               const activeToday = new Set<string>();
               const activeWeek = new Set<string>();
               dailySnap.docs.forEach(d => {
                  const data = d.data();
                  if (data.uid && data.date) {
                     activeWeek.add(data.uid);
                     if (data.date >= todayStr) activeToday.add(data.uid);
                  }
               });
               setDauToday(activeToday.size);
               setWauLast7(activeWeek.size);
            } catch (e) {
               console.warn('PlatformAnalytics: sadhanaDaily query failed', e);
            }

            // 3. National stats for total chants + state chant data
            try {
               const statsDoc = await getDoc(doc(db, 'metadata', 'national_stats'));
               if (statsDoc.exists()) {
                  const data = statsDoc.data();
                  setTotalChants(data.totalChants || 0);
                  if (data.states) {
                     setRegionData(prev => prev.map(r => {
                        const s = data.states[r.name];
                        return s ? { ...r, chants: s.chants || 0 } : r;
                     }));
                  }
               }
            } catch (e) {
               console.warn('PlatformAnalytics: national_stats fetch failed', e);
            }
         } catch (err) {
            console.error('PlatformAnalytics fetch error', err);
         } finally {
            setLoading(false);
         }
      };
      fetchAll();
   }, []);

   const kpiCards = [
      { label: 'Total Registered', value: loading ? '…' : totalUsers.toLocaleString(), icon: <Users size={22} />, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Active Today (DAU)', value: loading ? '…' : dauToday.toLocaleString(), icon: <Activity size={22} />, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Active This Week (WAU)', value: loading ? '…' : wauLast7.toLocaleString(), icon: <TrendingUp size={22} />, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Total Chants', value: loading ? '…' : totalChants.toLocaleString(), icon: <Heart size={22} />, color: 'text-gold-600', bg: 'bg-gold-50' },
   ];

   return (
      <div className="space-y-8 animate-in fade-in">
         <div>
            <h2 className="text-3xl font-serif font-bold text-navy-900">Platform Analytics</h2>
            <p className="text-sm text-navy-400">Live engagement metrics from Firestore.</p>
         </div>

         {/* KPI Cards */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {kpiCards.map((c, i) => (
               <Card key={i} className="p-6">
                  <div className={`w-10 h-10 ${c.bg} ${c.color} rounded-xl flex items-center justify-center mb-4`}>
                     {c.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-300 mb-1">{c.label}</p>
                  <p className="text-3xl font-bold text-navy-900">{c.value}</p>
               </Card>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regional Member Distribution */}
            <Card className="p-8">
               <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                  <MapIcon size={20} className="text-gold-500" /> Regional Distribution
               </h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <ReBarChart data={regionData.slice(0, 9)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="members" name="Members" fill="#002E5B" radius={[0, 4, 4, 0]} barSize={16} />
                     </ReBarChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            {/* New Member Join Trend */}
            <Card className="p-8">
               <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-500" /> New Signups (Last 6 Months)
               </h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={joinTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" name="New Members" stroke="#D2AC47" strokeWidth={2} dot={{ fill: '#D2AC47', r: 4 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </Card>
         </div>

         {/* Region + Chants Table */}
         {regionData.length > 0 && (
            <Card>
               <div className="p-6 border-b border-navy-50">
                  <h3 className="font-bold text-navy-900 flex items-center gap-2">
                     <Activity size={18} className="text-gold-500" /> Region Activity Summary
                  </h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-navy-400">
                        <tr>
                           <th className="text-left p-4">Region</th>
                           <th className="text-center p-4">Members</th>
                           <th className="text-center p-4">Total Chants</th>
                           <th className="text-center p-4">Avg Chants / Member</th>
                        </tr>
                     </thead>
                     <tbody>
                        {regionData.map((r, i) => (
                           <tr key={i} className="border-t border-navy-50 hover:bg-neutral-50">
                              <td className="p-4 font-medium text-navy-900">{r.name}</td>
                              <td className="p-4 text-center text-navy-600">{r.members}</td>
                              <td className="p-4 text-center font-bold text-gold-700">{r.chants.toLocaleString()}</td>
                              <td className="p-4 text-center text-navy-500">
                                 {r.members > 0 ? Math.round(r.chants / r.members).toLocaleString() : '—'}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         )}

         {/* Sai Centre Breakdown */}
         {centreData.length > 0 && (
            <Card className="p-8">
               <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                  <Users size={20} className="text-purple-500" /> Sai Centre Membership
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {centreData.map((c, i) => (
                     <div key={i} className="text-center p-4 bg-neutral-50 rounded-2xl">
                        <p className="text-2xl font-black text-navy-900">{c.members}</p>
                        <p className="text-[10px] font-bold text-navy-400 uppercase mt-1 truncate" title={c.name}>{c.name}</p>
                     </div>
                  ))}
               </div>
            </Card>
         )}
      </div>
   );
};

// --- POLL & SURVEY MANAGER ---

const POLL_COLORS = ['#002E5B', '#D2AC47', '#C2195B', '#5726bf', '#00897B', '#f57c00'];

const PollManager: React.FC<{ adminEmail: string }> = ({ adminEmail }) => {
   const [polls, setPolls] = useState<Poll[]>([]);
   const [votes, setVotes] = useState<Record<string, PollVote[]>>({});
   const [loading, setLoading] = useState(true);
   const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
   const [isCreating, setIsCreating] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [newPoll, setNewPoll] = useState<{
      question: string;
      options: string[];
      multipleChoice: boolean;
      expiresAt: string;
   }>({
      question: '',
      options: ['', ''],
      multipleChoice: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
   });

   const loadPolls = async () => {
      setLoading(true);
      try {
         const snap = await getDocs(query(collection(db, 'polls'), orderBy('createdAt', 'desc')));
         const loadedPolls = snap.docs.map(d => ({ pollId: d.id, ...d.data() } as Poll));
         setPolls(loadedPolls);

         const allVotes: Record<string, PollVote[]> = {};
         for (const p of loadedPolls) {
            try {
               const vSnap = await getDocs(collection(db, 'polls', p.pollId, 'votes'));
               allVotes[p.pollId] = vSnap.docs.map(d => ({ voteId: d.id, ...d.data() } as PollVote));
            } catch { /* no votes yet is fine */ }
         }
         setVotes(allVotes);
      } catch (err) {
         console.error('PollManager: load error', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { loadPolls(); }, []);

   const createPoll = async () => {
      const validOptions = newPoll.options.filter(o => o.trim());
      if (!newPoll.question.trim() || validOptions.length < 2) {
         alert('Provide a question and at least 2 options.');
         return;
      }
      setIsSaving(true);
      try {
         const pollData: Omit<Poll, 'pollId'> = {
            question: newPoll.question.trim(),
            options: validOptions,
            multipleChoice: newPoll.multipleChoice,
            expiresAt: new Date(newPoll.expiresAt + 'T23:59:59').toISOString(),
            createdAt: new Date().toISOString(),
            createdBy: adminEmail,
            status: 'active',
         };
         await addDoc(collection(db, 'polls'), pollData);
         logAdminAction(adminEmail, 'Created Poll', pollData.question);
         setIsCreating(false);
         setNewPoll({ question: '', options: ['', ''], multipleChoice: false, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
         await loadPolls();
      } catch (err: any) {
         alert(`Failed to create poll: ${err.message}`);
      } finally {
         setIsSaving(false);
      }
   };

   const toggleStatus = async (poll: Poll) => {
      const newStatus = poll.status === 'active' ? 'closed' : 'active';
      try {
         await updateDoc(doc(db, 'polls', poll.pollId), { status: newStatus });
         setPolls(prev => prev.map(p => p.pollId === poll.pollId ? { ...p, status: newStatus } : p));
         logAdminAction(adminEmail, `Poll ${newStatus === 'active' ? 'Reopened' : 'Closed'}`, poll.question);
      } catch (err: any) {
         alert(`Failed: ${err.message}`);
      }
   };

   const deletePoll = async (poll: Poll) => {
      if (!window.confirm('Delete this poll and all its votes?')) return;
      try {
         await deleteDoc(doc(db, 'polls', poll.pollId));
         setPolls(prev => prev.filter(p => p.pollId !== poll.pollId));
         if (selectedPollId === poll.pollId) setSelectedPollId(null);
         logAdminAction(adminEmail, 'Deleted Poll', poll.question);
      } catch (err: any) {
         alert(`Failed: ${err.message}`);
      }
   };

   const selectedPoll = polls.find(p => p.pollId === selectedPollId) || null;
   const selectedVotes = selectedPollId ? (votes[selectedPollId] || []) : [];

   const getVoteData = (poll: Poll) => {
      const pv = votes[poll.pollId] || [];
      return poll.options.map((opt, idx) => {
         const count = pv.filter(v => v.selectedOptions.includes(idx)).length;
         return { option: opt.length > 30 ? opt.slice(0, 28) + '…' : opt, fullOption: opt, votes: count, pct: pv.length > 0 ? Math.round(count / pv.length * 100) : 0 };
      });
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Poll & Survey Manager</h2>
               <p className="text-sm text-navy-400">Create polls, collect community responses, and analyse results.</p>
            </div>
            <button onClick={() => setIsCreating(true)} className="px-6 py-3 bg-navy-900 text-white rounded-xl font-black uppercase text-[10px] shadow-lg hover:bg-navy-800 transition-all flex items-center gap-2">
               <Plus size={16} /> New Poll
            </button>
         </div>

         {/* Create Poll Modal */}
         {isCreating && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4" onClick={() => setIsCreating(false)}>
               <Card className="w-full max-w-lg p-8 space-y-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-bold text-navy-900">Create New Poll</h3>
                     <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-neutral-100 rounded-xl"><X size={20} /></button>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-navy-300">Question</label>
                     <textarea
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-20 resize-none focus:border-gold-500 outline-none"
                        placeholder="What would you like to ask the community?"
                        value={newPoll.question}
                        onChange={e => setNewPoll({ ...newPoll, question: e.target.value })}
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-navy-300">Answer Options (min 2, max 6)</label>
                     {newPoll.options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                           <input
                              className="flex-grow p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-500 outline-none"
                              placeholder={`Option ${i + 1}`}
                              value={opt}
                              onChange={e => {
                                 const opts = [...newPoll.options];
                                 opts[i] = e.target.value;
                                 setNewPoll({ ...newPoll, options: opts });
                              }}
                           />
                           {newPoll.options.length > 2 && (
                              <button onClick={() => setNewPoll({ ...newPoll, options: newPoll.options.filter((_, idx) => idx !== i) })} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                           )}
                        </div>
                     ))}
                     {newPoll.options.length < 6 && (
                        <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })} className="text-[10px] font-bold text-gold-600 uppercase tracking-widest hover:underline">+ Add Option</button>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy-300">Expires On</label>
                        <input
                           type="date"
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-500 outline-none"
                           value={newPoll.expiresAt}
                           onChange={e => setNewPoll({ ...newPoll, expiresAt: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy-300">Multiple Choice?</label>
                        <button
                           onClick={() => setNewPoll({ ...newPoll, multipleChoice: !newPoll.multipleChoice })}
                           className={`w-full p-3 rounded-xl border-2 text-sm font-bold transition-all ${newPoll.multipleChoice ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-400 border-navy-100'}`}
                        >
                           {newPoll.multipleChoice ? 'Yes — Multiple' : 'No — Single'}
                        </button>
                     </div>
                  </div>

                  <button
                     onClick={createPoll}
                     disabled={isSaving}
                     className="w-full py-4 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                     {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                     {isSaving ? 'Publishing…' : 'Publish Poll'}
                  </button>
               </Card>
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Poll List */}
            <div className="space-y-4">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-navy-300 px-1">All Polls ({polls.length})</p>
               {loading ? (
                  <div className="p-8 text-center text-navy-300"><RefreshCw size={24} className="animate-spin mx-auto" /></div>
               ) : polls.length === 0 ? (
                  <Card className="p-8 text-center text-navy-300 text-sm italic">No polls yet. Create one above.</Card>
               ) : polls.map(p => {
                  const voteCount = (votes[p.pollId] || []).length;
                  const isSelected = selectedPollId === p.pollId;
                  return (
                     <button
                        key={p.pollId}
                        onClick={() => setSelectedPollId(isSelected ? null : p.pollId)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all bg-white ${isSelected ? 'border-navy-900 shadow-lg scale-[1.01]' : 'border-navy-50 hover:border-gold-300 hover:shadow-md'}`}
                     >
                        <div className="flex justify-between items-start gap-2 mb-2">
                           <p className="text-sm font-bold text-navy-900 leading-tight flex-grow">{p.question}</p>
                           <span className={`shrink-0 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                              {p.status}
                           </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-navy-400 font-bold">
                           <span>{voteCount} votes</span>
                           <span>•</span>
                           <span>{p.options.length} options</span>
                           <span>•</span>
                           <span>Exp: {new Date(p.expiresAt).toLocaleDateString()}</span>
                        </div>
                     </button>
                  );
               })}
            </div>

            {/* Right: Results Panel */}
            <div className="lg:col-span-2">
               {!selectedPoll ? (
                  <Card className="p-12 flex flex-col items-center justify-center text-center text-navy-300 min-h-[300px]">
                     <BarChart3 size={40} className="mb-4 opacity-30" />
                     <p className="font-bold text-sm">Select a poll to view results</p>
                  </Card>
               ) : (
                  <Card className="p-8 space-y-8">
                     {/* Poll Header */}
                     <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                           <h3 className="text-xl font-bold text-navy-900 leading-tight">{selectedPoll.question}</h3>
                           <p className="text-xs text-navy-400 mt-1">
                              {selectedVotes.length} votes · {selectedPoll.multipleChoice ? 'Multiple choice' : 'Single choice'}
                              {' · '}Expires {new Date(selectedPoll.expiresAt).toLocaleDateString()}
                              {' · '}By {selectedPoll.createdBy}
                           </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                           <button
                              onClick={() => toggleStatus(selectedPoll)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${selectedPoll.status === 'active' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                           >
                              {selectedPoll.status === 'active' ? 'Close Poll' : 'Reopen'}
                           </button>
                           <button onClick={() => deletePoll(selectedPoll)} className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-100 transition-all">
                              Delete
                           </button>
                        </div>
                     </div>

                     {selectedVotes.length === 0 ? (
                        <div className="py-12 text-center text-navy-300">
                           <p className="text-sm italic">No votes recorded yet.</p>
                        </div>
                     ) : (
                        <>
                           {/* Bar Chart */}
                           <div className="h-56">
                              <ResponsiveContainer width="100%" height="100%">
                                 <ReBarChart data={getVoteData(selectedPoll)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                    <XAxis type="number" domain={[0, selectedVotes.length]} tick={{ fontSize: 10 }} allowDecimals={false} />
                                    <YAxis dataKey="option" type="category" width={160} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(val: any) => [val, 'Votes']} />
                                    <Bar dataKey="votes" radius={[0, 6, 6, 0]} barSize={22}>
                                       {getVoteData(selectedPoll).map((_, i) => (
                                          <Cell key={i} fill={POLL_COLORS[i % POLL_COLORS.length]} />
                                       ))}
                                    </Bar>
                                 </ReBarChart>
                              </ResponsiveContainer>
                           </div>

                           {/* Option Breakdown */}
                           <div className="space-y-3">
                              {getVoteData(selectedPoll).map((d, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: POLL_COLORS[i % POLL_COLORS.length] }} />
                                    <div className="flex-grow">
                                       <div className="flex justify-between text-xs font-bold mb-1">
                                          <span className="text-navy-900" title={d.fullOption}>{d.fullOption}</span>
                                          <span className="text-navy-400 shrink-0 ml-2">{d.votes} ({d.pct}%)</span>
                                       </div>
                                       <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, background: POLL_COLORS[i % POLL_COLORS.length] }} />
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </>
                     )}

                     {/* Export Votes */}
                     {selectedVotes.length > 0 && (
                        <button
                           onClick={() => {
                              const rows = selectedVotes.map(v => ({
                                 VoteId: v.voteId,
                                 UserId: v.uid,
                                 UserName: v.userName,
                                 SelectedOptions: v.selectedOptions.map(i => selectedPoll.options[i]).join('; '),
                                 VotedAt: new Date(v.votedAt).toLocaleString(),
                              }));
                              const csv = Papa.unparse(rows);
                              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.setAttribute('download', `poll-votes-${selectedPoll.pollId}.csv`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                           }}
                           className="flex items-center gap-2 text-[10px] font-black uppercase text-navy-400 hover:text-navy-900 transition-colors"
                        >
                           <Download size={14} /> Export Votes CSV
                        </button>
                     )}
                  </Card>
               )}
            </div>
         </div>
      </div>
   );
};

// --- MAIN PAGE ---

const AdminPage: React.FC<{ user: UserProfile | null }> = ({ user }) => {
   const [isLocked, setIsLocked] = useState(() => sessionStorage.getItem('sms_admin_session') !== 'active');
   const [password, setPassword] = useState('');
   const [activeModule, setActiveModule] = useState('comms');
   const navigate = useNavigate();

   // Route Protection
   useEffect(() => {
      // Allow guests to see the page briefly before locking them out if they try to interact, 
      // or redirect immediately if we strictly enforce it.
      // Usually, it's safer to redirect immediately if they aren't an admin.
      if (user && !user.isGuest) {
         const hasAccess = user.isAdmin || (user.email && ADMIN_CONFIG.AUTHORIZED_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase()));
         if (!hasAccess) {
            navigate('/', { replace: true });
         }
      } else if (!user || user.isGuest) {
         navigate('/', { replace: true });
      }
   }, [user, navigate]);

   const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === ADMIN_CONFIG.MASTER_PASSWORD) {
         setIsLocked(false);
         sessionStorage.setItem('sms_admin_session', 'active');
         logAdminAction(user?.email || 'system', 'Admin Logged In', 'Hub Access');
      } else {
         alert("Invalid Spiritual Credentials.");
      }
   };

   const handleLogout = () => {
      sessionStorage.removeItem('sms_admin_session');
      setIsLocked(true);
      window.location.hash = '#/';
   };

   if (isLocked) {
      return (
         <div className="min-h-[85vh] flex items-center justify-center bg-neutral-50 px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-navy-50 animate-in zoom-in-95">
               <div className="w-24 h-24 bg-navy-900 rounded-[2rem] mx-auto flex items-center justify-center text-gold-500 shadow-xl mb-10"><ShieldCheck size={48} /></div>
               <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2">National Command</h1>
               <p className="text-xs text-navy-300 font-bold uppercase tracking-widest">SSIOM Spiritual Infrastructure</p>
               <form onSubmit={handleUnlock} className="mt-12 space-y-6">
                  <input type="password" required className="w-full p-5 bg-neutral-50 rounded-2xl border border-navy-50 font-black text-center outline-none focus:border-gold-500" placeholder="Master Password" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="submit" className="w-full py-5 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Unlock Management Hub</button>
               </form>
               <button onClick={() => window.location.hash = '#/'} className="mt-8 text-[9px] font-black uppercase text-navy-200 hover:text-navy-900 transition-colors">Return to Public Portal</button>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-[1600px] mx-auto px-4 py-12 min-h-screen">
         <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
               <div className="flex items-center gap-3 text-gold-600 mb-3">
                  <Shield size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Access</span>
               </div>
               <h1 className="text-5xl font-serif font-bold text-navy-900 leading-tight">National Command Hub</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-navy-50 flex items-center gap-4">
                  <SaiAvatar gender="male" size={40} />
                  <div className="text-right">
                     <p className="text-xs font-bold text-navy-900">{user?.name || 'Admin'}</p>
                     <p className="text-[9px] font-black text-navy-200 uppercase">National Coordinator</p>
                  </div>
               </div>
               <button onClick={handleLogout} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all shadow-sm"><LogOut size={24} /></button>
            </div>
         </header>

         <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-72 space-y-2 shrink-0">
               <h4 className="text-[9px] font-black uppercase text-navy-200 tracking-[0.3em] px-6 mb-4">Core Modules</h4>
               <AdminNavItem active={activeModule === 'comms'} onClick={() => setActiveModule('comms')} icon={<Megaphone size={20} />} label="Comms Center" />
               <AdminNavItem active={activeModule === 'events'} onClick={() => setActiveModule('events')} icon={<Calendar size={20} />} label="Event Manager" />
               <AdminNavItem active={activeModule === 'content'} onClick={() => setActiveModule('content')} icon={<BookOpen size={20} />} label="Content Studio" />
               <div className="my-4 border-t border-navy-50"></div>
               <h4 className="text-[9px] font-black uppercase text-navy-200 tracking-[0.3em] px-6 mb-4">Registry & Data</h4>
               <AdminNavItem active={activeModule === 'users'} onClick={() => setActiveModule('users')} icon={<Users size={20} />} label="Member Registry" />
               <AdminNavItem active={activeModule === 'reflections'} onClick={() => setActiveModule('reflections')} icon={<Quote size={20} />} label="Reflection Queue" />
               <AdminNavItem active={activeModule === 'sadhana'} onClick={() => setActiveModule('sadhana')} icon={<Activity size={20} />} label="Sadhana Analytics" />
               <AdminNavItem active={activeModule === 'bookclub_analytics'} onClick={() => setActiveModule('bookclub_analytics')} icon={<Trophy size={20} />} label="Book Club Analytics" />
               <AdminNavItem active={activeModule === 'platform_analytics'} onClick={() => setActiveModule('platform_analytics')} icon={<BarChart3 size={20} />} label="Platform Analytics" />
               <AdminNavItem active={activeModule === 'polls'} onClick={() => setActiveModule('polls')} icon={<Vote size={20} />} label="Polls & Surveys" />
               <div className="my-4 border-t border-navy-50"></div>
               <h4 className="text-[9px] font-black uppercase text-navy-200 tracking-[0.3em] px-6 mb-4">System</h4>
               <AdminNavItem active={activeModule === 'page_content'} onClick={() => setActiveModule('page_content')} icon={<Type size={20} />} label="Page Text" />
               <AdminNavItem active={activeModule === 'branding'} onClick={() => setActiveModule('branding')} icon={<Layout size={20} />} label="Brand Identity" />
            </aside>

            <main className="flex-grow">
               {activeModule === 'comms' && <CommunicationsManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'page_content' && <PageContentManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'events' && <EventManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'content' && <ContentStudio adminEmail={user?.email || 'admin'} />}
               {activeModule === 'branding' && <BrandingManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'bookclub_analytics' && <BookClubAnalytics />}
               {activeModule === 'users' && <UserRegistry adminEmail={user?.email || 'admin'} />}
               {activeModule === 'reflections' && <ReflectionQueue adminEmail={user?.email || 'admin'} />}
               {activeModule === 'sadhana' && <SadhanaAnalytics />}
               {activeModule === 'platform_analytics' && <PlatformAnalytics />}
               {activeModule === 'polls' && <PollManager adminEmail={user?.email || 'admin'} />}
            </main>
         </div>
      </div>
   );
};

const AdminNavItem = ({ active, onClick, icon, label }: any) => (
   <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all group ${active ? 'bg-navy-900 text-gold-500 shadow-xl scale-[1.02]' : 'text-navy-400 hover:bg-white hover:text-navy-900'
         }`}
   >
      <div className="flex items-center gap-4">
         {icon}
         <span className="text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className={`transition-all ${active ? 'opacity-100' : 'opacity-0'}`} />
   </button>
);

export default AdminPage;
