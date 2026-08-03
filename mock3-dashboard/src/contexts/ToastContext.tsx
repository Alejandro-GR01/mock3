import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastContextValue {
  toast: (type: Toast["type"], message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: Toast["type"], message: string) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent).detail;
      addToast(type, message);
    };
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const borderColors: Record<Toast["type"], string> = {
  success: "border-l-state-success",
  error: "border-l-state-error",
  warning: "border-l-state-warning",
  info: "border-l-state-info",
};

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 w-80 rounded-none border border-border border-l-[3px] ${borderColors[toast.type]} bg-bg-sidebar px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200`}
    >
      <p className="flex-1 text-[13px] text-text-primary">{toast.message}</p>
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="text-text-muted hover:text-text-primary text-[16px] leading-none"
      >
        ×
      </button>
    </div>
  );
}
