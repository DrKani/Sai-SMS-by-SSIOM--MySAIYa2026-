
import React, { useState } from 'react';
import { sendEmailVerification, User } from 'firebase/auth';
import { Mail, RefreshCw, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../constants';

interface EmailVerificationProps {
    user: User;
    onRefresh: () => void;
    onLogout: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ user, onRefresh, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleResend = async () => {
        setLoading(true);
        setError('');
        try {
            await sendEmailVerification(user);
            setSent(true);
        } catch (err: any) {
            console.error("Email verification error:", err);
            if (err.code === 'auth/too-many-requests') {
                setError("Please wait a moment before trying again.");
            } else {
                setError("Failed to send verification email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-50 flex items-center justify-center p-6 z-[100]">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border-4 border-gold-500 animate-in zoom-in duration-300 relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient"></div>

                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
                    <Mail size={32} />
                </div>

                <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">
                    Verify Your Email
                </h2>

                <p className="text-navy-400 text-sm leading-relaxed mb-8">
                    To ensure the integrity of our spiritual community, please verify your email address:
                    <br />
                    <span className="font-bold text-navy-900 block mt-2">{user.email}</span>
                </p>

                {sent && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2 justify-center animate-in fade-in">
                        <CheckCircle2 size={16} /> Verification email sent! Check your inbox/spam.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold mb-6 animate-in fade-in">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={loading || sent}
                        className="w-full py-4 bg-navy-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-navy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (sent ? "Email Sent" : "Resend Verification Email")}
                    </button>

                    <button
                        onClick={onRefresh}
                        className="w-full py-4 bg-white border-2 border-navy-50 text-navy-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-gold-400 hover:bg-gold-50 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={16} /> I've Verified, Refresh Page
                    </button>

                    <button
                        onClick={onLogout}
                        className="text-[10px] font-black uppercase tracking-widest text-navy-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2 mx-auto mt-4"
                    >
                        <LogOut size={12} /> Sign Out
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-dashed border-navy-50">
                    <p className="text-[10px] text-navy-300 italic">
                        Note: Check your spam folder if you don't see the email.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default EmailVerification;
