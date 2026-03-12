import React, { useState, useEffect } from 'react';
import { X, UserCircle, Loader2, Save, MapPin, Phone, Mail, Link as LinkIcon, Award, User, Home, Building, CheckCircle2, Shield, Camera, Image as ImageIcon } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import { UserProfile } from '../types';
import SaiAvatar from './SaiAvatar';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}

const MALE_AVATARS = [
  '/avatars/SaiSMS2026avatar-1.png',
  '/avatars/SaiSMS2026avatar-Male-alt-1.png',
  '/avatars/SaiSMS2026avatar-Male-alt-2.png',
  '/avatars/SaiSMS2026avatar-Male-alt-3.png',
  '/avatars/SaiSMS2026avatar-Male-alt-4.png',
  '/avatars/SaiSMS2026avatar-Male-alt-5.png'
];

const FEMALE_AVATARS = [
  '/avatars/SaiSMS2026avatar-2.png',
  '/avatars/SaiSMS2026avatar-female-alt-1.png',
  '/avatars/SaiSMS2026avatar-female-alt-2.png',
  '/avatars/SaiSMS2026avatar-female-alt-3png.png',
  '/avatars/SaiSMS2026avatar-female-alt-4.png',
  '/avatars/SaiSMS2026avatar2-female-alt-5.png'
];

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user.name || '',
    photoURL: user.photoURL || '',
    gender: user.gender || 'male',
    state: user.state || '',
    centre: user.centre || '',
    phone: user.phone || '',
    bio: user.bio || '',
    accomplishments: user.accomplishments || '',
    homeAddress: user.homeAddress || '',
    workAddress: user.workAddress || '',
    recoveryEmail: user.recoveryEmail || '',
    socialLinks: {
      facebook: user.socialLinks?.facebook || '',
      twitter: user.socialLinks?.twitter || '',
      linkedin: user.socialLinks?.linkedin || '',
      youtube: user.socialLinks?.youtube || '',
    },
    publicReflections: user.publicReflections ?? true,
    publicLeaderboard: user.publicLeaderboard ?? true
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || '',
        photoURL: user.photoURL || '',
        gender: user.gender || 'male',
        state: user.state || '',
        centre: user.centre || '',
        phone: user.phone || '',
        bio: user.bio || '',
        accomplishments: user.accomplishments || '',
        homeAddress: user.homeAddress || '',
        workAddress: user.workAddress || '',
        recoveryEmail: user.recoveryEmail || '',
        socialLinks: {
          facebook: user.socialLinks?.facebook || '',
          twitter: user.socialLinks?.twitter || '',
          linkedin: user.socialLinks?.linkedin || '',
          youtube: user.socialLinks?.youtube || '',
        },
        publicReflections: user.publicReflections ?? true,
        publicLeaderboard: user.publicLeaderboard ?? true
      });
    }
  }, [isOpen, user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    // Check size < 1MB
    if (file.size > 1024 * 1024) {
      alert("Photo too large! Please use a file smaller than 1MB.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/profiles/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, photoURL: url }));
    } catch (error: any) {
      console.error("Photo upload error", error);
      alert("Failed to upload photo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof UserProfile] }));
  };

  const handleReplayTutorial = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), { onboardedApp: false }, { merge: true });
      const updated = { ...user, onboardedApp: false };
      localStorage.setItem('sms_user', JSON.stringify(updated));
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      alert("Tutorial reset failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    setSaved(false);
    try {
      const updatedUser: UserProfile = { ...user, ...formData } as UserProfile;

      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (formData.name && formData.name !== auth.currentUser.displayName) {
        authUpdates.displayName = formData.name;
      }
      if (formData.photoURL && formData.photoURL !== auth.currentUser.photoURL) {
        authUpdates.photoURL = formData.photoURL;
      }
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(auth.currentUser, authUpdates);
      }

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { ...updatedUser, updatedAt: serverTimestamp() },
        { merge: true }
      );

      localStorage.setItem('sms_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new StorageEvent('storage', { key: 'sms_user' }));

      onSave(updatedUser);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    } catch (error: any) {
      console.error("Error saving profile", error);
      alert(`Failed to save profile: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-poppins">
      <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">

        <div className="p-6 border-b border-navy-50 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-navy-900">Edit Profile</h2>
            <p className="text-xs text-navy-400 font-medium">Update your display information and personal details.</p>
          </div>
          <button onClick={onClose} className="p-2 text-navy-400 hover:text-navy-900 hover:bg-neutral-100 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><User size={14} /> Basic Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Display Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">State / Region</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">SSIOM Centre</label>
                      <input type="text" name="centre" value={formData.centre} onChange={handleChange} className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 outline-none" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><UserCircle size={14} /> Avatar Selection</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 mb-4">
                    <button type="button" onClick={() => setFormData({ ...formData, gender: 'male', photoURL: '' })} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm ${formData.gender === 'male' ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-navy-50 bg-neutral-50 text-navy-500'}`}>Brother</button>
                    <button type="button" onClick={() => setFormData({ ...formData, gender: 'female', photoURL: '' })} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm ${formData.gender === 'female' ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-navy-50 bg-neutral-50 text-navy-500'}`}>Sister</button>
                  </div>
                  <div className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-xl border border-navy-50">
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-4 border-2 border-dashed border-navy-100 rounded-xl flex flex-col items-center justify-center gap-2 text-navy-400 hover:border-gold-500 hover:text-gold-600 transition-all hover:bg-gold-50/30 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload Custom Photo'}</span>
                    </button>

                    <div className="grid grid-cols-4 gap-3">
                      {auth.currentUser?.photoURL && !auth.currentUser.photoURL.includes('avatars/') && (
                        <button type="button" onClick={() => setFormData({ ...formData, photoURL: auth.currentUser?.photoURL || '' })} className={`relative group transition-all duration-300 rounded-full aspect-square ${formData.photoURL === auth.currentUser.photoURL ? 'ring-4 ring-gold-500 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105 border border-navy-100'}`} title="Google Profile Picture">
                          <img src={auth.currentUser.photoURL} alt="Google" className="w-full h-full rounded-full object-cover" />
                        </button>
                      )}
                      {(formData.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS).map((url, idx) => (
                        <button key={idx} type="button" onClick={() => setFormData({ ...formData, photoURL: url })} className={`relative group transition-all duration-300 rounded-full aspect-square ${formData.photoURL === url ? 'ring-4 ring-gold-500 scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105 border border-navy-100'}`}>
                          <img src={url} alt={`Avatar ${idx}`} className="w-full h-full rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><Phone size={14} /> Contact Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Phone / WhatsApp Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+60 12-345 6789" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Recovery Email</label>
                    <input type="email" name="recoveryEmail" value={formData.recoveryEmail} onChange={handleChange} placeholder="alternate@email.com" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 outline-none" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><Award size={14} /> About Me</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Short Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="I am..." className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-medium text-navy-900 focus:border-gold-500 outline-none h-24 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">Key Accomplishments</label>
                    <textarea name="accomplishments" value={formData.accomplishments} onChange={handleChange} placeholder="Share your milestones..." className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 font-medium text-navy-900 focus:border-gold-500 outline-none h-20 resize-none"></textarea>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><Shield size={14} /> Privacy & Settings</h3>
                <div className="space-y-4 bg-neutral-50 p-6 rounded-2xl border border-navy-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-navy-900">Public Reflections</p>
                      <p className="text-[10px] text-navy-400">Allow shared reflections to be seen by others.</p>
                    </div>
                    <button onClick={() => handleToggle('publicReflections')} className={`w-12 h-6 rounded-full transition-all relative ${formData.publicReflections ? 'bg-teal-500' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.publicReflections ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-navy-100/50">
                    <div>
                      <p className="text-sm font-bold text-navy-900">National Leaderboard</p>
                      <p className="text-[10px] text-navy-400">Show name in national participant list.</p>
                    </div>
                    <button onClick={() => handleToggle('publicLeaderboard')} className={`w-12 h-6 rounded-full transition-all relative ${formData.publicLeaderboard ? 'bg-teal-500' : 'bg-neutral-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.publicLeaderboard ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="pt-4 mt-2 border-t border-navy-100">
                    <button onClick={handleReplayTutorial} className="w-full py-3 bg-white text-navy-900 border border-navy-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-50 transition-colors">
                      Replay App Tutorial (Onboarding)
                    </button>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy-300 mb-4 flex items-center gap-2"><LinkIcon size={14} /> Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="url" name="facebook" value={formData.socialLinks?.facebook} onChange={handleSocialChange} placeholder="Facebook URL" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-xs text-navy-900 focus:border-gold-500 outline-none" />
                  <input type="url" name="twitter" value={formData.socialLinks?.twitter} onChange={handleSocialChange} placeholder="Twitter URL" className="w-full p-3 bg-neutral-50 rounded-xl border border-navy-50 text-xs text-navy-900 focus:border-gold-500 outline-none" />
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-navy-50 bg-neutral-50 flex justify-end gap-4 rounded-b-3xl">
          <button onClick={onClose} disabled={loading || saved} className="px-6 py-3 rounded-xl font-bold text-navy-500 hover:bg-navy-100 transition-colors uppercase text-xs tracking-widest disabled:opacity-50">Cancel</button>
          <button onClick={handleSave} disabled={loading || saved} className={`px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2 uppercase text-xs tracking-widest disabled:cursor-not-allowed ${saved ? 'bg-green-500 text-white opacity-100' : 'bg-gold-gradient text-navy-900 disabled:opacity-50'}`}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
