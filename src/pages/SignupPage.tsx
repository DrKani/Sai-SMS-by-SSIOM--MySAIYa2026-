
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  Chrome, UserCircle, ArrowRight, Loader2, Info, X
} from 'lucide-react';
import { APP_CONFIG } from '../constants';
import { ToastContainer, useToast } from '../components/Toast';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const { toasts, showToast, closeToast } = useToast();

  const handleGoogleAuth = async () => {
    setLoading('google');
    try {
      await signInWithPopup(auth, googleProvider);
      // Success! App.tsx's onAuthStateChanged will handle redirect to /setup or /dashboard
      showToast('Signed in successfully!', 'success', 2000);
    } catch (error: any) {
      console.error("Google authentication failed", error);

      // User-friendly error messages
      let errorMessage = 'Sign-up failed. Please try again.';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up cancelled. Please try again when ready.';
      } else if (error.code === 'auth/popup-blocked' || (error.message && error.message.includes('popup'))) {
        errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
        // Optional: you could trigger signInWithRedirect here, but informing the user is safer to start.
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email. Please sign in instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, 'error', 6000);
    } finally {
      setLoading(null);
    }
  };

  const handleGuestEntry = async () => {
    setLoading('guest');
    try {
      await signInAnonymously(auth);
      localStorage.setItem('guestSession', 'true');
      showToast('Continuing as guest. Your progress won\'t be saved.', 'info', 4000);
      setTimeout(() => navigate('/'), 500);
    } catch (error: any) {
      console.error("Guest login failed", error);

      let errorMessage = 'Guest access failed. Please try again.';
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Guest access is currently disabled. Please sign up with Google.';
      }

      showToast(errorMessage, 'error', 5000);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-poppins relative">
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* GUEST MODAL */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm" onClick={() => setShowGuestModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={() => setShowGuestModal(false)}
              className="absolute top-4 right-4 p-2 text-navy-200 hover:text-navy-900 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4 text-navy-300">
                <UserCircle size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mb-2">Continue as Guest</h3>
            </div>

            <div className="prose prose-sm text-navy-600 mb-8 text-center leading-relaxed">
              <p className="mb-4">Om Sai Ram. You are welcome to explore Sai SMS by SSIOM as a Guest.</p>
              <p className="font-medium bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-800 text-xs">
                However, your sadhana progress, chanting records, badges, and discussions <span className="font-bold underline">will NOT be saved</span> to your personal dashboard or included in your Centre's count.
              </p>
              <p className="mt-4">To fully participate in the Sai SMS experience, we encourage you to create an account.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGuestEntry}
                disabled={!!loading}
                className="w-full py-3 bg-neutral-100 text-navy-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
              >
                {loading === 'guest' ? <Loader2 className="animate-spin" size={16} /> : 'Enter as Guest'}
              </button>

              <button
                onClick={handleGoogleAuth}
                disabled={!!loading}
                className="w-full py-4 bg-gold-gradient text-navy-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading === 'google' ? <Loader2 className="animate-spin" size={16} /> : <Chrome size={18} />}
                Sign Up Now
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="text-[10px] uppercase font-bold text-navy-400 hover:text-gold-600 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <Info size={12} /> Why sign up?
              </button>

              {showBenefits && (
                <div className="mt-3 text-left bg-navy-50 p-4 rounded-xl text-[10px] text-navy-600 space-y-2 animate-in slide-in-from-top-2">
                  <div className="flex gap-2"><ArrowRight size={12} className="text-gold-500 shrink-0" /> Save chanting records & streaks</div>
                  <div className="flex gap-2"><ArrowRight size={12} className="text-gold-500 shrink-0" /> Earn badges & track goals</div>
                  <div className="flex gap-2"><ArrowRight size={12} className="text-gold-500 shrink-0" /> Join reflections & book club progress</div>
                  <div className="flex gap-2"><ArrowRight size={12} className="text-gold-500 shrink-0" /> Access your dashboard on any device</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-navy-50 animate-in fade-in slide-in-from-bottom-8">

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gold-gradient rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 p-1 border-2 border-white">
            <img src={APP_CONFIG.LOGO} alt="App Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">Om Sai Ram</h1>
          <p className="text-navy-400 text-xs font-bold uppercase tracking-widest">Begin your spiritual journey</p>
        </div>

        {/* ACTIONS */}
        <div className="space-y-4">
          <div>
            <button
              onClick={handleGoogleAuth}
              disabled={!!loading}
              className="w-full py-5 bg-navy-900 border border-transparent rounded-2xl flex items-center justify-center gap-4 font-black text-white uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl shadow-navy-900/20 active:scale-95 disabled:opacity-50"
            >
              {loading === 'google' ? <Loader2 className="animate-spin text-white" size={20} /> : <Chrome size={20} className="text-white" />}
              {loading === 'google' ? 'Connecting...' : 'Sign Up with Google'}
            </button>
            <p className="mt-3 text-center text-[10px] text-navy-400 font-medium px-4">
              We only request your <span className="font-bold">Google email and name</span> to safely set up your spiritual profile and track your sadhana progress.
            </p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-50"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest text-navy-200">
              <span className="bg-white px-4">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowGuestModal(true)}
              className="w-full py-4 bg-white border-2 border-navy-50 text-navy-400 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] hover:border-navy-200 hover:text-navy-900 transition-all active:scale-95"
            >
              <UserCircle size={18} />
              Continue as Guest
            </button>
            <div className="text-center">
              <p className="text-[10px] text-navy-400 font-medium">View only. Sign in to submit counts and track progress.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-navy-50 text-center">
          <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">
            Already have an account? <span onClick={() => navigate('/signin')} className="text-gold-600 hover:underline ml-1 cursor-pointer">Sign In</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
