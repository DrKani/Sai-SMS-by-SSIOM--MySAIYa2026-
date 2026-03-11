
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   RefreshCw, BookOpen, Plus, Send, Check, Trash2, Database,
   ShieldCheck, LogOut, FileText, ArrowLeft, Download,
   Zap, Bell, X, PieChart as PieIcon, Users, Shield,
   ChevronRight, Search, Activity, HardDrive,
   Filter, CheckCircle2, XCircle, Star, Edit3, MessageCircle,
   BarChart as BarChartIcon, Eye, EyeOff, Layout, Globe, Image as ImageIcon, Link as LinkIcon,
   Calendar, FileJson, ShieldAlert, ClipboardList, Settings, MoreVertical,
   CheckCheck, AlertTriangle, PlayCircle, Lock, Heart, Clock, Paperclip,
   Save, UserPlus, GraduationCap, Info, Gamepad2, Layers, BarChart2,
   ListFilter, Target, History, Lightbulb, ExternalLink, Video,
   ArrowRight, PenTool, HelpCircle, MessageSquare, Repeat, Smartphone, Sparkles, Megaphone,
   Trophy, Type, Home, Mic, UserCog, Ban, Key, Map as MapIcon, Quote, Send as SendIcon, MapPin, Tag, Newspaper, Globe as GlobeIcon, BookMarked
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
   SmsEvent,
   BrandingConfig,
   SiteContent,
   Article,
   ArticleComment
} from '../types';
import SaiAvatar from '../components/SaiAvatar';
import {
   BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
   PieChart as RePieChart, Pie, Sector, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp, where, getDoc } from 'firebase/firestore';
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

