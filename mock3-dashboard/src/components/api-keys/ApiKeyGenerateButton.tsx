import { useState } from "react";
import { Plus, Copy, Check } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { useCreateApiKey } from "@/api/useApiKeys";
import { Button } from "@/components/ui/button";

type DialogState = "closed" | "form" | "created";

interface ApiKeyGenerateButtonProps {
  disabled?: boolean;
}

export default function ApiKeyGenerateButton({
  disabled = false,
}: ApiKeyGenerateButtonProps) {
  const [dialogState, setDialogState] = useState<DialogState>("closed");
  const [keyName, setKeyName] = useState("");
  const [expiresInHours, setExpiresInHours] = useState<number | undefined>(
    undefined
  );
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [createdKeyName, setCreatedKeyName] = useState("");
  const [copied, setCopied] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [expirationError, setExpirationError] = useState<string | null>(null);
  const { copy } = useClipboard();
  const createKey = useCreateApiKey();

  const validateName = (name: string): string | null => {
    if (!name.trim()) return "Key name is required";
    if (name.trim().length < 5) return "Must be at least 5 characters";
    return null;
  };

  const validateExpiration = (
    hours: number | undefined
  ): string | null => {
    if (hours === undefined) return null;
    if (!Number.isInteger(hours)) return "Must be a whole number";
    if (hours < 1) return "Must be greater than 0";
    return null;
  };

  const handleOpen = () => {
    setKeyName("");
    setExpiresInHours(undefined);
    setCopied(false);
    setNameError(null);
    setExpirationError(null);
    setDialogState("form");
  };

  const handleClose = () => {
    setDialogState("closed");
    setCreatedKey(null);
    setCreatedKeyName("");
    setCopied(false);
    setNameError(null);
    setExpirationError(null);
  };

  const handleGenerate = () => {
    const nameValidation = validateName(keyName);
    if (nameValidation) {
      setNameError(nameValidation);
      return;
    }

    const expirationValidation = validateExpiration(expiresInHours);
    if (expirationValidation) {
      setExpirationError(expirationValidation);
      return;
    }

    createKey.mutate(
      {
        name: keyName.trim(),
        expiresInHours,
      },
      {
        onSuccess: (data) => {
          setCreatedKey(data.key);
          setCreatedKeyName(data.name || keyName || "");
          setDialogState("created");
        },
      }
    );
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    await copy(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={disabled}
        className="bg-accent-blue hover:bg-accent-blue/90 text-white font-medium transition-all duration-200"
      >
        <Plus size={14} />
        Generate Key
      </Button>

      {dialogState !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md border border-border-strong bg-gradient-to-t from-primary/5 to-card p-6">
            {dialogState === "form" ? (
              <>
                <h2 className="text-[14px] font-semibold text-text-primary">
                  Generate API Key
                </h2>

                <div className="mt-4">
                  <label
                    htmlFor="api-key-name"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted"
                  >
                    Key Name
                  </label>
                  <input
                    id="api-key-name"
                    type="text"
                    value={keyName}
                    onChange={(e) => {
                      setKeyName(e.target.value);
                      setNameError(null);
                    }}
                    placeholder="e.g. Production API"
                    className={`mt-1 w-full border bg-bg-terminal px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-blue/30 ${
                      nameError
                        ? "border-state-error"
                        : "border-border-strong focus:border-accent-blue"
                    }`}
                  />
                  {nameError ? (
                    <p className="mt-1 text-[11px] text-state-error border-l-2 border-state-error pl-2">
                      {nameError}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-text-muted">
                      At least 5 characters
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="api-key-expiration"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-text-muted"
                  >
                    Expiration (hours)
                  </label>
                  <input
                    id="api-key-expiration"
                    type="number"
                    min={1}
                    max={8760}
                    value={expiresInHours ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExpiresInHours(
                        val === "" ? undefined : Number(val)
                      );
                      setExpirationError(null);
                    }}
                    placeholder="Leave blank for no expiration"
                    className={`mt-1 w-full border bg-bg-terminal px-3 py-2 text-[13px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-blue/30 ${
                      expirationError
                        ? "border-state-error"
                        : "border-border-strong focus:border-accent-blue"
                    }`}
                  />
                  {expirationError ? (
                    <p className="mt-1 text-[11px] text-state-error border-l-2 border-state-error pl-2">
                      {expirationError}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-text-muted">
                      Optional. Key will expire after this time. Leave blank
                      for no expiration.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="border border-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:bg-bg-editor"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={createKey.isPending}
                    className="bg-accent-blue px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {createKey.isPending ? "Generating..." : "Generate"}
                  </button>
                </div>

                {createKey.isError && (
                  <p className="mt-3 text-[11px] text-state-error">
                    Failed to generate API key. Please try again.
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-state-success">
                  <Check size={16} />
                  <h2 className="text-[14px] font-semibold text-text-primary">
                    API Key Generated
                  </h2>
                </div>

                {createdKeyName && (
                  <p className="mt-3 text-[13px] font-medium text-text-primary">
                    {createdKeyName}
                  </p>
                )}

                <div className="relative mt-4 border border-border-strong bg-gradient-to-t from-primary/5 to-card p-3">
                  <code className="block pr-8 font-mono text-[13px] text-text-primary break-all">
                    {createdKey}
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
                  <p className="mt-2 text-[11px] text-state-success">
                    Copied to clipboard!
                  </p>
                )}

                <p className="mt-3 text-[11px] text-state-warning">
                  This key will only be shown once. Copy it now.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex flex-1 items-center justify-center gap-2 border border-border px-4 py-2 text-[13px] text-text-secondary transition-colors hover:bg-bg-editor"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-accent-blue px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-blue/90"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
