import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={18} />,
        error: <AlertCircle className="text-rose-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />,
    };

    const colors = {
        success: 'border-emerald-100 bg-white text-slate-900',
        error: 'border-rose-100 bg-white text-slate-900',
        info: 'border-blue-100 bg-white text-slate-900',
    };

    return (
        <div className={`
            pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl animate-toast-in min-w-[320px]
            ${colors[toast.type]}
        `}>
            <div className="shrink-0">{icons[toast.type]}</div>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-900 transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export const useToast = () => useContext(ToastContext);
