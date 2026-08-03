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

interface DangerConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string; // exact text the user must type
  confirmLabel: string; // button label, e.g. "Reset" / "Delete"
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function DangerConfirmDialog({
  open,
  title,
  description,
  confirmText,
  confirmLabel,
  onConfirm,
  onCancel,
  isPending = false,
}: DangerConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const isConfirmed = inputValue === confirmText;

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
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="rounded border border-destructive/20 bg-gradient-to-t from-destructive/10 to-card px-4 py-3">
          <label
            htmlFor="danger-confirm-input"
            className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted"
          >
            Type <strong className="normal-case text-destructive">"{confirmText}"</strong> to confirm:
          </label>
          <input
            id="danger-confirm-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={confirmText}
            className="mt-2 w-full border border-border-strong bg-bg-terminal px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
          />
        </div>

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
            {isPending ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
