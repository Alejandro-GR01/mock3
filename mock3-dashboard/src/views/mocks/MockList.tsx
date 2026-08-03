import { useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { Plus, Loader2, Search, X } from "lucide-react";
import type { AxiosError } from "axios";
import { useMocks, useCreateMock, useDeleteMock } from "@/api/useMocks";
import { useMockForm } from "@/hooks/useMockForm";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import MockCard from "@/components/mocks/MockCard";
import DeleteMockConfirmDialog from "@/components/mocks/DeleteMockConfirmDialog";
import EmptyState from "@/components/mocks/EmptyState";
import MockForm from "@/components/mocks/MockForm";
import { useToast } from "@/contexts/ToastContext";
import { useUIStore } from "@/stores/ui.store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MockList() {
  const navigate = useNavigate();
  const { data: mocks, isLoading } = useMocks();
  const createMock = useCreateMock();
  const deleteMock = useDeleteMock();
  const form = useMockForm();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const openPaywall = useUIStore((s) => s.openPaywall);

  const filteredMocks = useMemo(() => {
    if (!mocks || !searchQuery) return mocks ?? [];
    const q = searchQuery.toLowerCase();
    return mocks.filter((mock) => (mock.name ?? "").toLowerCase().includes(q));
  }, [mocks, searchQuery]);

  const maxSlots = 3;
  const usedSlots = mocks?.length ?? 0;

  const handleCreate = useCallback(
    (data: { name: string; path: string; methods: string[] }) => {
      createMock.mutate(data, {
        onSuccess: (created) => {
          setDialogOpen(false);
          form.reset();
          toast("success", "Mock created successfully");
          navigate(`/dashboard/mocks/${created.id}`);
        },
        onError: (error) => {
          const axiosErr = error as AxiosError<{ error: string; message: string }>;
          if (
            axiosErr.response?.status === 403 &&
            axiosErr.response?.data?.error === "FREE_TIER_LIMIT_REACHED"
          ) {
            openPaywall();
          } else if (axiosErr.response?.status === 409) {
            const code = axiosErr.response?.data?.error;
            if (code === "MOCK_NAME_DUPLICATE" || code === "MOCK_PATH_DUPLICATE") {
              toast("error", axiosErr.response?.data?.message || "Duplicate mock");
            }
          }
        },
      });
    },
    [createMock, form, toast, navigate],
  );

  const handleCopyUrl = useCallback(
    async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        toast("success", "URL copied to clipboard");
      } catch {
        toast("error", "Failed to copy URL");
      }
    },
    [toast],
  );

  const handleDelete = (id: string, name: string) => {
    setConfirmDelete({ id, name });
  };

  const doDelete = () => {
    if (confirmDelete) {
      deleteMock.mutate(confirmDelete.id, {
        onSuccess: () => {
          toast("success", "Mock deleted");
          setConfirmDelete(null);
        },
        onError: (error) => {
          const axiosErr = error as AxiosError<{ message: string }>;
          const message =
            axiosErr?.response?.data?.message || "Failed to delete mock";
          toast("error", message);
        },
      });
    }
  };

  useKeyboardShortcuts([
    {
      key: "n",
      handler: () => {
        if (usedSlots < maxSlots && !dialogOpen) {
          setDialogOpen(true);
        }
      },
    },
    {
      key: "/",
      handler: () => {
        searchInputRef.current?.focus();
      },
      enabled: !dialogOpen,
    },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent-blue before:to-accent-blue/30 before:rounded-full">
          <h1 className="text-[24px] font-semibold text-text-primary">Mocks</h1>
          <p className="mt-1 text-[13px] text-text-secondary">
            {usedSlots}/{maxSlots} slots used
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (usedSlots >= maxSlots) {
            openPaywall();
            } else {
              setDialogOpen(true);
            }
          }}
          className="flex items-center gap-2 rounded-none bg-accent-blue px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create Mock
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      ) : !Array.isArray(mocks) || mocks.length === 0 ? (
        <EmptyState onCreateClick={() => setDialogOpen(true)} />
      ) : (
        <>
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mocks by name... (/)"
              className="w-full rounded-none border border-border-strong bg-bg-terminal py-2 pl-10 pr-9 text-[13px] text-text-primary placeholder-text-secondary outline-none focus:ring-1 focus:ring-accent-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-[12px] text-text-muted">
            Showing {filteredMocks.length} of {mocks.length} mocks
          </p>
          {filteredMocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-text-muted">
              <Search className="mb-3 h-10 w-10" />
              <p className="text-[14px]">No mocks match your search</p>
            </div>
          ) : (
            <div className="mt-4 w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMocks.map((mock) => (
                <MockCard
                  key={mock.id}
                  mock={mock}
                  onDelete={handleDelete}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Mock</DialogTitle>
          </DialogHeader>
          <MockForm
            form={form}
            onSubmit={handleCreate}
            submitLabel="Create Mock"
            isSubmitting={createMock.isPending}
          />
        </DialogContent>
      </Dialog>
      {confirmDelete && (
        <DeleteMockConfirmDialog
          open={true}
          mockName={confirmDelete.name}
          isPending={deleteMock.isPending}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
