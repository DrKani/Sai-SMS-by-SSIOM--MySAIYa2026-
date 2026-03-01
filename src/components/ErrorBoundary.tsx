import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <AlertTriangle size={36} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Something went wrong</h2>
                        <p className="text-navy-500 text-sm mb-10 leading-relaxed font-medium">
                            We encountered an unexpected error. Don't worry, your spiritual journey is safe!
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-navy-900 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center justify-center gap-3"
                            >
                                <RotateCcw size={18} /> Reload Application
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-4 bg-neutral-100 text-navy-900 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
                            >
                                <Home size={18} /> Go to Homepage
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-10 p-4 bg-red-50 rounded-2xl text-left overflow-auto max-h-40 border border-red-100">
                                <p className="text-[10px] font-mono text-red-600 whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
