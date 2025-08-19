import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import "./Toast.css";

type ToastType = "success" | "info" | "error";
type Toast = { id: number; message: string; type: ToastType; duration: number };

type ToastContextValue = {
  show: (
    message: string,
    opts?: { type?: ToastType; duration?: number }
  ) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback(
    (message: string, opts?: { type?: ToastType; duration?: number }) => {
      const id = Date.now() + Math.random();
      const toast: Toast = {
        id,
        message,
        type: opts?.type ?? "success",
        duration: Math.max(1200, Math.min(6000, opts?.duration ?? 2000)),
      };
      setToasts((prev) => [...prev, toast]);
      // autodestruir
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    },
    []
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="toast-container"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
