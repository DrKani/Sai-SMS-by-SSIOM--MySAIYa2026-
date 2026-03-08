import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6 animate-in slide-in-from-bottom duration-500">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-full mb-4">
                    <Compass size={48} />
                </div>
                <h1 className="text-4xl font-serif font-black text-navy-900 leading-tight">Om Sai Ram.<br />Page Not Found</h1>
                <p className="text-navy-500 font-medium">
                    The page you are looking for does not exist or has been moved.
                    Please return to the main path.
                </p>
                <div className="pt-8">
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-gold-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10">
                        <Home size={16} /> Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
