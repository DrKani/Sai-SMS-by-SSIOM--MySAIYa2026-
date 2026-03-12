import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Calendar, ChevronRight, Settings, CheckCircle2, BookOpen, CalendarDays } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from 'recharts';
import { UserProfile } from '../types';
import SaiAvatar from '../components/SaiAvatar';
import ProfileSettingsModal from '../components/ProfileSettingsModal';
import QuoteSlider from '../components/QuoteSlider';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ gayathri: 0, saiGayathri: 0, likitha: 0 });
  const [completions, setCompletions] = useState<string[]>([]);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [badges, setBadges] = useState<{ badgeId: string, unlockedAt: any }[]>([]);

  const loadUserData = async () => {
    const saved = localStorage.getItem('sms_user');
    if (saved) {
      const userData = JSON.parse(saved) as UserProfile;
      setUser(userData);

      if (!userData.isGuest) {
        const localStats = JSON.parse(localStorage.getItem(`sms_stats_${userData.uid}`) || '{"gayathri":0, "saiGayathri":0, "likitha":0, "mantras":0}');
        const fbStats = userData.stats || { gayathri: 0, saiGayathri: 0, likitha: 0, mantras: 0 };
        const mergedStats = {
          gayathri: Math.max(localStats.gayathri || 0, fbStats.gayathri || 0),
          saiGayathri: Math.max(localStats.saiGayathri || 0, fbStats.saiGayathri || 0),
          likitha: Math.max(localStats.likitha || 0, fbStats.likitha || 0),
          mantras: Math.max(localStats.mantras || 0, fbStats.mantras || 0)
        };
        const userCompletions = JSON.parse(localStorage.getItem(`sms_completions`) || '[]');
        setStats(mergedStats);
        setCompletions(userCompletions);

        // Fetch Badges
        const { getDocs, collection, doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        const badgesSnap = await getDocs(collection(db, 'users', userData.uid, 'badges'));
        const earnedBadges = badgesSnap.docs.map(doc => doc.data() as { badgeId: string, unlockedAt: any });
        setBadges(earnedBadges);

        // Fetch Saved Quotes
        const userDocRef = doc(db, 'users', userData.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.savedQuotes && Array.isArray(data.savedQuotes)) {
            setSavedQuotes(data.savedQuotes);
          }
        }
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const daysSinceJoined = user?.joinedAt
    ? Math.max(1, Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 3600 * 24)))
    : 1;

  const totalChants = stats.gayathri + stats.saiGayathri + ((stats as any).mantras || 0) + ((stats.likitha || 0) * 11);
  const chartData = [
    { month: 'Jan', total: Math.floor(totalChants * 0.1) },
    { month: 'Feb', total: Math.floor(totalChants * 0.3) },
    { month: 'Mar', total: Math.floor(totalChants * 0.6) },
    { month: 'Apr', total: totalChants },
  ];

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'long' })
    : 'Recently';

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      {/* Profile Header */}
      <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50 flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="p-1 bg-gold-500 rounded-full shadow-lg">
            <SaiAvatar gender={user?.gender || 'male'} photoURL={user?.photoURL} size={128} />
          </div>
          <div className="absolute bottom-1 right-1 bg-gold-500 p-2 rounded-full border-2 border-white shadow-md">
            <Shield size={16} className="text-navy-900" />
          </div>
        </div>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-serif font-bold text-navy-900 mb-2">
            Sai Ram, {user?.name || 'Devotee'}!
          </h1>
          <p className="text-navy-500 mb-6 italic">
            Devotee since {joinedDate} • {user?.centre || 'General Member'}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-4 py-2 bg-navy-50 text-navy-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-navy-100">
              {user?.isAdmin ? 'Spiritual Admin' : user?.isGuest ? 'Guest Access' : 'Hub Member'}
            </span>
            {!user?.isGuest && (
              <span className="px-4 py-2 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100">
                Spiritual Wing
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-4 bg-neutral-100 text-navy-400 rounded-2xl hover:bg-navy-900 hover:text-white transition-all shadow-sm flex items-center gap-2"
        >
          <Settings size={24} />
          <span className="font-bold text-sm hidden md:inline">Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Personal Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-bento shadow-lg border border-navy-50">
            <h3 className="font-serif text-2xl font-bold mb-8 text-navy-900">Personal Growth Tracking</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" hide />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="gayathri" stroke="#7B2482" fill="#E5D3E6" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-neutral-50 rounded-2xl border border-navy-50">
                <span className="block text-[8px] text-navy-300 font-black uppercase tracking-widest mb-1">Gayathri</span>
                <span className="text-2xl font-black text-navy-900">{stats.gayathri.toLocaleString()}</span>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-2xl border border-navy-50">
                <span className="block text-[8px] text-navy-300 font-black uppercase tracking-widest mb-1">Sai Gayathri</span>
                <span className="text-2xl font-black text-navy-900">{stats.saiGayathri.toLocaleString()}</span>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-2xl border border-navy-50">
                <span className="block text-[8px] text-navy-300 font-black uppercase tracking-widest mb-1">Japam Units</span>
                <span className="text-2xl font-black text-navy-900">{stats.likitha.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Badge Wall */}
          <div className="bg-white p-8 rounded-bento shadow-lg border border-navy-50">
            <h3 className="font-serif text-2xl font-bold mb-8 text-navy-900 flex items-center gap-3">
              <Award className="text-gold-500" /> Sacred Badge Wall
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { id: 'first-offering', name: 'First Offering', icon: '🌟', color: 'bg-orange-100', text: 'Submitted your first sadhana.', fullColor: 'text-orange-600' },
                { id: 'dedicated-devotee', name: 'Dedicated Devotee', icon: '🏆', color: 'bg-slate-100', text: '10,000 Total Mantras.', fullColor: 'text-slate-600' },
                { id: 'spiritual-warrior', name: 'Spiritual Warrior', icon: '💎', color: 'bg-gold-50', text: '50,000 Total Mantras.', fullColor: 'text-gold-600' },
                { id: 'consistent-sadhak', name: 'Consistent Sadhak', icon: '🔥', color: 'bg-red-50', text: 'Maintained a 7-day streak.', fullColor: 'text-red-500' },
                { id: 'marathon-meditator', name: 'Marathon Meditator', icon: '🕉️', color: 'bg-gold-100', text: 'Maintained a 30-day streak.', fullColor: 'text-navy-900' }
              ].map(badge => {
                const isUnlocked = badges.some(b => b.badgeId === badge.id);
                return (
                  <div key={badge.id} className="group relative flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${isUnlocked ? `${badge.color} shadow-lg scale-110` : 'bg-neutral-100 grayscale opacity-40 hover:opacity-100'}`}>
                      {badge.icon}
                    </div>
                    <p className={`mt-3 text-[10px] font-black uppercase tracking-widest text-center leading-tight ${isUnlocked ? 'text-navy-900' : 'text-neutral-300'}`}>
                      {badge.name}
                    </p>

                    {/* Tooltip */}
                    <div className="absolute top-full mt-4 w-40 p-4 bg-navy-900 text-white rounded-xl text-center z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                      <p className="text-[10px] font-black uppercase mb-1">{badge.name}</p>
                      <p className="text-[9px] opacity-70 leading-relaxed uppercase tracking-widest">{badge.text}</p>
                      {isUnlocked && <p className="text-[8px] mt-2 text-gold-500 font-black uppercase">Unlocked</p>}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-900 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-bento shadow-lg border border-navy-50">
            <h3 className="font-serif text-2xl font-bold mb-6 text-navy-900">Milestone Celebrations</h3>
            <div className="space-y-4">
              {stats.gayathri >= 108 && (
                <div className="flex items-center gap-6 p-4 bg-gold-50/30 rounded-2xl border border-gold-100 transition-colors">
                  <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center text-navy-900 shadow-md">
                    <Award size={24} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-navy-900">Sacred 108 Milestone</h4>
                    <p className="text-xs text-navy-400">Completed 108 Gayathri Mantra offerings.</p>
                  </div>
                  <CheckCircle2 size={20} className="text-teal-500" />
                </div>
              )}
              {completions.length > 0 && (
                <div className="flex items-center gap-6 p-4 hover:bg-neutral-50 rounded-2xl transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-navy-900">Consistent Reader</h4>
                    <p className="text-xs text-navy-400">You have completed {completions.length} study plan chapters.</p>
                  </div>
                  <ChevronRight size={20} className="text-navy-200" />
                </div>
              )}
              {stats.likitha > 0 && (
                <div className="flex items-center gap-6 p-4 hover:bg-neutral-50 rounded-2xl transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <Shield size={24} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-navy-900">Likitha Japam Initiate</h4>
                    <p className="text-xs text-navy-400">Recorded {stats.likitha} units of Likitha Japam.</p>
                  </div>
                  <ChevronRight size={20} className="text-navy-200" />
                </div>
              )}
              {(!stats.gayathri && !completions.length && !stats.likitha) && (
                <div className="text-center py-10 opacity-40 italic">
                  <p className="text-sm">No milestones yet. Begin your sadhana journey today!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Goals/Tasks */}
        <div className="space-y-8">
          <div className="bg-navy-900 text-white p-8 rounded-bento shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><Calendar size={120} /></div>
            <h3 className="text-xl font-bold mb-6 text-gold-500 flex items-center gap-2">
              <Calendar size={20} /> Spiritual Goals
            </h3>
            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-white/70">Completion Target</span>
                  <span className="text-gold-500">{completions.length >= 52 ? '100%' : `${Math.floor((completions.length / 52) * 100)}% `}</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full bg-gold-gradient transition-all duration-1000" style={{ width: `${(completions.length / 52) * 100}% ` }}></div>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w - 5 h - 5 rounded border - 2 flex items - center justify - center ${completions.length > 0 ? 'bg-gold-500 border-gold-500 text-navy-900' : 'border-white/20'} `}>
                    {completions.length > 0 && <CheckCircle2 size={12} strokeWidth={4} />}
                  </div>
                  <span className={`text - sm font - medium ${completions.length > 0 ? 'text-navy-100' : 'text-navy-300'} `}>Read first chapter</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${stats.gayathri >= 1000 ? 'bg-gold-500 border-gold-500 text-navy-900' : 'border-white/20'}`}>
                    {stats.gayathri >= 1000 && <CheckCircle2 size={12} strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-medium ${stats.gayathri >= 1000 ? 'text-navy-100' : 'text-navy-300'}`}>1,000 Gayathri chants</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${stats.likitha >= 10 ? 'bg-gold-500 border-gold-500 text-navy-900' : 'border-white/20'}`}>
                    {stats.likitha >= 10 && <CheckCircle2 size={12} strokeWidth={4} />}
                  </div>
                  <span className={`text-sm font-medium ${stats.likitha >= 10 ? 'text-navy-100' : 'text-navy-300'}`}>Complete 10 Japam units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-white p-8 rounded-bento shadow-xl relative overflow-hidden" style={{ background: '#7B2482' }}>
            <div className="absolute -bottom-4 -right-4 opacity-10"><Award size={100} /></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold uppercase tracking-tighter">Engagement Status</h3>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border border-white/20 backdrop-blur">
                <CalendarDays size={14} /> Day {daysSinceJoined}
              </div>
            </div>

            <p className="text-sm opacity-90 leading-relaxed mb-6 font-medium italic">
              {stats.gayathri > 0 || stats.saiGayathri > 0 || stats.likitha > 0
                ? `Swami is pleased with your dedication! You are on Day ${daysSinceJoined} of your spiritual journey.`
                : `Every spiritual journey begins with a single step. Start your Day ${daysSinceJoined} offering today.`}
            </p>
            <Link to="/namasmarana" className="block w-full py-4 bg-white/10 hover:bg-white/20 text-center rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/20">
              Continue Offering
            </Link>
          </div>
        </div>
      </div>

      {/* User Details Display */}
      {user && (user.bio || user.accomplishments || user.phone || user.socialLinks?.facebook) && (
        <div className="bg-white p-10 rounded-bento shadow-xl border border-navy-50 mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-6">About Me</h3>
            {user.bio && (
              <div className="mb-6">
                <p className="text-navy-600 leading-relaxed font-medium italic">"{user.bio}"</p>
              </div>
            )}
            {user.accomplishments && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-navy-300 mb-2">Key Accomplishments in SSIOM</h4>
                <p className="text-sm text-navy-700">{user.accomplishments}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-6">Contact & Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {user.phone && (
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-navy-300">Phone</span>
                  <span className="text-sm font-bold text-navy-800">{user.phone}</span>
                </div>
              )}
              {user.homeAddress && (
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-navy-300">Location</span>
                  <span className="text-sm font-bold text-navy-800">{user.homeAddress}</span>
                </div>
              )}
            </div>

            {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
              <div className="pt-4 border-t border-navy-50">
                <span className="block text-[10px] font-black uppercase tracking-widest text-navy-300 mb-3">Social Links</span>
                <div className="flex gap-4">
                  {user.socialLinks.facebook && <a href={user.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-navy-400 hover:text-gold-500 transition-colors uppercase text-[10px] font-bold">Facebook</a>}
                  {user.socialLinks.twitter && <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-navy-400 hover:text-gold-500 transition-colors uppercase text-[10px] font-bold">X</a>}
                  {user.socialLinks.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-navy-400 hover:text-gold-500 transition-colors uppercase text-[10px] font-bold">LinkedIn</a>}
                  {user.socialLinks.youtube && <a href={user.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-navy-400 hover:text-gold-500 transition-colors uppercase text-[10px] font-bold">YouTube</a>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Quotes Section */}
      {savedQuotes.length > 0 && (
        <div className="mt-12 bg-white p-10 rounded-bento shadow-xl border border-navy-50">
          <h3 className="font-serif text-2xl font-bold text-navy-900 mb-6">My Favourite Sai Quotes</h3>
          {savedQuotes.length > 5 ? (
            <QuoteSlider quotes={savedQuotes} title={`${savedQuotes.length} Saved Favourites`} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedQuotes.map((quote, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-neutral-50 border border-navy-50 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -top-8 text-9xl text-navy-900/5 font-serif font-black pointer-events-none">"</div>
                  <p className="text-navy-900 italic font-serif leading-relaxed relative z-10">"{quote}"</p>
                  <p className="text-xs text-navy-400 font-bold uppercase tracking-widest mt-6 relative z-10">– Sathya Sai Baba</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user && (
        <ProfileSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={user}
          onSave={(updated) => {
            setUser(updated);
            // Re-read stats/completions in case modal changed them
            loadUserData();
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
