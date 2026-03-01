import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

interface ToastNotificationProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-600" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-orange-600" />;
            case 'info':
                return <Info size={20} className="text-blue-600" />;
        }
    };

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-900';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-900';
            case 'warning':
                return 'bg-orange-50 border-orange-200 text-orange-900';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-900';
        }
    };

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-2xl border-2 shadow-lg min-w-[320px] max-w-md animate-in slide-in-from-right-full duration-300 ${getStyles()}`}
        >
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-grow">
                <p className="text-sm font-bold leading-relaxed">{toast.message}</p>
            </div>
            <button
                onClick={() => onClose(toast.id)}
                className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastNotification toast={toast} onClose={onClose} />
                </div>
            ))}
        </div>
    );
};

// Hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const showToast = (message: string, type: Toast['type'] = 'info', duration?: number) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: Toast = { id, message, type, duration };
        setToasts((prev) => [...prev, newToast]);
    };

    const closeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, showToast, closeToast };
};

export default ToastNotification;
