import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMockDetail, useUpdateMockMethods, useUpdateMock } from "@/api/useMocks";
import ResponseEditor from "@/components/mocks/ResponseEditor";
import MethodBadge from "@/components/mocks/MethodBadge";
import type { MockMethodConfig } from "@/types";

const ALL_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "text-http-get",
    POST: "text-http-post",
    PUT: "text-http-put",
    PATCH: "text-http-patch",
    DELETE: "text-http-delete",
  };
  return colors[method] || "text-text-primary";
}

export default function MockDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: mock, isLoading } = useMockDetail(id);
  const updateMethods = useUpdateMockMethods();
  const updateMock = useUpdateMock();
  const [editedMethods, setEditedMethods] = useState<
    Record<string, MockMethodConfig>
  >({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  if (!mock) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-[14px] text-text-secondary">Mock not found</p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/mocks")}
          className="mt-4 rounded-none bg-accent-blue px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
        >
          Back to Mocks
        </button>
      </div>
    );
  }

  const methods = Object.keys(mock.methods);
  const currentMethods = editedMethods;

  const getMethodConfig = (method: string): MockMethodConfig => {
    if (currentMethods[method]) return currentMethods[method];
    return mock.methods[method];
  };

  const handleMethodSave = (method: string, config: MockMethodConfig) => {
    setEditedMethods((prev) => ({
      ...prev,
      [method]: config,
    }));

    const updatedMethods = { ...mock.methods, [method]: config };
    updateMethods.mutate({ id: mock.id, methods: updatedMethods });
  };

  const handleToggleMethod = (method: string) => {
    const currentMethods = Object.keys(mock.methods);
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];
    updateMock.mutate({ id: mock.id, updates: { name: mock.name ?? "", path: mock.path, methods: newMethods } });
  };

  const displayName = mock.name || mock.slug;
  const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const mockUrl = `${backendUrl}/mocks/${mock.path}`;

  return (
    <div>
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/mocks")}
        className="flex items-center gap-1 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Mocks
      </button>

      {/* Title + method badges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-[24px] font-semibold text-text-primary">
            {displayName}
          </h1>
          {Object.keys(mock.methods).map((method) => (
            <MethodBadge key={method} method={method} />
          ))}
        </div>
        <p className="mt-1 font-mono text-[13px] text-text-secondary truncate max-w-full">
          {mockUrl}
        </p>
      </div>

      {/* HTTP Methods checkboxes */}
      <div className="mb-6 border border-border bg-bg-sidebar p-4">
        <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wide mb-3">
          HTTP Methods
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_METHODS.map((method) => {
            const isEnabled = method in mock.methods;
            return (
              <label
                key={method}
                className={`flex items-center gap-2 px-3 py-1.5 border border-border cursor-pointer hover:bg-bg-editor transition-colors ${updateMock.isPending ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => handleToggleMethod(method)}
                  disabled={updateMock.isPending}
                  className="sr-only"
                />
                <span className={`text-[11px] font-bold uppercase font-mono ${isEnabled ? getMethodColor(method) : "text-text-muted"}`}>
                  {method}
                </span>
                {isEnabled && <span className="text-[10px] text-text-muted">✓</span>}
              </label>
            );
          })}
        </div>
      </div>

      {/* Response Editors */}
      {methods.length > 0 && (
        <p className="mb-4 text-[12px] text-text-muted">
          Configure a response for each method below. Start with GET.
        </p>
      )}
      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <ResponseEditor
            key={method}
            method={method}
            config={getMethodConfig(method)}
            onSave={handleMethodSave}
            isSaving={updateMethods.isPending}
          />
        ))}
      </div>
    </div>
  );
}
