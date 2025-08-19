import React, { createContext, useContext, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./toast.css";

type ToastType = "success" | "info" | "warning" | "error";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastAPI {
  show: (message: string, type?: ToastType, durationMs?: number) => void;
  success: (message: string, durationMs?: number) => void;
  info: (message: string, durationMs?: number) => void;
  warning: (message: string, durationMs?: number) => void;
  error: (message: string, durationMs?: number) => void;
}

const ToastContext = createContext<ToastAPI | undefined>(undefined);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = "info", durationMs = 2500) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(() => remove(id), durationMs);
    },
    [remove]
  );

  const api = useMemo<ToastAPI>(
    () => ({
      show,
      success: (m, d) => show(m, "success", d),
      info: (m, d) => show(m, "info", d),
      warning: (m, d) => show(m, "warning", d),
      error: (m, d) => show(m, "error", d),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="toast-container" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <span className="material-icons">
                {t.type === "success"
                  ? "check_circle"
                  : t.type === "info"
                  ? "info"
                  : t.type === "warning"
                  ? "warning"
                  : "error"}
              </span>
              <span className="toast-message">{t.message}</span>
              <button
                className="toast-close"
                aria-label="Cerrar"
                onClick={() => remove(t.id)}
                title="Cerrar"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
