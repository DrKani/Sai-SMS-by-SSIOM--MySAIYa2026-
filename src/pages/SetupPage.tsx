
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { APP_CONFIG } from '../constants';
import { DETAILED_STATE_CENTRE_MAP } from '../constants/registry';
import { hasCompletedOnboarding, upsertMemberProfile } from '../services/memberService';
import {
    UserCircle,
    MapPin,
    Building2,
    ArrowRight,
    Loader2,
    Info
} from 'lucide-react';
import SaiAvatar from '../components/SaiAvatar';

const SetupPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: auth.currentUser?.displayName || '',
        gender: '' as 'male' | 'female' | '',
        photoURL: '', // will be set when avatar is picked
        state: '',
        centre: '',
        otherRegion: '',
        otherCentreName: '',
        phone: ''
    });

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

    useEffect(() => {
        // Redirect if not logged in
        if (!auth.currentUser) {
            navigate('/signin');
            return;
        }

        // Check if already onboarded (double check)
        const checkOnboarding = async () => {
            if (!auth.currentUser) return;
            const isOnboarded = await hasCompletedOnboarding(auth.currentUser.uid);
            if (isOnboarded) {
                navigate('/dashboard');
            }
        };
        checkOnboarding();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        // Validate inputs
        if (!formData.gender) {
            alert("Please select whether you are a Brother or Sister.");
            return;
        }
        if (!formData.photoURL) {
            alert("Please select a profile avatar.");
            return;
        }
        if (!formData.displayName || formData.displayName.trim().length < 3) {
            alert("Please enter your full name (at least 3 characters).");
            return;
        }
        if (!formData.state) {
            alert("Please select your region.");
            return;
        }
        if (formData.state === 'Other' && !formData.otherRegion) {
            alert("Please specifiy your region/state.");
            return;
        }

        // Determine final/saved state value
        let finalState = formData.state;
        if (formData.state === 'Other') {
            finalState = formData.otherRegion;
        }

        // Determine final/saved centre value
        let finalCentre = formData.centre;
        if (formData.centre === 'Others' || formData.centre === '' || formData.state === 'Other') {
            if (!formData.otherCentreName) {
                alert("Please specify the name of your locality or centre.");
                return;
            }
            finalCentre = formData.otherCentreName;
        }

        setLoading(true);

        try {
            // 1. Update Auth Profile
            if (auth.currentUser.displayName !== formData.displayName) {
                await updateProfile(auth.currentUser, {
                    displayName: formData.displayName
                });
            }

            // 2. Create User Profile in Firestore
            const userProfile: UserProfile = {
                uid: auth.currentUser.uid,
                name: formData.displayName,
                email: auth.currentUser.email || '',
                gender: formData.gender as 'male' | 'female',
                state: finalState,
                centre: finalCentre,
                phone: formData.phone || '',
                photoURL: formData.photoURL || auth.currentUser.photoURL || APP_CONFIG.AVATAR_MALE,
                joinedAt: new Date().toISOString(),
                isGuest: false,
                isAdmin: false,
                onboardingDone: true
            };

            // 3. Write to Firestore - MERGE
            await upsertMemberProfile(auth.currentUser.uid, userProfile);

            // 3b. Write to Member Registry (deduplicate by email)
            try {
                const emailStr = auth.currentUser.email || '';
                const emailId = emailStr ? emailStr.toLowerCase().replace(/[^a-z0-9@.-]/g, '') : auth.currentUser.uid;
                await setDoc(doc(db, 'memberRegistry', emailId), {
                    'Name': formData.displayName,
                    'State': finalState,
                    'Centre affiliation': finalCentre,
                    'Email': emailStr,
                    'Registration Date': new Date().toISOString(),
                    'User ID': auth.currentUser.uid
                }, { merge: true });
            } catch (err) {
                console.warn("[SetupPage] Failed to write to Member Registry:", err);
            }

            // 4. Update local storage cache
            localStorage.setItem('sms_user', JSON.stringify(userProfile));

            // 5. Success & Redirect
            sessionStorage.setItem('sms_show_welcome', 'new_user');
            window.location.hash = '/dashboard';
            window.location.reload();

        } catch (error: any) {
            console.error("Setup failed:", error);
            console.error("Error code:", error?.code);
            console.error("Error message:", error?.message);

            let errorMessage = "Failed to save profile. Please try again.";

            if (error?.code === 'permission-denied') {
                errorMessage = "Permission denied. Please sign out and sign in again.";
            } else if (error?.code === 'unavailable') {
                errorMessage = "Network error. Please check your internet connection.";
            } else if (error?.message) {
                errorMessage = `Error: ${error.message}`;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const availableCentres = formData.state ? DETAILED_STATE_CENTRE_MAP[formData.state] || [] : [];

    // Logic to show "Others" input: if "Others" is selected OR state is "Other"
    const showOtherCentreInput = formData.centre === 'Others' || formData.state === 'Other';

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-poppins">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-navy-50 animate-in fade-in slide-in-from-bottom-8">

                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-1.5 bg-gold-50 text-gold-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-gold-200">
                        Step 1 of 1: Complete Profile
                    </div>
                    <div className="w-20 h-20 bg-gold-gradient rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 p-1 border-2 border-white">
                        <img src={APP_CONFIG.LOGO} alt="App Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Om Sai Ram</h1>
                    <p className="text-navy-500 font-serif italic text-sm">"If you take one step towards Me, I shall take a hundred towards you." - Baba</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Gender Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">Are you a Brother or Sister?</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: 'male', photoURL: '' })}
                                className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold ${formData.gender === 'male' ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-navy-50 bg-neutral-50 text-navy-500 hover:border-navy-200'}`}
                            >
                                Brother
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: 'female', photoURL: '' })}
                                className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold ${formData.gender === 'female' ? 'border-gold-500 bg-gold-50 text-gold-700' : 'border-navy-50 bg-neutral-50 text-navy-500 hover:border-navy-200'}`}
                            >
                                Sister
                            </button>
                        </div>
                    </div>

                    {/* Avatar Selection */}
                    {formData.gender && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">Choose your Avatar</label>

                            {/* Google PFP Option */}
                            {auth.currentUser?.photoURL && (
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, photoURL: auth.currentUser?.photoURL || '' })}
                                        className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${formData.photoURL === auth.currentUser.photoURL ? 'border-gold-500 bg-gold-50' : 'border-navy-50 bg-neutral-50 hover:bg-neutral-100'}`}
                                    >
                                        <img src={auth.currentUser.photoURL} alt="Google" className="w-10 h-10 rounded-full object-cover" />
                                        <span className="text-sm font-bold text-navy-900">Use my Google Profile Picture</span>
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                {(formData.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS).map((url, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, photoURL: url })}
                                        className={`relative group p-1 transition-all duration-300 rounded-full aspect-square ${formData.photoURL === url ? 'ring-4 ring-gold-500 scale-105 shadow-lg shadow-gold-500/20' : 'opacity-70 hover:opacity-100 hover:scale-105 border border-navy-50'}`}
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden bg-navy-50">
                                            <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 focus:bg-white transition-all outline-none"
                                placeholder="Your Name"
                                required
                            />
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-200" size={20} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">State / Region</label>
                        <div className="relative">
                            <select
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value, centre: '', otherCentreName: '' })}
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 focus:bg-white transition-all outline-none appearance-none ${!formData.state ? 'text-gray-400 bg-gray-100' : 'bg-neutral-50'}`}
                                required
                            >
                                <option value="" disabled>Select your State / Region</option>
                                {Object.keys(DETAILED_STATE_CENTRE_MAP).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-200" size={20} />
                        </div>

                        {formData.state === 'Other' && (
                            <div className="mt-4 animate-in slide-in-from-top-2">
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 items-start mb-3">
                                    <Info className="flex-shrink-0 text-blue-500 mt-0.5" size={16} />
                                    <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                                        Sai Ram, if you are NOT affiliated to any Sai centre or if you are not in Malaysia, type in the region/ state where you are.
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    value={formData.otherRegion}
                                    onChange={e => setFormData({ ...formData, otherRegion: e.target.value })}
                                    className="w-full px-4 py-3 bg-white rounded-xl border border-navy-100 font-bold text-navy-900 focus:border-gold-500 outline-none"
                                    placeholder="Type your Region/State"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {formData.state && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">SSIOM Sathya Sai Centre</label>
                            <div className="relative">
                                <select
                                    value={formData.centre}
                                    onChange={e => setFormData({ ...formData, centre: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 focus:bg-white transition-all outline-none appearance-none"
                                    required
                                >
                                    <option value="" disabled>Select your Centre</option>
                                    {availableCentres.map(centre => (
                                        <option key={centre} value={centre}>{centre}</option>
                                    ))}
                                </select>
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-200" size={20} />
                            </div>

                            {showOtherCentreInput && (
                                <div className="mt-4 animate-in slide-in-from-top-2">
                                    <div className="bg-gold-50 border border-gold-200 p-4 rounded-xl flex gap-3 items-start mb-3">
                                        <Info className="flex-shrink-0 text-gold-600 mt-0.5" size={16} />
                                        <p className="text-[10px] text-navy-800 leading-relaxed font-medium">
                                            Om Sai Ram. If you are unable to locate your SSIOM Sai Centre in the list, kindly ensure that the correct state has been selected. Alternatively, you may manually enter the name of your locality below. Please note that the details provided during this step will remain fixed throughout your Sai SMS experience.
                                        </p>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.otherCentreName}
                                        onChange={e => setFormData({ ...formData, otherCentreName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-navy-100 font-bold text-navy-900 focus:border-gold-500 outline-none"
                                        placeholder="Type Name of Locality / Centre"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-navy-300 ml-4">Phone / WhatsApp Number (Optional)</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-4 bg-neutral-50 rounded-2xl border border-navy-50 font-bold text-navy-900 focus:border-gold-500 focus:bg-white transition-all outline-none"
                                placeholder="+60 12-345 6789"
                            />
                        </div>
                        <p className="text-[10px] text-navy-400 ml-4">Helps coordinators reach out for community communication.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-navy-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Join Sai SMS Now <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-dashed border-navy-50 text-center">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 inline-block w-full">
                        <p className="text-[10px] text-navy-400 font-medium leading-relaxed">
                            Om Sai Ram. Account verified via Google. Your data is stored securely in SSIOM's digital database. Read our <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800">Privacy Policy</Link> for more information.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SetupPage;
