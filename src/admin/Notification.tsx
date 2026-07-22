import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ── Simple singleton event bus so any component can trigger toasts ─────────
type Listener = (toast: Omit<Toast, 'id'>) => void;
const listeners: Listener[] = [];

export function toast(type: ToastType, message: string) {
  listeners.forEach(fn => fn({ type, message }));
}
export const notify = {
  success: (msg: string) => toast('success', msg),
  error:   (msg: string) => toast('error', msg),
  info:    (msg: string) => toast('info', msg),
  warning: (msg: string) => toast('warning', msg),
};

// ── ToastContainer — mount once inside AdminDashboard ─────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const add = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${++counter.current}`;
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);

  useEffect(() => {
    listeners.push(add);
    return () => {
      const i = listeners.indexOf(add);
      if (i !== -1) listeners.splice(i, 1);
    };
  }, [add]);

  const icons = {
    success: <FaCheckCircle className="text-emerald-500" size={16} />,
    error:   <FaExclamationCircle className="text-red-500" size={16} />,
    info:    <FaInfoCircle className="text-blue-500" size={16} />,
    warning: <FaExclamationCircle className="text-yellow-500" size={16} />,
  };

  const borders = {
    success: 'border-l-4 border-emerald-500',
    error:   'border-l-4 border-red-500',
    info:    'border-l-4 border-blue-500',
    warning: 'border-l-4 border-yellow-500',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto bg-white dark:bg-slate-800 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 ${borders[t.type]}`}
          >
            {icons[t.type]}
            <span className="text-sm text-slate-800 dark:text-slate-100 flex-1">{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white ml-1"
            >
              <FaTimes size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
