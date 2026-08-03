import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegenerateDisplayDialogProps {
  open: boolean;
  apiKey: { name: string; key: string } | null;
  onClose: () => void;
}

export default function RegenerateDisplayDialog({
  open,
  apiKey,
  onClose,
}: RegenerateDisplayDialogProps) {
  const [copied, setCopied] = useState(false);
  const { copy } = useClipboard();

  const handleCopy = async () => {
    if (!apiKey) return;
    await copy(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <div className="flex items-center gap-2 text-state-success">
            <Check size={16} />
            <DialogTitle className="text-[14px] font-semibold text-text-primary">
              API Key Regenerated
            </DialogTitle>
          </div>
        </DialogHeader>

        {apiKey && (
          <>
            <p className="text-[13px] font-medium text-text-primary">
              {apiKey.name}
            </p>

            <div className="relative mt-1 border border-border-strong bg-bg-terminal p-3 rounded-none">
              <code className="block pr-8 font-mono text-[13px] text-text-primary break-all">
                {apiKey.key}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted transition-colors hover:text-text-primary"
                title="Copy to clipboard"
              >
                <Copy size={14} />
              </button>
            </div>

            {copied && (
              <p className="mt-1 text-[11px] text-state-success">
                Copied to clipboard!
              </p>
            )}

            <p className="mt-1 text-[11px] text-state-warning">
              The old key has been revoked. This key will only be shown once. Copy it now.
            </p>
          </>
        )}

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex-1 rounded-none"
          >
            <Copy size={14} />
            Copy
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 rounded-none bg-accent-blue text-white hover:bg-accent-blue/90"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
