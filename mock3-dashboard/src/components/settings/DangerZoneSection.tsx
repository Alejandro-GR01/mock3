import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/clerk-react";
import { Card, CardContent } from "@/components/ui/card";
import DangerConfirmDialog from "./DangerConfirmDialog";
import { useToast } from "@/contexts/ToastContext";
import { useDeleteAccount } from "@/api/useMe";

const DELETE_ACTION = {
  key: "delete" as const,
  title: "Delete account",
  confirmText: "delete account",
  confirmLabel: "Delete",
  description:
    "Permanently delete your account and all your mocks, keys & logs.",
};

const DELETE_DIALOG_COPY = {
  title: "Delete Account",
  description:
    "This action cannot be undone. Your account and all your mocks, API keys and request logs will be permanently deleted.",
};

export default function DangerZoneSection() {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const deleteAccount = useDeleteAccount();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleConfirm = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: async () => {
        toast("success", "Account deleted. Thanks for using Mock3!");
        queryClient.clear();          // prevent 401 refetches after Clerk kills the session
        await signOut();
        navigate("/sign-in");
      },
      onError: () => {
        toast("error", "Failed to delete account. Please try again.");
      },
    });
  };

  return (
    <>
      <Card className="rounded-none border-state-error/50 bg-card shadow-none">
        <CardContent className="p-4">
          <h2 className="text-[15px] font-semibold text-state-error">
            Danger Zone
          </h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            Destructive actions that cannot be undone.
          </p>

          <div className="mt-4 divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
              <div className="min-w-0">
                <h3 className="text-[13px] font-medium text-text-primary">
                  {DELETE_ACTION.title}
                </h3>
                <p className="mt-1 text-[12px] text-text-secondary">
                  {DELETE_ACTION.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPending(true)}
                className="cursor-pointer whitespace-nowrap rounded-none border border-state-error/40 px-4 py-2 text-[12px] font-medium text-state-error transition-colors hover:bg-state-error/10"
              >
                {DELETE_ACTION.title}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {pending && (
        <DangerConfirmDialog
          open={true}
          title={DELETE_DIALOG_COPY.title}
          description={DELETE_DIALOG_COPY.description}
          confirmText={DELETE_ACTION.confirmText}
          confirmLabel={DELETE_ACTION.confirmLabel}
          onConfirm={handleConfirm}
          onCancel={() => setPending(false)}
          isPending={deleteAccount.isPending}
        />
      )}
    </>
  );
}
