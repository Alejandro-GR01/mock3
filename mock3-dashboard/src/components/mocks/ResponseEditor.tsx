import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import type { MockMethodConfig } from "@/types";
import { getMethodColor, getStatusCodeColor } from "@/lib/http-colors";

interface ResponseEditorProps {
  method: string;
  config: MockMethodConfig;
  onSave: (method: string, config: MockMethodConfig) => void;
  isSaving?: boolean;
}

export default function ResponseEditor({
  method,
  config,
  onSave,
  isSaving = false,
}: ResponseEditorProps) {
  const [statusCode, setStatusCode] = useState(config.status);
  const [headers, setHeaders] = useState(
    JSON.stringify(config.headers, null, 2)
  );
  const [body, setBody] = useState(config.body);
  const [headersError, setHeadersError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    if (isSaving) {
      setSaveState("saving");
    } else if (saveState === "saving") {
      setSaveState("success");
      const timer = setTimeout(() => setSaveState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, saveState]);

  const methodColors = getMethodColor(method);
  const statusColors = getStatusCodeColor(statusCode);
  const isValidStatusCode =
    Number.isFinite(statusCode) && statusCode >= 100 && statusCode <= 599;

  const handleSave = () => {
    try {
      const parsedHeaders = JSON.parse(headers) as Record<string, string>;
      setHeadersError(null);
      onSave(method, {
        status: statusCode,
        headers: parsedHeaders,
        body,
      });
    } catch {
      setHeadersError("Invalid JSON in headers");
    }
  };

  return (
    <div
      className={`bg-card border border-border-strong border-l-4 ${methodColors.borderL}`}
    >
      {/* VS Code style panel header */}
      <div className="flex items-center justify-between bg-bg-sidebar px-4 py-2">
        <span className={`font-mono text-[11px] font-bold uppercase ${methodColors.text}`}>
          {method}
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isValidStatusCode}
          className="flex items-center gap-1.5 rounded-none bg-accent-blue px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saveState === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          )}
          {saveState === "success" && (
            <>
              <Check className="h-3 w-3 text-state-success" />
              <span className="text-state-success">Saved</span>
            </>
          )}
          {saveState === "error" && (
            <>
              <Check className="h-3 w-3" />
              Error
            </>
          )}
          {saveState === "idle" && (
            <>
              <Check className="h-3 w-3" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Body content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Status Code */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`status-${method}`}
            className="text-[11px] font-medium text-text-secondary uppercase tracking-wide"
          >
            Status Code
          </label>
          <input
            id={`status-${method}`}
            type="number"
            value={statusCode}
            onChange={(e) => setStatusCode(Number(e.target.value))}
            min={100}
            max={599}
            className={`w-20 rounded-none border bg-bg-terminal px-3 py-1.5 font-mono text-[13px] outline-none focus:border-accent-blue transition-colors ${statusColors.text} ${statusColors.border}`}
          />
          {!isValidStatusCode && (
            <p className="text-[11px] text-state-error">
              Status code must be between 100 and 599
            </p>
          )}
        </div>

        {/* Headers */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`headers-${method}`}
            className="text-[11px] font-medium text-text-secondary uppercase tracking-wide"
          >
            Headers (JSON)
          </label>
          <textarea
            id={`headers-${method}`}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className={`min-h-[60px] resize-y rounded-none border font-mono text-[12px] bg-bg-terminal px-3 py-2 text-text-primary outline-none transition-colors ${
              headersError ? "border-state-error" : "border-border"
            } focus:border-accent-blue`}
          />
          {headersError && (
            <p className="text-[11px] text-state-error">{headersError}</p>
          )}
        </div>

        {/* Response Body */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`body-${method}`}
            className="text-[11px] font-medium text-text-secondary uppercase tracking-wide"
          >
            Response Body
          </label>
          <textarea
            id={`body-${method}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px] resize-y rounded-none border border-border bg-bg-terminal px-3 py-2 font-mono text-[13px] text-text-primary outline-none focus:border-accent-blue transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