// 7. USER REGISTRY & ROLE MANAGER
const UserRegistry = ({ adminEmail }: { adminEmail: string }) => {
   const [users, setUsers] = useState<UserProfile[]>([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
   const [userStats, setUserStats] = useState<Record<string, number>>({});
   const [activeTab, setActiveTab] = useState<'registry' | 'analytics'>('registry');
   const [isLoading, setIsLoading] = useState(true);
   const [loadError, setLoadError] = useState<string | null>(null);

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

   const toggleLeaderboardVisibility = async (uid: string, currentStatus: boolean | undefined) => {
      try {
         const newStatus = currentStatus === false ? true : false;
         await updateDoc(doc(db, 'users', uid), { publicLeaderboard: newStatus });
         const updatedUsers = users.map(u => u.uid === uid ? { ...u, publicLeaderboard: newStatus } : u);
         setUsers(updatedUsers);
         localStorage.setItem('sms_all_users', JSON.stringify(updatedUsers));
         logAdminAction(adminEmail, newStatus ? 'Shown on Leaderboard' : 'Hidden from Leaderboard', uid);
      } catch (error) {
         console.error("Error toggling leaderboard visibility", error);
         alert("Failed to update user visibility.");
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
      const exportData = filteredUsers.map(u => ({
         UID: u.uid,
         Name: u.name,
         Email: u.email,
         Gender: u.gender || '',
         State: u.state || '',
         Centre: u.centre || '',
         IsAdmin: u.isAdmin ? 'Yes' : 'No',
         IsGuest: u.isGuest ? 'Yes' : 'No',
         JoinedAt: new Date(u.joinedAt).toLocaleString(),
         TotalChants: userStats[u.uid] || 0,
         OnboardedApp: u.onboardedApp ? 'Yes' : 'No',
         PublicLeaderboard: u.publicLeaderboard !== false ? 'Yes' : 'No'
      }));

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
                     <button onClick={handleExportCSV} className="px-4 py-2 bg-gold-50 text-gold-700 border border-gold-200 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gold-100 transition-colors">
                        <Download size={14} /> Export CSV
                     </button>
                  </div>
               </div>

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
                                       onClick={() => toggleLeaderboardVisibility(u.uid, u.publicLeaderboard)}
                                       title={u.publicLeaderboard !== false ? "Hide from Leaderboard" : "Show on Leaderboard"}
                                       aria-label={u.publicLeaderboard !== false ? "Hide from Leaderboard" : "Show on Leaderboard"}
                                       className={`p-3 rounded-lg transition-colors ${u.publicLeaderboard !== false ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                    >
                                       {u.publicLeaderboard !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                       onClick={() => toggleAdmin(u.uid, u.isAdmin)}
                                       title={u.isAdmin ? "Revoke Admin" : "Make Admin"}
                                       aria-label={u.isAdmin ? "Revoke Admin" : "Make Admin"}
                                       className={`p-3 rounded-lg transition-colors ${u.isAdmin ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                    >
                                       {u.isAdmin ? <UserCog size={18} /> : <Shield size={18} />}
                                    </button>
                                    <button
                                       onClick={() => deleteUser(u.uid)}
                                       title="Delete User"
                                       aria-label="Delete User"
                                       className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                       <Ban size={18} />
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

// 8. REFLECTION QUEUE MANAGEMENT (enhanced)
const ReflectionQueue = ({ adminEmail }: { adminEmail: string }) => {
   const [reflections, setReflections] = useState<Reflection[]>([]);
   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
   const [searchQuery, setSearchQuery] = useState('');
   const [adminComment, setAdminComment] = useState<Record<string, string>>({});
   const [expandedId, setExpandedId] = useState<string | null>(null);

   const loadQueue = () => {
      const queue: Reflection[] = JSON.parse(localStorage.getItem('sms_reflections_queue') || '[]');
      // Sort pending first, then by timestamp desc
      queue.sort((a, b) => {
         if (a.status === 'pending' && b.status !== 'pending') return -1;
         if (b.status === 'pending' && a.status !== 'pending') return 1;
         return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      setReflections(queue);
   };

   useEffect(() => {
      const loadReflections = async () => {
         try {
            const snap = await getDocs(collection(db, 'reflections'));
            const refs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reflection));
            // Show pending first
            refs.sort((a, b) => {
               if (a.status === 'pending' && b.status !== 'pending') return -1;
               if (a.status !== 'pending' && b.status === 'pending') return 1;
               return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
            setReflections(refs);
         } catch (e) {
            console.error("Failed to load reflections", e);
         }
      };
      loadReflections();
   }, []);

   const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
      try {
         await updateDoc(doc(db, 'reflections', id), { status });
         const updated = reflections.map(r => r.id === id ? { ...r, status } : r);
         setReflections(updated);
         logAdminAction(adminEmail, `Reflection ${status}`, id);
         window.dispatchEvent(new Event('storage'));
      } catch (e) {
         console.error("Failed to update status", e);
         alert("Failed to update status.");
      }
   };

   const saveAdminComment = (id: string) => {
      const comment = adminComment[id] || '';
      const updated = reflections.map(r =>
         r.id === id ? { ...r, adminComments: comment } : r
      );
      setReflections(updated);
      localStorage.setItem('sms_reflections_queue', JSON.stringify(updated));
      logAdminAction(adminEmail, 'Added Admin Comment', id);
      setExpandedId(null);
   };

   const counts = {
      all: reflections.length,
      pending: reflections.filter(r => r.status === 'pending').length,
      approved: reflections.filter(r => r.status === 'approved').length,
      rejected: reflections.filter(r => r.status === 'rejected').length,
   };

   const filtered = reflections.filter(r => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || r.userName.toLowerCase().includes(q) ||
         r.content.toLowerCase().includes(q) || r.chapterTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
   });

   const statusColor = (s: string) => s === 'approved' ? 'bg-green-100 text-green-700' :
      s === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gold-100 text-gold-700';

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Reflection Queue</h2>
               <p className="text-sm text-navy-400">Moderate and approve user testimonials from Book Club.</p>
            </div>
            <button onClick={loadQueue} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors">
               <RefreshCw size={14} /> Refresh
            </button>
         </div>

         {/* Stats row */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
               <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${statusFilter === s ? 'bg-navy-900 text-white border-navy-900 shadow-lg' : 'bg-white border-navy-50 hover:border-navy-200'}`}
               >
                  <p className={`text-2xl font-black mb-1 ${statusFilter === s ? 'text-gold-400' : 'text-navy-900'}`}>
                     {counts[s]}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === s ? 'text-white/70' : 'text-navy-400'}`}>
                     {s}
                  </p>
               </button>
            ))}
         </div>

         {/* Search */}
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" size={16} />
            <input
               className="w-full pl-11 pr-4 py-3 bg-white border border-navy-50 rounded-2xl text-sm font-medium shadow-sm focus:border-gold-400 outline-none"
               placeholder="Search by user, chapter, or content..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
         </div>

         {/* Reflection cards */}
         {filtered.length === 0 ? (
            <Card>
               <div className="p-16 text-center text-navy-300 italic">
                  {counts.all === 0 ? 'No reflections in the queue yet.' : 'No reflections match your filter.'}
               </div>
            </Card>
         ) : (
            <div className="space-y-4">
               {filtered.map(r => (
                  <Card key={r.id} className={`p-6 border-l-4 ${r.status === 'approved' ? 'border-l-green-500' : r.status === 'rejected' ? 'border-l-red-400' : 'border-l-gold-500'}`}>
                     <div className="flex flex-col md:flex-row gap-6">
                        <div className="shrink-0 md:w-48 space-y-1">
                           <p className="font-bold text-navy-900 text-sm">{r.userName}</p>
                           <p className="text-[10px] text-navy-400">{new Date(r.timestamp).toLocaleDateString()}</p>
                           <p className="text-[9px] font-black uppercase text-purple-600">{r.chapterTitle}</p>
                           <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${statusColor(r.status)}`}>
                              {r.status}
                           </span>
                        </div>

                        <div className="flex-grow space-y-3">
                           <p className="text-sm text-navy-700 italic leading-relaxed bg-neutral-50 rounded-xl p-4 border border-navy-50">
                              "{r.content}"
                           </p>

                           {r.adminComments && (
                              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                 <MessageCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                 <p className="text-xs text-blue-800 font-medium">{r.adminComments}</p>
                              </div>
                           )}

                           {expandedId === r.id && (
                              <div className="space-y-2">
                                 <textarea
                                    className="w-full p-3 bg-white border border-navy-100 rounded-xl text-sm resize-none h-20 focus:border-gold-400 outline-none"
                                    placeholder="Add admin note or feedback..."
                                    value={adminComment[r.id] ?? r.adminComments ?? ''}
                                    onChange={e => setAdminComment(prev => ({ ...prev, [r.id]: e.target.value }))}
                                 />
                                 <div className="flex gap-2">
                                    <button onClick={() => saveAdminComment(r.id)} className="px-4 py-2 bg-navy-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-navy-800">
                                       <Check size={12} /> Save Note
                                    </button>
                                    <button onClick={() => setExpandedId(null)} className="px-4 py-2 bg-neutral-100 text-navy-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                       Cancel
                                    </button>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="flex md:flex-col gap-2 shrink-0 justify-end md:justify-start">
                           {r.status === 'pending' && (
                              <>
                                 <button
                                    onClick={() => updateStatus(r.id, 'approved')}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 transition-colors border border-green-200"
                                 >
                                    <CheckCircle2 size={14} /> Approve
                                 </button>
                                 <button
                                    onClick={() => updateStatus(r.id, 'rejected')}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-200"
                                 >
                                    <XCircle size={14} /> Reject
                                 </button>
                              </>
                           )}
                           {r.status !== 'pending' && (
                              <button
                                 onClick={() => updateStatus(r.id, r.status === 'approved' ? 'rejected' : 'approved')}
                                 className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-navy-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                              >
                                 <RefreshCw size={12} /> Reverse
                              </button>
                           )}
                           <button
                              onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-100 transition-colors"
                           >
                              <MessageCircle size={12} /> {r.adminComments ? 'Edit Note' : 'Add Note'}
                           </button>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
         )}
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
   const navigate = useNavigate();
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
      const fetchAnns = async () => {
         try {
            const snap = await getDocs(query(collection(db, 'announcements'), orderBy('timestamp', 'desc')));
            const ans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
            setAnnouncements(ans);
         } catch (e) {
            console.error("Failed to load announcements", e);
         }
      };
      fetchAnns();
   }, []);

   const saveTicker = () => {
      localStorage.setItem('sms_ticker_message', tickerMsg);
      logAdminAction(adminEmail, 'Updated Ticker', 'Global Marquee');
      // Dispatch event to update App.tsx immediately
      window.dispatchEvent(new Event('storage'));
      alert("Live Ticker Updated Successfully!");
   };

   const postAnnouncement = async () => {
      if (!newAnn.title || !newAnn.content) return;

      try {
         const annData = {
            title: newAnn.title,
            content: newAnn.content,
            category: newAnn.category as any,
            timestamp: new Date().toISOString(),
            isPinned: false,
            imageUrl: newAnn.imageUrl || null
         };

         const docRef = await addDoc(collection(db, 'announcements'), annData);
         const ann: Announcement = { id: docRef.id, ...annData } as Announcement;

         const updated = [ann, ...announcements];
         setAnnouncements(updated);
         logAdminAction(adminEmail, 'Posted Announcement', ann.title);
         setNewAnn({ title: '', content: '', category: 'News' });
      } catch (e) {
         console.error("Failed to post announcement", e);
         alert("Failed to post announcement.");
      }
   };

   const deleteAnnouncement = async (id: string) => {
      try {
         await deleteDoc(doc(db, 'announcements', id));
         const updated = announcements.filter(a => a.id !== id);
         setAnnouncements(updated);
         logAdminAction(adminEmail, 'Deleted Announcement', id);
      } catch (e) {
         console.error("Failed to delete announcement", e);
         alert("Failed to delete announcement.");
      }
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
            <Card className="p-8 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-gold-50 text-gold-500 rounded-full flex items-center justify-center mb-6">
                  <Megaphone size={32} />
               </div>
               <h3 className="text-xl font-bold text-navy-900 mb-2">Create Announcement</h3>
               <p className="text-sm text-navy-400 mb-8">Broadcast news, events, or updates to the community via banner or bell notifications.</p>
               <button onClick={() => navigate('/admin/announcements/create')} className="w-full py-4 bg-navy-900 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-navy-800 transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> New Announcement
               </button>
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
                        <button
                           onClick={() => deleteAnnouncement(a.id)}
                           title="Delete Announcement"
                           aria-label="Delete Announcement"
                           className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                           <Trash2 size={18} />
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
   const [events, setEvents] = useState<SmsEvent[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);

   const [newEvent, setNewEvent] = useState<Partial<SmsEvent>>({
      title: '',
      description: '',
      eventDate: new Date().toISOString().slice(0, 16), // datetime-local format
      location: '',
      type: 'spiritual',
      maxAttendees: 100,
      status: 'published'
   });

   useEffect(() => {
      const q = query(collection(db, 'calendar'), orderBy('eventDate', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
         const evts = snap.docs.map(doc => ({
            ...doc.data(),
            eventId: doc.id
         })) as SmsEvent[];
         setEvents(evts);
         setIsLoading(false);
      }, (err) => {
         console.error("Error fetching events:", err);
         setIsLoading(false);
      });
      return () => unsub();
   }, []);

   const handleSave = async () => {
      if (!newEvent.title || !newEvent.eventDate || !newEvent.location) {
         alert("Please fill in Title, Date, and Location.");
         return;
      }

      setIsSaving(true);
      try {
         const currentUser = JSON.parse(localStorage.getItem('sms_user') || '{}');
         const eventData: any = {
            title: newEvent.title,
            description: newEvent.description || '',
            eventDate: Timestamp.fromDate(new Date(newEvent.eventDate!)),
            endDate: newEvent.endDate ? Timestamp.fromDate(new Date(newEvent.endDate)) : null,
            location: newEvent.location,
            type: newEvent.type || 'spiritual',
            maxAttendees: Number(newEvent.maxAttendees) || 0,
            imageUrl: newEvent.imageUrl || '',
            status: newEvent.status || 'published'
         };

         if (editingId) {
            await updateDoc(doc(db, 'calendar', editingId), eventData);
            logAdminAction(adminEmail, 'Edited Event', newEvent.title || 'Unknown');
            alert("Event updated successfully!");
         } else {
            eventData.registeredCount = 0;
            eventData.registeredUsers = [];
            eventData.createdBy = currentUser.uid || 'admin';
            eventData.createdAt = serverTimestamp();
            await addDoc(collection(db, 'calendar'), eventData);
            logAdminAction(adminEmail, 'Created Event', newEvent.title || 'Unknown');
            alert("Event published successfully!");
         }

         setNewEvent({
            title: '',
            description: '',
            eventDate: new Date().toISOString().slice(0, 16),
            location: '',
            type: 'spiritual',
            maxAttendees: 100,
            status: 'published'
         });
         setEditingId(null);
      } catch (error) {
         console.error("Error saving event:", error);
         alert(editingId ? "Failed to update event." : "Failed to publish event.");
      } finally {
         setIsSaving(false);
      }
   };

   const handleEdit = (evt: SmsEvent) => {
      let dateString = '';
      if (evt.eventDate) {
         const dateObj = (evt.eventDate as any).toDate ? (evt.eventDate as any).toDate() : new Date(evt.eventDate);
         dateString = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      }

      setNewEvent({
         title: evt.title,
         description: evt.description,
         eventDate: dateString,
         location: evt.location,
         type: evt.type,
         maxAttendees: evt.maxAttendees,
         imageUrl: evt.imageUrl,
         status: evt.status
      });
      setEditingId(evt.eventId);
   };

   const handleDelete = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this event?")) return;
      try {
         await deleteDoc(doc(db, 'calendar', id));
         logAdminAction(adminEmail, 'Deleted Event', id);
      } catch (error) {
         console.error("Error deleting event:", error);
         alert("Failed to delete event.");
      }
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
               <div className="flex justify-between items-center border-b border-navy-50 pb-4">
                  <h3 className="text-lg font-bold text-navy-900">{editingId ? 'Edit Event' : 'Create New Event'}</h3>
                  {editingId && (
                     <button onClick={() => {
                        setEditingId(null);
                        setNewEvent({
                           title: '',
                           description: '',
                           eventDate: new Date().toISOString().slice(0, 16),
                           location: '',
                           type: 'spiritual',
                           maxAttendees: 100,
                           status: 'published'
                        });
                     }} className="text-[10px] font-black uppercase text-navy-300 hover:text-navy-900 tracking-widest flex items-center gap-1">
                        <X size={12} /> Cancel Edit
                     </button>
                  )}
               </div>
               <div className="space-y-4">
                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Event Title</label>
                     <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold" placeholder="e.g. Maha Shivaratri 2026" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Start Date/Time</label>
                        <input type="datetime-local" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-[10px]" value={newEvent.eventDate} onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Max Attendees</label>
                        <input type="number" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="0 = Unlimited" value={newEvent.maxAttendees} onChange={e => setNewEvent({ ...newEvent, maxAttendees: Number(e.target.value) })} />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Category</label>
                     <div className="flex flex-wrap gap-2">
                        {(['spiritual', 'service', 'learning', 'festival'] as const).map(cat => (
                           <button
                              key={cat}
                              onClick={() => setNewEvent({ ...newEvent, type: cat })}
                              className={`flex-1 py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 transition-all ${newEvent.type === cat ? 'bg-navy-900 text-gold-500 border-navy-900' : 'bg-white border-navy-50 text-navy-300'}`}
                           >
                              {cat}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Location</label>
                     <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="Venue Address or 'Online'" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Description</label>
                     <textarea className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-24 resize-none" placeholder="Event details..." value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                  </div>

                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Image URL (Optional)</label>
                     <input className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm" placeholder="https://..." value={newEvent.imageUrl} onChange={e => setNewEvent({ ...newEvent, imageUrl: e.target.value })} />
                  </div>

                  <button
                     disabled={isSaving}
                     onClick={handleSave}
                     className={`w-full py-4 font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-navy-900 text-gold-500 hover:bg-navy-800'}`}
                  >
                     {isSaving ? <RefreshCw className="animate-spin" size={16} /> : editingId ? <Save size={16} /> : <Plus size={16} />}
                     {editingId ? 'Save Changes' : 'Publish Event'}
                  </button>
               </div>
            </Card>

            <Card className="lg:col-span-2 p-8 overflow-hidden flex flex-col">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-navy-900">Live Calendar Data</h3>
                  <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                     <Database size={12} /> Connected to Firestore
                  </div>
               </div>

               <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2 max-h-[600px]">
                  {isLoading ? (
                     <div className="py-20 text-center text-navy-300 flex flex-col items-center gap-4">
                        <RefreshCw className="animate-spin" size={32} />
                        <p className="text-xs font-black uppercase tracking-widest">Loading Events...</p>
                     </div>
                  ) : events.length === 0 ? (
                     <div className="py-20 text-center border-2 border-dashed border-navy-50 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-navy-100 mb-4" />
                        <p className="text-navy-400 font-medium">No events found in Firestore.</p>
                     </div>
                  ) : (
                     events.map((evt, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-neutral-50 rounded-2xl border border-navy-50 group hover:border-gold-300 transition-all">
                           <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 shadow-sm ${evt.type === 'spiritual' ? 'bg-purple-100 text-purple-600' :
                                 evt.type === 'service' ? 'bg-teal-100 text-teal-600' :
                                    evt.type === 'festival' ? 'bg-orange-100 text-orange-600' :
                                       'bg-blue-100 text-blue-600'}`}>
                                 <span className="text-[10px] leading-none mb-0.5">{evt.eventDate instanceof Timestamp || (evt.eventDate && typeof evt.eventDate.toDate === 'function') ? evt.eventDate.toDate().toLocaleString('default', { month: 'short' }) : 'Date'}</span>
                                 <span className="text-xl leading-none">{evt.eventDate instanceof Timestamp || (evt.eventDate && typeof evt.eventDate.toDate === 'function') ? evt.eventDate.toDate().getDate() : '?'}</span>
                              </div>
                              <div>
                                 <h4 className="font-bold text-navy-900 group-hover:text-purple-600 transition-colors">{evt.title}</h4>
                                 <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-navy-400 font-medium flex items-center gap-1"><MapPin size={10} /> {evt.location}</span>
                                    <span className="text-[10px] text-navy-400 font-medium flex items-center gap-1"><Users size={10} /> {evt.registeredCount} / {evt.maxAttendees || '∞'}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${evt.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-navy-400'}`}>
                                       {evt.status}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(evt)} className="p-3 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                 <Edit3 size={18} />
                              </button>
                              <button onClick={() => handleDelete(evt.eventId)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </div>
                     ))
                  )}
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

// --- ARTICLE COMMENT MODERATION ---

const ArticleCommentModeration = ({ adminEmail }: { adminEmail: string }) => {
   const [comments, setComments] = useState<ArticleComment[]>([]);
   const [articles, setArticles] = useState<Record<string, string>>({});
   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
   const [isLoading, setIsLoading] = useState(true);

   const load = async () => {
      setIsLoading(true);
      try {
         const commentsSnap = await getDocs(
            query(collection(db, 'articleComments'), orderBy('timestamp', 'desc'))
         );
         const allComments: ArticleComment[] = commentsSnap.docs.map(d => ({
            id: d.id,
            ...d.data()
         } as ArticleComment));
         setComments(allComments);

         // Build article title lookup
         const articleIds = [...new Set(allComments.map(c => c.articleId))];
         const titleMap: Record<string, string> = {};
         await Promise.all(articleIds.map(async (id) => {
            try {
               const snap = await getDocs(query(collection(db, 'articles'), where('__name__', '==', id)));
               if (!snap.empty) titleMap[id] = (snap.docs[0].data() as Article).title;
               else titleMap[id] = id;
            } catch { titleMap[id] = id; }
         }));
         setArticles(titleMap);
      } catch (err) {
         console.error('Failed to load article comments', err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { load(); }, []);

   const updateCommentStatus = async (commentId: string, status: 'approved' | 'rejected') => {
      try {
         await updateDoc(doc(db, 'articleComments', commentId), { status });
         setComments(prev => prev.map(c => c.id === commentId ? { ...c, status } : c));
         logAdminAction(adminEmail, `Article Comment ${status}`, commentId);
      } catch (err) {
         console.error('Failed to update comment status', err);
         alert('Failed to update status. Check admin permissions.');
      }
   };

   const deleteComment = async (commentId: string) => {
      if (!window.confirm('Permanently delete this comment?')) return;
      try {
         await deleteDoc(doc(db, 'articleComments', commentId));
         setComments(prev => prev.filter(c => c.id !== commentId));
         logAdminAction(adminEmail, 'Deleted Article Comment', commentId);
      } catch (err) {
         console.error('Failed to delete comment', err);
         alert('Failed to delete comment.');
      }
   };

   const counts = {
      all: comments.length,
      pending: comments.filter(c => c.status === 'pending').length,
      approved: comments.filter(c => c.status === 'approved').length,
      rejected: comments.filter(c => c.status === 'rejected').length,
   };

   const filtered = comments.filter(c => statusFilter === 'all' || c.status === statusFilter);

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Article Comments</h2>
               <p className="text-sm text-navy-400">Moderate reader comments on published articles.</p>
            </div>
            <button onClick={load} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50">
               <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
               <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${statusFilter === s ? 'bg-navy-900 text-white border-navy-900 shadow-lg' : 'bg-white border-navy-50 hover:border-navy-200'}`}
               >
                  <p className={`text-2xl font-black mb-1 ${statusFilter === s ? 'text-gold-400' : 'text-navy-900'}`}>{counts[s]}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === s ? 'text-white/70' : 'text-navy-400'}`}>{s}</p>
               </button>
            ))}
         </div>

         <Card>
            {isLoading ? (
               <div className="p-12 text-center flex items-center justify-center gap-3 text-navy-300">
                  <RefreshCw size={20} className="animate-spin" /><span>Loading comments...</span>
               </div>
            ) : filtered.length === 0 ? (
               <div className="p-16 text-center text-navy-300 italic">No comments match this filter.</div>
            ) : (
               <div className="divide-y divide-navy-50">
                  {filtered.map(c => (
                     <div key={c.id} className="p-6 flex flex-col md:flex-row gap-4 group">
                        <div className="shrink-0 md:w-48 space-y-1">
                           <p className="font-bold text-navy-900 text-sm">{c.userName}</p>
                           <p className="text-[10px] text-navy-400">{new Date(c.timestamp).toLocaleDateString()}</p>
                           <p className="text-[9px] text-purple-600 font-bold truncate" title={articles[c.articleId] || c.articleId}>
                              {articles[c.articleId] || c.articleId}
                           </p>
                           <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${c.status === 'approved' ? 'bg-green-100 text-green-700' :
                              c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gold-100 text-gold-700'
                              }`}>{c.status}</span>
                        </div>
                        <div className="flex-grow">
                           <p className="text-sm text-navy-700 leading-relaxed bg-neutral-50 rounded-xl p-4 border border-navy-50 italic">
                              "{c.content}"
                           </p>
                        </div>
                        <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                           {c.status === 'pending' && (
                              <>
                                 <button onClick={() => updateCommentStatus(c.id, 'approved')} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 border border-green-200">
                                    <CheckCircle2 size={14} /> Approve
                                 </button>
                                 <button onClick={() => updateCommentStatus(c.id, 'rejected')} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 border border-red-200">
                                    <XCircle size={14} /> Reject
                                 </button>
                              </>
                           )}
                           {c.status !== 'pending' && (
                              <button onClick={() => updateCommentStatus(c.id, c.status === 'approved' ? 'rejected' : 'approved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-navy-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-neutral-200">
                                 <RefreshCw size={12} /> Reverse
                              </button>
                           )}
                           <button onClick={() => deleteComment(c.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-100">
                              <Trash2 size={12} /> Delete
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </Card>
      </div>
   );
};

// --- ARTICLE MANAGER ---

const EMPTY_ARTICLE: Omit<Article, 'id'> = {
   title: '',
   excerpt: '',
   content: '',
   imageUrl: '',
   author: '',
   authorUid: '',
   tags: [],
   publishedAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
   status: 'draft',
   commentsEnabled: true,
};

const ArticleManager = ({ adminEmail, user }: { adminEmail: string; user: UserProfile | null }) => {
   const [articles, setArticles] = useState<Article[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [view, setView] = useState<'list' | 'editor'>('list');
   const [editing, setEditing] = useState<Article | null>(null);
   const [form, setForm] = useState<Omit<Article, 'id'>>(EMPTY_ARTICLE);
   const [tagInput, setTagInput] = useState('');
   const [isSaving, setIsSaving] = useState(false);

   const loadArticles = async () => {
      setIsLoading(true);
      try {
         const snap = await getDocs(query(collection(db, 'articles'), orderBy('updatedAt', 'desc')));
         setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
      } catch (err) {
         console.error('Failed to load articles', err);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { loadArticles(); }, []);

   const openNew = () => {
      setEditing(null);
      setForm({ ...EMPTY_ARTICLE, author: user?.name || 'Admin', authorUid: user?.uid || '' });
      setTagInput('');
      setView('editor');
   };

   const openEdit = (article: Article) => {
      setEditing(article);
      setForm({ ...article });
      setTagInput('');
      setView('editor');
   };

   const saveArticle = async () => {
      if (!form.title.trim() || !form.content.trim()) {
         alert('Title and content are required.');
         return;
      }
      setIsSaving(true);
      try {
         const now = new Date().toISOString();
         if (editing) {
            const updated = { ...form, updatedAt: now };
            await updateDoc(doc(db, 'articles', editing.id), updated);
            setArticles(prev => prev.map(a => a.id === editing.id ? { ...a, ...updated } : a));
            logAdminAction(adminEmail, 'Updated Article', form.title);
         } else {
            const newArticle = {
               ...form,
               publishedAt: form.status === 'published' ? now : form.publishedAt,
               updatedAt: now,
            };
            const docRef = await addDoc(collection(db, 'articles'), newArticle);
            setArticles(prev => [{ id: docRef.id, ...newArticle }, ...prev]);
            logAdminAction(adminEmail, 'Created Article', form.title);
         }
         setView('list');
         setEditing(null);
      } catch (err: any) {
         console.error('Failed to save article', err);
         alert(`Save failed: ${err?.message || 'Unknown error'}`);
      } finally {
         setIsSaving(false);
      }
   };

   const togglePublish = async (article: Article) => {
      const newStatus = article.status === 'published' ? 'draft' : 'published';
      const now = new Date().toISOString();
      try {
         await updateDoc(doc(db, 'articles', article.id), {
            status: newStatus,
            publishedAt: newStatus === 'published' ? now : article.publishedAt,
            updatedAt: now,
         });
         setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus, updatedAt: now } : a));
         logAdminAction(adminEmail, `Article ${newStatus === 'published' ? 'Published' : 'Unpublished'}`, article.title);
      } catch (err) {
         console.error('Failed to toggle publish', err);
         alert('Failed to update article status.');
      }
   };

   const deleteArticle = async (article: Article) => {
      if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
      try {
         await deleteDoc(doc(db, 'articles', article.id));
         setArticles(prev => prev.filter(a => a.id !== article.id));
         logAdminAction(adminEmail, 'Deleted Article', article.title);
      } catch (err) {
         console.error('Failed to delete article', err);
         alert('Failed to delete article.');
      }
   };

   const addTag = () => {
      const t = tagInput.trim().toLowerCase();
      if (t && !form.tags.includes(t)) {
         setForm(prev => ({ ...prev, tags: [...prev.tags, t] }));
      }
      setTagInput('');
   };

   const removeTag = (tag: string) => {
      setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
   };

   if (view === 'editor') {
      return (
         <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <button onClick={() => setView('list')} className="p-2 bg-neutral-100 text-navy-600 rounded-xl hover:bg-neutral-200 transition-colors">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h2 className="text-3xl font-serif font-bold text-navy-900">
                        {editing ? 'Edit Article' : 'New Article'}
                     </h2>
                     <p className="text-sm text-navy-400">Create spiritual content for the community.</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <button
                     onClick={() => setForm(prev => ({ ...prev, status: prev.status === 'draft' ? 'published' : 'draft' }))}
                     className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${form.status === 'published' ? 'border-green-500 bg-green-50 text-green-700' : 'border-navy-100 bg-white text-navy-400'}`}
                  >
                     <GlobeIcon size={14} />
                     {form.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                  <button
                     onClick={saveArticle}
                     disabled={isSaving}
                     className="flex items-center gap-2 px-6 py-3 bg-gold-gradient text-navy-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:scale-105 disabled:opacity-50 transition-all"
                  >
                     {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                     {isSaving ? 'Saving...' : 'Save Article'}
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Main editor */}
               <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 space-y-6">
                     <h3 className="text-sm font-black uppercase text-navy-300 tracking-widest">Content</h3>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Title *</label>
                        <input
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-lg font-serif font-bold focus:border-gold-400 outline-none"
                           placeholder="Article headline..."
                           value={form.title}
                           onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Excerpt / Summary</label>
                        <textarea
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm resize-none h-20 focus:border-gold-400 outline-none"
                           placeholder="Brief summary shown in the article list..."
                           value={form.excerpt}
                           onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Full Content (HTML) *</label>
                        <textarea
                           className="w-full p-4 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-mono h-64 resize-y focus:border-gold-400 outline-none leading-relaxed"
                           placeholder="<p>Start writing your article here...</p>&#10;<p>You can use HTML for formatting.</p>"
                           value={form.content}
                           onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                        />
                        <p className="text-[10px] text-navy-400">Supports HTML: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;</p>
                     </div>
                  </Card>
               </div>

               {/* Sidebar */}
               <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                     <h3 className="text-sm font-black uppercase text-navy-300 tracking-widest">Metadata</h3>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Author</label>
                        <input
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold focus:border-gold-400 outline-none"
                           value={form.author}
                           onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                           placeholder="Author name"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Cover Image URL</label>
                        <input
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-400 outline-none"
                           value={form.imageUrl || ''}
                           onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                           placeholder="https://..."
                        />
                        {form.imageUrl && (
                           <img src={form.imageUrl} className="w-full h-24 object-cover rounded-lg border border-navy-50" alt="Cover preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-navy-500 uppercase">Tags</label>
                        <div className="flex gap-2">
                           <input
                              className="flex-grow p-2 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-400 outline-none"
                              placeholder="Add tag..."
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                           />
                           <button onClick={addTag} className="px-3 py-2 bg-navy-900 text-white rounded-xl text-[10px] font-black">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {form.tags.map(t => (
                              <span key={t} className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-[9px] font-black uppercase">
                                 <Tag size={9} /> {t}
                                 <button onClick={() => removeTag(t)} className="ml-1 hover:text-red-500"><X size={10} /></button>
                              </span>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-between py-2 border-t border-navy-50">
                        <div>
                           <p className="text-sm font-bold text-navy-900">Enable Comments</p>
                           <p className="text-[10px] text-navy-400">Allow readers to submit reflections</p>
                        </div>
                        <button
                           onClick={() => setForm(prev => ({ ...prev, commentsEnabled: !prev.commentsEnabled }))}
                           className={`w-12 h-6 rounded-full transition-all relative ${form.commentsEnabled ? 'bg-green-500' : 'bg-neutral-200'}`}
                        >
                           <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.commentsEnabled ? 'left-7' : 'left-0.5'}`} />
                        </button>
                     </div>
                  </Card>

                  {/* Live preview snippet */}
                  {form.content && (
                     <Card className="p-6">
                        <h3 className="text-sm font-black uppercase text-navy-300 tracking-widest mb-4">Content Preview</h3>
                        <div
                           className="prose prose-sm max-w-none text-navy-800 font-serif"
                           dangerouslySetInnerHTML={{ __html: form.content.substring(0, 500) + (form.content.length > 500 ? '...' : '') }}
                        />
                     </Card>
                  )}
               </div>
            </div>
         </div>
      );
   }

   // LIST VIEW
   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Article Manager</h2>
               <p className="text-sm text-navy-400">Create and publish articles for the community.</p>
            </div>
            <div className="flex gap-3">
               <button onClick={loadArticles} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50">
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
               </button>
               <button onClick={openNew} className="flex items-center gap-2 px-6 py-3 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] shadow-md hover:scale-105 transition-all">
                  <Plus size={14} /> New Article
               </button>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-3 gap-4">
            {[
               { label: 'Total', value: articles.length, color: 'text-navy-900' },
               { label: 'Published', value: articles.filter(a => a.status === 'published').length, color: 'text-green-600' },
               { label: 'Drafts', value: articles.filter(a => a.status === 'draft').length, color: 'text-gold-600' },
            ].map(s => (
               <div key={s.label} className="bg-white rounded-2xl p-5 border border-navy-50 shadow-sm">
                  <p className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">{s.label}</p>
               </div>
            ))}
         </div>

         {isLoading ? (
            <Card>
               <div className="p-12 text-center flex items-center justify-center gap-3 text-navy-300">
                  <RefreshCw size={20} className="animate-spin" /><span>Loading articles...</span>
               </div>
            </Card>
         ) : articles.length === 0 ? (
            <Card>
               <div className="p-16 text-center space-y-4">
                  <BookMarked size={48} className="text-navy-200 mx-auto" />
                  <p className="text-navy-400 font-medium">No articles yet.</p>
                  <button onClick={openNew} className="px-6 py-3 bg-navy-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">
                     Create Your First Article
                  </button>
               </div>
            </Card>
         ) : (
            <Card>
               <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-navy-400">
                     <tr>
                        <th className="p-5">Article</th>
                        <th className="p-5">Status</th>
                        <th className="p-5">Tags</th>
                        <th className="p-5">Updated</th>
                        <th className="p-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                     {articles.map(a => (
                        <tr key={a.id} className="hover:bg-neutral-50/50 transition-colors group">
                           <td className="p-5">
                              <div className="flex items-start gap-3">
                                 {a.imageUrl && (
                                    <img src={a.imageUrl} className="w-12 h-12 object-cover rounded-lg border border-navy-50 shrink-0" alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                 )}
                                 <div>
                                    <p className="font-bold text-navy-900 text-sm leading-snug line-clamp-2">{a.title}</p>
                                    <p className="text-[10px] text-navy-400 mt-0.5">{a.author}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="p-5">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-navy-500'}`}>
                                 {a.status}
                              </span>
                           </td>
                           <td className="p-5">
                              <div className="flex flex-wrap gap-1">
                                 {a.tags.slice(0, 2).map(t => (
                                    <span key={t} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold">{t}</span>
                                 ))}
                                 {a.tags.length > 2 && <span className="text-[9px] text-navy-400">+{a.tags.length - 2}</span>}
                              </div>
                           </td>
                           <td className="p-5 text-[10px] text-navy-400">{new Date(a.updatedAt).toLocaleDateString()}</td>
                           <td className="p-5 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => openEdit(a)} title="Edit" aria-label="Edit Article" className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                    <Edit3 size={18} />
                                 </button>
                                 <button
                                    onClick={() => togglePublish(a)}
                                    title={a.status === 'published' ? 'Unpublish' : 'Publish'}
                                    aria-label={a.status === 'published' ? 'Unpublish' : 'Publish'}
                                    className={`p-3 rounded-lg ${a.status === 'published' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                 >
                                    <GlobeIcon size={18} />
                                 </button>
                                 <button onClick={() => deleteArticle(a)} title="Delete" aria-label="Delete Article" className="p-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </Card>
         )}
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

// 12. PUSH NOTIFICATIONS MANAGER
const PushNotificationManager = ({ adminEmail }: { adminEmail: string }) => {
   const [title, setTitle] = useState('');
   const [body, setBody] = useState('');
   const [target, setTarget] = useState<'all' | 'state' | 'centre'>('all');
   const [selectedRegion, setSelectedRegion] = useState('');
   const [schedule, setSchedule] = useState<'now' | 'later'>('now');
   const [scheduleTime, setScheduleTime] = useState('');
   const [history, setHistory] = useState<any[]>([]);

   useEffect(() => {
      const saved = JSON.parse(localStorage.getItem('sms_push_history') || '[]');
      setHistory(saved);
   }, []);

   const handleSend = () => {
      if (!title || !body) {
         alert('Please provide a title and body for the notification.');
         return;
      }

      // Simulate sending via Cloud Function
      const logEntry = {
         id: `push-${Date.now()}`,
         title,
         body,
         target,
         region: target !== 'all' ? selectedRegion : 'N/A',
         status: schedule === 'now' ? 'Sent' : 'Scheduled',
         timestamp: schedule === 'later' && scheduleTime ? new Date(scheduleTime).toISOString() : new Date().toISOString()
      };

      const newHistory = [logEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem('sms_push_history', JSON.stringify(newHistory));
      logAdminAction(adminEmail, 'Dispatched Push Notification', title);

      setTitle('');
      setBody('');
      setTarget('all');
      setSelectedRegion('');
      setSchedule('now');

      alert(schedule === 'now' ? 'Push Notification Dispatched!' : 'Push Notification Scheduled!');
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Push Notifications</h2>
               <p className="text-sm text-navy-400">Compose and send push alerts via FCM.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 space-y-6">
               <h3 className="text-lg font-bold text-navy-900 border-b border-navy-50 pb-4">Compose Message</h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Notification Title</label>
                     <input
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm font-bold focus:border-gold-500 outline-none"
                        placeholder="e.g. New Live Session Starting!"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-1 block">Message Body</label>
                     <textarea
                        className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm h-32 resize-none focus:border-gold-500 outline-none"
                        placeholder="Details of the announcement..."
                        value={body}
                        onChange={e => setBody(e.target.value)}
                     />
                  </div>

                  <div className="pt-4 border-t border-navy-50">
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-2 block">Target Audience</label>
                     <div className="flex gap-2 mb-4">
                        {['all', 'state', 'centre'].map(t => (
                           <button
                              key={t}
                              onClick={() => setTarget(t as any)}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${target === t ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-400 border-navy-100 hover:bg-neutral-50'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                     {target !== 'all' && (
                        <input
                           className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-500 outline-none"
                           placeholder={target === 'state' ? "Enter State (e.g. Selangor)" : "Enter Centre Name"}
                           value={selectedRegion}
                           onChange={e => setSelectedRegion(e.target.value)}
                        />
                     )}
                  </div>

                  <div className="pt-4 border-t border-navy-50">
                     <label className="text-[10px] font-black uppercase text-navy-300 mb-2 block">Delivery Schedule</label>
                     <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-2 text-sm text-navy-700">
                           <input type="radio" checked={schedule === 'now'} onChange={() => setSchedule('now')} />
                           Send Immediately
                        </label>
                        <label className="flex items-center gap-2 text-sm text-navy-700">
                           <input type="radio" checked={schedule === 'later'} onChange={() => setSchedule('later')} />
                           Schedule for later
                        </label>
                     </div>
                     {schedule === 'later' && (
                        <div className="mt-4">
                           <input
                              type="datetime-local"
                              className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-500 outline-none"
                              value={scheduleTime}
                              onChange={e => setScheduleTime(e.target.value)}
                           />
                        </div>
                     )}
                  </div>

                  <button onClick={handleSend} className="w-full py-4 bg-navy-900 text-gold-500 font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-navy-800 transition-all flex items-center justify-center gap-2 mt-4">
                     <SendIcon size={16} /> {schedule === 'now' ? 'Dispatch Push Notification' : 'Schedule Notification'}
                  </button>
                  <p className="text-[9px] text-navy-300 text-center italic mt-2">Note: This dispatches to user devices via Cloud Messaging.</p>
               </div>
            </Card>

            <Card className="p-8">
               <h3 className="text-lg font-bold text-navy-900 border-b border-navy-50 pb-4 mb-4">Notification History</h3>
               <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {history.length === 0 ? (
                     <p className="text-navy-300 text-sm italic py-8 text-center">No notifications sent yet.</p>
                  ) : (
                     history.map(item => (
                        <div key={item.id} className="p-4 bg-neutral-50 rounded-xl border border-navy-50">
                           <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${item.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                 {item.status} ({item.target})
                              </span>
                              <span className="text-[10px] text-navy-400 font-medium">
                                 {new Date(item.timestamp).toLocaleString()}
                              </span>
                           </div>
                           <h4 className="font-bold text-navy-900 text-sm">{item.title}</h4>
                           <p className="text-xs text-navy-500 mt-1 line-clamp-2">{item.body}</p>
                           {item.target !== 'all' && <p className="text-[10px] font-bold text-purple-600 mt-2">Targeted: {item.region}</p>}
                        </div>
                     ))
                  )}
               </div>
            </Card>
         </div>
      </div>
   );
};

// 20. LEADERBOARD MANAGER
const LeaderboardManager = ({ adminEmail }: { adminEmail: string }) => {
   const [rollupStatus, setRollupStatus] = useState<string | null>(null);
   const [isGenerating, setIsGenerating] = useState(false);
   const [lastUpdated, setLastUpdated] = useState<string | null>(null);

   const loadStatus = async () => {
      try {
         const mytDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
         const todayStr = mytDate.toISOString().split('T')[0];
         const docRef = doc(db, 'rollups', todayStr);
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            setRollupStatus('Active');
            setLastUpdated(docSnap.data().lastUpdated || 'Unknown');
         } else {
            setRollupStatus('Missing');
            setLastUpdated(null);
         }
      } catch (e) {
         console.error(e);
         setRollupStatus('Error');
      }
   };

   useEffect(() => {
      loadStatus();
   }, []);

   const generateRollup = async () => {
      if (!window.confirm("This will aggregate all users and update today's live leaderboard. Continue?")) return;
      setIsGenerating(true);
      try {
         // Query all users
         const usersRef = collection(db, 'users');
         const q = query(usersRef, where('publicLeaderboard', '!=', false));
         const usersSnap = await getDocs(q);

         // Aggregate
         const centreCounts: Record<string, { count: number; state: string }> = {};
         const stateCounts: Record<string, number> = {};
         const members: any[] = [];

         usersSnap.docs.forEach(doc => {
            const data = doc.data();
            const total = (data.stats?.gayathri || 0) + (data.stats?.saiGayathri || 0) + (data.stats?.mantras || 0) + ((data.stats?.likitha || 0) * 11);

            if (total > 0) {
               members.push({
                  uid: doc.id,
                  name: data.name || 'Anonymous Devotee',
                  centre: data.centre || 'Unknown Centre',
                  state: data.state || 'Unknown State',
                  count: total,
                  photoURL: data.photoURL,
                  gender: data.gender || 'male'
               });

               const state = data.state || 'Unknown State';
               stateCounts[state] = (stateCounts[state] || 0) + total;

               const centre = data.centre || 'Unknown Centre';
               if (!centreCounts[centre]) centreCounts[centre] = { count: 0, state: state };
               centreCounts[centre].count += total;
            }
         });

         members.sort((a, b) => b.count - a.count);
         const topMembers = members.slice(0, 50);

         // Write to rollups collection
         const mytDate = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
         const todayStr = mytDate.toISOString().split('T')[0];

         await setDoc(doc(db, 'rollups', todayStr), {
            byCentre: centreCounts,
            byState: stateCounts,
            byMember: topMembers,
            lastUpdated: new Date().toISOString()
         });

         logAdminAction(adminEmail, 'Generated Leaderboard Rollup', todayStr);
         await loadStatus();
         alert("Leaderboard successfully updated!");
      } catch (e: any) {
         console.error(e);
         alert("Aggregation failed: " + e.message);
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Leaderboard Control</h2>
               <p className="text-sm text-navy-400">Manage daily aggregations for the public timeline.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
               <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                  <Database size={20} className="text-gold-500" /> Today's Rollup Status
               </h3>

               <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${rollupStatus === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                     {rollupStatus === 'Active' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                  </div>
                  <div>
                     <p className="font-bold text-navy-900 text-lg">{rollupStatus || 'Checking...'}</p>
                     {lastUpdated && <p className="text-xs text-navy-400">Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>}
                  </div>
               </div>

               <button
                  onClick={generateRollup}
                  disabled={isGenerating}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gold-500 transition-colors disabled:opacity-50"
               >
                  {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <PlayCircle size={16} />}
                  {isGenerating ? 'Aggregating...' : 'Force Generate Now'}
               </button>
               <p className="text-[10px] text-navy-400 mt-4 text-center">Run this to immediately push live stats to the homepage leaderboard.</p>
            </Card>
         </div>
      </div>
   );
};

// --- NAMASMARANA MANAGER ---
const NamasmaranaManager = ({ adminEmail }: { adminEmail: string }) => {
   const [users, setUsers] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchQ, setSearchQ] = useState('');
   const [groupBy, setGroupBy] = useState<'members' | 'state' | 'centre'>('members');

   const load = async () => {
      setIsLoading(true);
      try {
         const snap = await getDocs(collection(db, 'users'));
         const list: any[] = [];
         snap.forEach(doc => {
            const d = doc.data();
            const stats = d.stats || {};
            const total = (stats.gayathri || 0) + (stats.saiGayathri || 0) + ((stats.likitha || 0) * 11);
            if (total > 0 || d.name) {
               list.push({
                  uid: doc.id,
                  name: d.name || 'Unknown',
                  state: d.state || 'Unknown',
                  centre: d.centre || 'Unknown',
                  gayathri: stats.gayathri || 0,
                  saiGayathri: stats.saiGayathri || 0,
                  likitha: stats.likitha || 0,
                  total,
               });
            }
         });
         list.sort((a, b) => b.total - a.total);
         setUsers(list);
      } catch (e) {
         console.error(e);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { load(); }, []);

   const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      u.state.toLowerCase().includes(searchQ.toLowerCase()) ||
      u.centre.toLowerCase().includes(searchQ.toLowerCase())
   );

   const grandTotal = users.reduce((acc, u) => acc + u.total, 0);

   // Group summaries
   const byState: Record<string, number> = {};
   const byCentre: Record<string, number> = {};
   users.forEach(u => {
      byState[u.state] = (byState[u.state] || 0) + u.total;
      byCentre[u.centre] = (byCentre[u.centre] || 0) + u.total;
   });
   const stateRows = Object.entries(byState).sort((a, b) => b[1] - a[1]);
   const centreRows = Object.entries(byCentre).sort((a, b) => b[1] - a[1]);

   const exportCSV = () => {
      const csv = Papa.unparse(filtered.map(u => ({
         Name: u.name, State: u.state, Centre: u.centre,
         Gayathri: u.gayathri, 'Sai Gayathri': u.saiGayathri, 'Likitha Units': u.likitha,
         'Total Chants': u.total
      })));
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'namasmarana_data.csv'; a.click();
      logAdminAction(adminEmail, 'Exported Namasmarana CSV', `${filtered.length} records`);
   };

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Namasmarana Manager</h2>
               <p className="text-sm text-navy-400">National chant submission analytics and management.</p>
            </div>
            <div className="flex gap-3">
               <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors">
                  <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
               </button>
               <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-navy-900 rounded-xl font-black uppercase text-[10px] tracking-widest">
                  <Download size={14} /> Export CSV
               </button>
            </div>
         </div>

         {/* Grand Total */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
               { label: 'Grand Total Chants', value: grandTotal.toLocaleString(), color: 'text-gold-600' },
               { label: 'Total Members', value: users.length, color: 'text-navy-900' },
               { label: 'States Active', value: stateRows.filter(s => s[1] > 0).length, color: 'text-blue-600' },
               { label: 'Centres Active', value: centreRows.filter(c => c[1] > 0).length, color: 'text-purple-600' },
            ].map(item => (
               <Card key={item.label} className="p-6 text-center">
                  <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest mt-1">{item.label}</p>
               </Card>
            ))}
         </div>

         {/* View Toggle */}
         <div className="flex gap-2">
            {(['members', 'state', 'centre'] as const).map(g => (
               <button key={g} onClick={() => setGroupBy(g)} className={`px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${groupBy === g ? 'bg-navy-900 text-gold-500 shadow-lg' : 'bg-white text-navy-400 border border-navy-100 hover:bg-neutral-50'}`}>
                  By {g}
               </button>
            ))}
         </div>

         {groupBy === 'members' && (
            <Card>
               <div className="p-6 border-b border-navy-50">
                  <div className="relative">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300" />
                     <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search by name, state or centre..." className="w-full pl-12 pr-4 py-3 bg-neutral-50 rounded-xl border border-navy-50 text-sm focus:border-gold-500 outline-none" />
                  </div>
               </div>
               {isLoading ? (
                  <div className="p-12 text-center flex items-center justify-center gap-3 text-navy-300"><RefreshCw size={20} className="animate-spin" /><span>Loading...</span></div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                        <thead><tr className="border-b border-navy-50 bg-neutral-50 text-[10px] uppercase tracking-widest font-black text-navy-400">
                           <th className="text-left p-4">Rank</th>
                           <th className="text-left p-4">Member</th>
                           <th className="text-left p-4 hidden md:table-cell">State</th>
                           <th className="text-right p-4">Gayathri</th>
                           <th className="text-right p-4 hidden md:table-cell">S.S. Gayathri</th>
                           <th className="text-right p-4 hidden md:table-cell">Likitha</th>
                           <th className="text-right p-4 font-black">Total</th>
                        </tr></thead>
                        <tbody>
                           {filtered.map((u, i) => (
                              <tr key={u.uid} className={`border-b border-navy-50 hover:bg-neutral-50 transition-colors ${i < 3 ? 'bg-gold-50/30' : ''}`}>
                                 <td className="p-4 font-black text-navy-400 text-center">#{i + 1}</td>
                                 <td className="p-4"><p className="font-bold text-navy-900">{u.name}</p><p className="text-[10px] text-navy-400 truncate max-w-[150px]">{u.centre}</p></td>
                                 <td className="p-4 hidden md:table-cell text-navy-600 text-xs">{u.state}</td>
                                 <td className="p-4 text-right text-navy-700">{u.gayathri.toLocaleString()}</td>
                                 <td className="p-4 text-right text-navy-700 hidden md:table-cell">{u.saiGayathri.toLocaleString()}</td>
                                 <td className="p-4 text-right text-navy-700 hidden md:table-cell">{u.likitha.toLocaleString()}</td>
                                 <td className="p-4 text-right font-black text-gold-600">{u.total.toLocaleString()}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </Card>
         )}

         {groupBy === 'state' && (
            <Card>
               <div className="divide-y divide-navy-50">
                  {stateRows.map(([state, count], i) => (
                     <div key={state} className="flex items-center justify-between p-5 hover:bg-neutral-50">
                        <div className="flex items-center gap-4">
                           <span className="w-7 text-center font-black text-navy-300 text-xs">#{i + 1}</span>
                           <span className="font-bold text-navy-900">{state}</span>
                        </div>
                        <span className="font-black text-gold-600">{count.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
            </Card>
         )}

         {groupBy === 'centre' && (
            <Card>
               <div className="divide-y divide-navy-50">
                  {centreRows.map(([centre, count], i) => (
                     <div key={centre} className="flex items-center justify-between p-5 hover:bg-neutral-50">
                        <div className="flex items-center gap-4">
                           <span className="w-7 text-center font-black text-navy-300 text-xs">#{i + 1}</span>
                           <span className="font-bold text-navy-900 text-sm">{centre}</span>
                        </div>
                        <span className="font-black text-gold-600">{count.toLocaleString()}</span>
                     </div>
                  ))}
               </div>
            </Card>
         )}
      </div>
   );
};

// --- JOURNAL MANAGER ---
const JournalManager = ({ adminEmail }: { adminEmail: string }) => {
   const [entries, setEntries] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState<'all' | 'private' | 'shared'>('all');

   const load = async () => {
      setIsLoading(true);
      try {
         const snap = await getDocs(query(collection(db, 'journal'), orderBy('createdAt', 'desc')));
         setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
         console.error('Journal load error:', e);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { load(); }, []);

   const deleteEntry = async (id: string) => {
      if (!window.confirm('Permanently delete this journal entry?')) return;
      try {
         await deleteDoc(doc(db, 'journal', id));
         setEntries(prev => prev.filter(e => e.id !== id));
         logAdminAction(adminEmail, 'Deleted Journal Entry', id);
      } catch (e) { console.error(e); }
   };

   const filtered = entries.filter(e => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'shared') return e.isShared || e.visibility === 'shared';
      return !e.isShared && e.visibility !== 'shared';
   });

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Journal Manager</h2>
               <p className="text-sm text-navy-400">View and moderate user spiritual journal entries.</p>
            </div>
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors">
               <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
         </div>

         <div className="grid grid-cols-3 gap-4">
            {(['all', 'shared', 'private'] as const).map(s => (
               <button key={s} onClick={() => setStatusFilter(s)} className={`p-4 rounded-2xl border-2 text-center transition-all ${statusFilter === s ? 'bg-navy-900 text-white border-navy-900 shadow-lg' : 'bg-white border-navy-50 hover:border-navy-200'}`}>
                  <p className={`text-2xl font-black ${statusFilter === s ? 'text-gold-400' : 'text-navy-900'}`}>
                     {s === 'all' ? entries.length : s === 'shared' ? entries.filter(e => e.isShared || e.visibility === 'shared').length : entries.filter(e => !e.isShared && e.visibility !== 'shared').length}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === s ? 'text-white/70' : 'text-navy-400'}`}>{s}</p>
               </button>
            ))}
         </div>

         <Card>
            {isLoading ? (
               <div className="p-12 text-center flex items-center justify-center gap-3 text-navy-300"><RefreshCw size={20} className="animate-spin" /><span>Loading journal entries...</span></div>
            ) : filtered.length === 0 ? (
               <div className="p-16 text-center text-navy-300 italic">No journal entries found.</div>
            ) : (
               <div className="divide-y divide-navy-50">
                  {filtered.map(entry => (
                     <div key={entry.id} className="p-6 flex flex-col md:flex-row gap-4 group">
                        <div className="shrink-0 space-y-1 md:w-44">
                           <p className="font-bold text-navy-900 text-sm">{entry.userName || 'Anonymous'}</p>
                           <p className="text-[10px] text-navy-400">{entry.createdAt?.toDate ? new Date(entry.createdAt.toDate()).toLocaleDateString() : 'Unknown'}</p>
                           <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${entry.isShared ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-navy-500'}`}>
                              {entry.isShared ? 'Shared' : 'Private'}
                           </span>
                           {entry.mood && <span className="block text-[10px] text-purple-600 font-bold">{entry.mood}</span>}
                        </div>
                        <div className="flex-grow">
                           {entry.title && <p className="font-bold text-navy-900 mb-2">{entry.title}</p>}
                           <p className="text-sm text-navy-700 leading-relaxed line-clamp-4 bg-neutral-50 rounded-xl p-4 border border-navy-50 italic">"{entry.content || entry.text || 'No content'}"</p>
                        </div>
                        <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                           <button onClick={() => deleteEntry(entry.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-100">
                              <Trash2 size={12} /> Delete
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </Card>
      </div>
   );
};

// --- GAMES MANAGER ---
const GamesManager = ({ adminEmail }: { adminEmail: string }) => {
   const [scores, setScores] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   const load = async () => {
      setIsLoading(true);
      try {
         const snap = await getDocs(query(collection(db, 'gameScores'), orderBy('score', 'desc')));
         setScores(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
         // gameScores collection may not exist yet — graceful fallback
         console.warn('gameScores collection not found yet:', e);
         setScores([]);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { load(); }, []);

   const totalGames = scores.length;
   const avgScore = totalGames > 0 ? Math.round(scores.reduce((a, s) => a + (s.score || 0), 0) / totalGames) : 0;
   const perfectScores = scores.filter(s => s.score >= 100).length;

   return (
      <div className="space-y-8 animate-in fade-in">
         <div className="flex justify-between items-end">
            <div>
               <h2 className="text-3xl font-serif font-bold text-navy-900">Games Manager</h2>
               <p className="text-sm text-navy-400">Monitor the Play It game scores and player activity.</p>
            </div>
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-navy-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-colors">
               <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
         </div>

         <div className="grid grid-cols-3 gap-4">
            {[
               { label: 'Total Games Played', value: totalGames, color: 'text-navy-900' },
               { label: 'Avg Score', value: `${avgScore}%`, color: 'text-gold-600' },
               { label: 'Perfect Scores', value: perfectScores, color: 'text-green-600' },
            ].map(item => (
               <Card key={item.label} className="p-6 text-center">
                  <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest mt-1">{item.label}</p>
               </Card>
            ))}
         </div>

         <Card>
            {isLoading ? (
               <div className="p-12 text-center flex items-center justify-center gap-3 text-navy-300"><RefreshCw size={20} className="animate-spin" /><span>Loading game data...</span></div>
            ) : scores.length === 0 ? (
               <div className="p-16 text-center text-navy-300">
                  <Gamepad2 size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="italic">No game scores recorded yet. Play It scores will appear here as users play.</p>
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead><tr className="border-b border-navy-50 bg-neutral-50 text-[10px] uppercase tracking-widest font-black text-navy-400">
                        <th className="text-left p-4">Rank</th>
                        <th className="text-left p-4">Player</th>
                        <th className="text-left p-4">Game</th>
                        <th className="text-right p-4">Score</th>
                        <th className="text-right p-4">Date</th>
                     </tr></thead>
                     <tbody>
                        {scores.map((s, i) => (
                           <tr key={s.id} className="border-b border-navy-50 hover:bg-neutral-50 transition-colors">
                              <td className="p-4 font-black text-navy-400 text-center">#{i + 1}</td>
                              <td className="p-4 font-bold text-navy-900">{s.userName || 'Anonymous'}</td>
                              <td className="p-4 text-navy-600 text-xs">{s.gameName || 'Quiz'}</td>
                              <td className="p-4 text-right font-black text-gold-600">{s.score}%</td>
                              <td className="p-4 text-right text-[10px] text-navy-400">{s.createdAt?.toDate ? new Date(s.createdAt.toDate()).toLocaleDateString() : '-'}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
         </Card>
      </div>
   );
};

// --- MAIN PAGE ---

const AdminPage: React.FC<{ user: UserProfile | null }> = ({ user }) => {
   // Force password on every page LOAD — clear any existing session on mount
   const [isLocked, setIsLocked] = useState(true);
   const [password, setPassword] = useState('');
   const [loginError, setLoginError] = useState('');
   const [activeModule, setActiveModule] = useState('comms');
   const navigate = useNavigate();

   // Clear admin session on unmount (navigating away requires re-auth on return)
   useEffect(() => {
      return () => {
         sessionStorage.removeItem('sms_admin_session');
      };
   }, []);

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
      setLoginError('');
      if (password === ADMIN_CONFIG.MASTER_PASSWORD) {
         setIsLocked(false);
         sessionStorage.setItem('sms_admin_session', 'active');
         logAdminAction(user?.email || 'system', 'Admin Logged In', 'Hub Access');
      } else {
         setLoginError('Incorrect master password. Please try again.');
         setPassword('');
      }
   };

   const handleLogout = () => {
      sessionStorage.removeItem('sms_admin_session');
      setIsLocked(true);
      navigate('/');
   };

   if (isLocked) {
      return (
         <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-navy-50 animate-in zoom-in-95 duration-300">
               <div className="w-24 h-24 bg-navy-900 rounded-[2rem] mx-auto flex items-center justify-center text-gold-500 shadow-xl mb-10">
                  <ShieldCheck size={48} />
               </div>
               <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2">National Command</h1>
               <p className="text-xs text-navy-300 font-bold uppercase tracking-widest mb-1">SSIOM Spiritual Infrastructure</p>
               <p className="text-[10px] text-navy-200 mb-10">Authorized personnel only. Enter the master password to continue.</p>
               <form onSubmit={handleUnlock} className="space-y-4">
                  <input
                     type="password"
                     required
                     autoFocus
                     className="w-full p-5 bg-neutral-50 rounded-2xl border-2 border-navy-50 font-black text-center outline-none focus:border-gold-500 transition-colors"
                     placeholder="Master Password"
                     value={password}
                     onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  />
                  {loginError && (
                     <p className="text-red-600 text-xs font-bold flex items-center justify-center gap-1">
                        <XCircle size={14} /> {loginError}
                     </p>
                  )}
                  <button type="submit" className="w-full py-5 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all hover:bg-navy-800">
                     Unlock Management Hub
                  </button>
               </form>
               <button onClick={() => navigate('/')} className="mt-8 text-[9px] font-black uppercase text-navy-200 hover:text-navy-900 transition-colors">
                  ← Return to Public Portal
               </button>
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
               <AdminNavItem active={activeModule === 'notifications'} onClick={() => setActiveModule('notifications')} icon={<Bell size={20} />} label="Push Notifications" />
               <AdminNavItem active={activeModule === 'events'} onClick={() => setActiveModule('events')} icon={<Calendar size={20} />} label="Event Manager" />
               <AdminNavItem active={activeModule === 'content'} onClick={() => setActiveModule('content')} icon={<BookOpen size={20} />} label="Content Studio" />
               <AdminNavItem active={activeModule === 'articles'} onClick={() => setActiveModule('articles')} icon={<Newspaper size={20} />} label="Article Manager" />
               <div className="my-4 border-t border-navy-50"></div>
               <h4 className="text-[9px] font-black uppercase text-navy-200 tracking-[0.3em] px-6 mb-4">Registry & Data</h4>
               <AdminNavItem active={activeModule === 'users'} onClick={() => setActiveModule('users')} icon={<Users size={20} />} label="Member Registry" />
               <AdminNavItem active={activeModule === 'namasmarana'} onClick={() => setActiveModule('namasmarana')} icon={<Mic size={20} />} label="Namasmarana" />
               <AdminNavItem active={activeModule === 'reflections'} onClick={() => setActiveModule('reflections')} icon={<Quote size={20} />} label="Reflection Queue" />
               <AdminNavItem active={activeModule === 'article_comments'} onClick={() => setActiveModule('article_comments')} icon={<MessageCircle size={20} />} label="Article Comments" />
               <AdminNavItem active={activeModule === 'journal'} onClick={() => setActiveModule('journal')} icon={<BookOpen size={20} />} label="Journal Entries" />
               <AdminNavItem active={activeModule === 'sadhana'} onClick={() => setActiveModule('sadhana')} icon={<Activity size={20} />} label="Sadhana Analytics" />
               <AdminNavItem active={activeModule === 'bookclub_analytics'} onClick={() => setActiveModule('bookclub_analytics')} icon={<Trophy size={20} />} label="Book Club Analytics" />
               <AdminNavItem active={activeModule === 'games'} onClick={() => setActiveModule('games')} icon={<Gamepad2 size={20} />} label="Games Manager" />
               <div className="my-4 border-t border-navy-50"></div>
               <h4 className="text-[9px] font-black uppercase text-navy-200 tracking-[0.3em] px-6 mb-4">System</h4>
               <AdminNavItem active={activeModule === 'leaderboard'} onClick={() => setActiveModule('leaderboard')} icon={<Target size={20} />} label="Leaderboard Control" />
               <AdminNavItem active={activeModule === 'page_content'} onClick={() => setActiveModule('page_content')} icon={<Type size={20} />} label="Page Text" />
               <AdminNavItem active={activeModule === 'branding'} onClick={() => setActiveModule('branding')} icon={<Layout size={20} />} label="Brand Identity" />
            </aside>

            <main className="flex-grow">
               {activeModule === 'comms' && <CommunicationsManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'page_content' && <PageContentManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'notifications' && <PushNotificationManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'events' && <EventManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'content' && <ContentStudio adminEmail={user?.email || 'admin'} />}
               {activeModule === 'branding' && <BrandingManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'bookclub_analytics' && <BookClubAnalytics />}
               {activeModule === 'users' && <UserRegistry adminEmail={user?.email || 'admin'} />}
               {activeModule === 'namasmarana' && <NamasmaranaManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'reflections' && <ReflectionQueue adminEmail={user?.email || 'admin'} />}
               {activeModule === 'articles' && <ArticleManager adminEmail={user?.email || 'admin'} user={user} />}
               {activeModule === 'article_comments' && <ArticleCommentModeration adminEmail={user?.email || 'admin'} />}
               {activeModule === 'journal' && <JournalManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'sadhana' && <SadhanaAnalytics />}
               {activeModule === 'leaderboard' && <LeaderboardManager adminEmail={user?.email || 'admin'} />}
               {activeModule === 'games' && <GamesManager adminEmail={user?.email || 'admin'} />}
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
