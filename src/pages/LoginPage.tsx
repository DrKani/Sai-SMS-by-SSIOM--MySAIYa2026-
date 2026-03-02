
import React, { useState } from 'react';
import { UserCircle, Chrome, Info, Heart, X, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../constants';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { ToastContainer, useToast } from '../components/Toast';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toasts, showToast, closeToast } = useToast();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading('google');
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Signed in successfully!', 'success', 2000);
      navigate('/dashboard', { state: { showWelcome: true, isReturning: true } });
    } catch (error: any) {
      console.error("Login failed", error);

      // User-friendly error messages
      let errorMessage = 'Sign-in failed. Please try again.';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled. Please try again when ready.';
      } else if (error.code === 'auth/popup-blocked' || (error.message && error.message.includes('popup'))) {
        errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized. Please contact support.';
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
        errorMessage = 'Guest access is currently disabled. Please sign in with Google.';
      }

      showToast(errorMessage, 'error', 5000);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-neutral-50 font-poppins">
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
                onClick={() => { setShowGuestModal(false); navigate('/signup'); }}
                disabled={!!loading}
                className="w-full py-4 bg-gold-gradient text-navy-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Chrome size={18} />
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

      <div className="absolute -top-24 -right-24 p-40 opacity-5 rotate-12 pointer-events-none text-gold-500">
        <Heart size={400} fill="currentColor" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] mx-auto flex items-center justify-center overflow-hidden shadow-2xl shadow-gold-500/30 p-2 border-2 border-gold-100 mb-6">
            <img src={APP_CONFIG.LOGO} alt="Sai SMS" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-navy-900 mb-2 uppercase tracking-tighter">Om Sai Ram.</h1>
          <p className="text-navy-500 font-medium italic">Your spiritual companion awaits.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-navy-50 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={!!loading}
              className="w-full py-5 bg-gold-gradient border border-transparent rounded-2xl flex items-center justify-center gap-4 font-black text-navy-900 uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading === 'google' ? <Loader2 className="animate-spin text-navy-900" size={20} /> : <Chrome size={20} className="text-navy-900" />}
              {loading === 'google' ? 'Signing in...' : 'Sign In with Google'}
            </button>
            <p className="text-[10px] text-navy-400 text-center font-medium">Forgot which Google account you used? <br className="hidden sm:block" />Just select the one you check most often.</p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy-50"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-navy-200">
              <span className="bg-white px-4">Or Discover</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowGuestModal(true)}
              disabled={!!loading}
              className="w-full py-4 bg-navy-50 text-navy-900 border-2 border-transparent rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-navy-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <UserCircle size={18} />
              Continue as Guest
            </button>
            <div className="text-center">
              <p className="text-[10px] text-navy-400 font-medium">View only. Sign in to submit counts and track progress.</p>
            </div>
          </div>

          <div className="pt-8 border-t border-navy-50">
            <div className="bg-gold-50/50 p-6 rounded-3xl border border-gold-100">
              <div className="flex items-center gap-2 mb-3 text-gold-700">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">New Member?</span>
              </div>
              <p className="text-xs text-navy-400 leading-relaxed font-medium">
                Simply <Link to="/signup" className="text-gold-600 font-bold hover:underline">sign up with Google</Link>. If it's your first time, we'll help you set up your profile in the next step.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] text-navy-300 font-bold uppercase tracking-widest leading-relaxed px-10">
          By continuing, you agree to our <Link to="/terms" className="underline hover:text-navy-900">Terms of Use</Link> and <Link to="/privacy" className="underline hover:text-navy-900">Privacy Policy</Link>. Om Sai Ram.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
