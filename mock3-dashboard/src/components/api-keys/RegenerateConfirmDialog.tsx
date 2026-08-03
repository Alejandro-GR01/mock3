import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegenerateConfirmDialogProps {
  open: boolean;
  keyName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function RegenerateConfirmDialog({
  open,
  keyName,
  onConfirm,
  onCancel,
  isPending,
}: RegenerateConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const isConfirmed = inputValue === keyName;

  useEffect(() => {
    if (open) setInputValue("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <div className="rounded-full bg-destructive/10 p-1.5">
              <AlertTriangle size={16} />
            </div>
            <DialogTitle>Regenerate API Key</DialogTitle>
          </div>
          <DialogDescription>
            This will revoke your current key and generate a new one. Any
            application using the old key will stop working.
          </DialogDescription>
        </DialogHeader>

        {keyName && (
          <>
            <div className="rounded border border-destructive/20 bg-gradient-to-t from-destructive/10 to-card px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-destructive">
                Key to regenerate
              </p>
              <p className="mt-1 text-[14px] font-semibold text-text-primary">
                {keyName}
              </p>
            </div>

            <div className="rounded border border-border bg-gradient-to-t from-primary/5 to-card px-4 py-3">
              <label
                htmlFor="regenerate-confirm-input"
                className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted"
              >
                Type <strong className="normal-case text-destructive">"{keyName}"</strong> to confirm:
              </label>
              <input
                id="regenerate-confirm-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={keyName}
                className="mt-2 w-full border border-border-strong bg-bg-terminal px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!isConfirmed || isPending}
            className="transition-all duration-200"
          >
            {isPending ? "Regenerating..." : "Regenerate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
