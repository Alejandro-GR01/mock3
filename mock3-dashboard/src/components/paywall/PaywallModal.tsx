import { Lock, Zap } from "lucide-react";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PaywallModal({ open, onClose }: PaywallModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-none border border-border bg-bg-sidebar p-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center border border-accent-amber/30 bg-accent-amber/10">
            <Lock size={24} className="text-accent-amber-light" />
          </div>
        </div>

        <h2 className="text-center text-[18px] font-semibold text-text-primary">
          Upgrade to <span className="text-accent-amber-light">Pro</span>
        </h2>

        <p className="mt-3 text-center text-[13px] text-text-secondary leading-relaxed">
          You&apos;ve reached the free tier limit of 3 mocks. Upgrade to Pro for
          unlimited mocks.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-none border border-accent-amber/20 bg-accent-amber/5 px-4 py-3">
          <Zap size={14} className="text-accent-amber-light" />
          <span className="text-[12px] text-text-secondary">
            Connect your wallet to upgrade (coming soon)
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-none bg-accent-amber/50 px-4 py-2.5 text-[13px] font-medium text-black/60 cursor-not-allowed"
            disabled
          >
            Upgrade (coming soon)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-none border border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-bg-editor transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
