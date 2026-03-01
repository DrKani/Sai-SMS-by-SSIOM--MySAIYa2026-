import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('sms_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAllow = () => {
        localStorage.setItem('sms_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[100] animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-navy-50 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center shrink-0">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold text-navy-900 leading-tight">We value your privacy</h4>
                        <p className="text-xs text-navy-400 font-medium leading-relaxed mt-2">
                            Om Sai Ram. We use essential cookies to enhance your experience on our site. By clicking "Allow All" or continuing to browse, you consent to our use of cookies. Please review our <Link to="/cookies" className="text-gold-600 underline font-bold hover:text-navy-900">Cookies Policy</Link> for more information.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleAllow}
                    className="w-full py-4 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-navy-800 transition-all active:scale-95"
                >
                    Allow All
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
