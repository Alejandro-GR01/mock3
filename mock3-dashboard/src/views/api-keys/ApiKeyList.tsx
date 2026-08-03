import { useState } from "react";
import { Key } from "lucide-react";
import {
  useApiKeys,
  useRegenerateApiKey,
  useDeleteApiKey,
} from "@/api/useApiKeys";
import type { ApiKeyWithKey } from "@/api/useApiKeys";
import ApiKeyCard from "@/components/api-keys/ApiKeyCard";
import ApiKeyGenerateButton from "@/components/api-keys/ApiKeyGenerateButton";
import RegenerateConfirmDialog from "@/components/api-keys/RegenerateConfirmDialog";
import RegenerateDisplayDialog from "@/components/api-keys/RegenerateDisplayDialog";
import DeleteConfirmDialog from "@/components/api-keys/DeleteConfirmDialog";
import { useToast } from "@/contexts/ToastContext";

interface DeleteState {
  id: string;
  name: string;
}

type RegenerateState =
  | { phase: "confirm"; keyId: string; keyName: string }
  | { phase: "display"; key: ApiKeyWithKey }
  | null;

export default function ApiKeyList() {
  const { data: apiKeys, isLoading } = useApiKeys();
  const regenerateKey = useRegenerateApiKey();
  const deleteKey = useDeleteApiKey();
  const { toast } = useToast();

  const [regenerateState, setRegenerateState] = useState<RegenerateState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);

  const handleRegenerateConfirm = () => {
    if (!regenerateState || regenerateState.phase !== "confirm") return;
    regenerateKey.mutate(regenerateState.keyId, {
      onSuccess: (data) => {
        setRegenerateState({ phase: "display", key: data });
      },
      onError: () => {
        setRegenerateState(null);
      },
    });
  };

  const handleRegenerateCancel = () => {
    setRegenerateState(null);
  };

  const handleRegenerateDisplayClose = () => {
    setRegenerateState(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteState) return;
    deleteKey.mutate(deleteState.id, {
      onSuccess: () => {
        setDeleteState(null);
        toast("success", "API key deleted successfully");
      },
      onError: () => {
        setDeleteState(null);
        toast("error", "Failed to delete API key. It may have already been removed.");
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeleteState(null);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-[24px] font-semibold text-text-primary">API Keys</h1>
        <div className="mt-6 flex items-center justify-center border border-border bg-gradient-to-t from-primary/5 to-card p-12">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-3 w-3 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-[13px] text-text-muted">Loading API keys...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-accent-blue before:to-accent-blue/30">
          <h1 className="text-[24px] font-semibold text-text-primary">API Keys</h1>
          <p className="mt-1 text-[13px] text-text-secondary">
            Manage your API keys for authenticating mock endpoints.
          </p>
        </div>
        <ApiKeyGenerateButton />
      </div>

      {apiKeys && apiKeys.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center border border-border bg-gradient-to-t from-primary/5 to-card p-12">
          <Key size={32} className="text-text-muted" />
          <p className="mt-3 text-[13px] text-text-secondary">
            No API keys yet. Generate one to get started.
          </p>
        </div>
      )}

      {apiKeys && apiKeys.length > 0 && (
        <div className="mt-6 grid gap-3">
          {apiKeys.map((key) => (
            <ApiKeyCard
              key={key.id}
              apiKey={key}
              onRegenerate={(id) => {
                const keyData = apiKeys.find((k) => k.id === id);
                if (!keyData) return;

                if (keyData.expiresAt !== null && new Date(keyData.expiresAt) <= new Date()) {
                  toast("error", "Cannot regenerate an expired API key");
                  return;
                }

                setRegenerateState({
                  phase: "confirm",
                  keyId: id,
                  keyName: keyData.name || "Untitled Key",
                });
              }}
              onDelete={(id) => {
                const keyData = apiKeys.find((k) => k.id === id);
                if (keyData) {
                  setDeleteState({ id, name: keyData.name || "Untitled Key" });
                }
              }}
            />
          ))}
        </div>
      )}

      <RegenerateConfirmDialog
        open={regenerateState?.phase === "confirm"}
        keyName={regenerateState?.phase === "confirm" ? regenerateState.keyName : undefined}
        onConfirm={handleRegenerateConfirm}
        onCancel={handleRegenerateCancel}
        isPending={regenerateKey.isPending}
      />

      <RegenerateDisplayDialog
        open={regenerateState?.phase === "display"}
        apiKey={regenerateState?.phase === "display" ? { name: regenerateState.key.name, key: regenerateState.key.key } : null}
        onClose={handleRegenerateDisplayClose}
      />

      <DeleteConfirmDialog
        open={deleteState !== null}
        keyName={deleteState?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isPending={deleteKey.isPending}
      />
    </div>
  );
}
