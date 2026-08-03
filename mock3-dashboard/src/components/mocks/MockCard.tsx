import { useNavigate } from "react-router";
import { Copy, Pencil, Trash2 } from "lucide-react";
import type { Mock } from "@/types";
import MethodBadge from "./MethodBadge";

interface MockCardProps {
  mock: Mock;
  onDelete: (id: string, name: string) => void;
  onCopyUrl?: (url: string) => void;
}

export default function MockCard({ mock, onDelete, onCopyUrl }: MockCardProps) {
  const navigate = useNavigate();
  const methods = Object.keys(mock.methods);
  const displayName = mock.name || mock.slug;
  const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const mockUrl = `${backendUrl}/mocks/${mock.path}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyUrl?.(mockUrl);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(mock.id, mock.name || mock.slug);
  };

  const handleEdit = () => {
    navigate(`/dashboard/mocks/${mock.id}`);
  };

  return (
    <div
      className="max-w-full overflow-x-hidden  flex flex-col border-l-2 border-l-accent-blue border-y border-r border-border-strong bg-linear-to-t from-primary/5 to-card p-4 cursor-pointer hover:bg-bg-terminal/80 transition-all duration-200"
      onClick={handleEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          handleEdit();
        }
      }}
    >
      <div className=" flex flex-col items-stretch justify-between w-full max-w-fu">
        <div className="flex-1 min-w-0 flex  justify-between">
          <h3 className="text-[14px] font-medium text-text-primary truncate">
            {displayName}
          </h3>
          <div className="ml-2 flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="rounded-none p-1 text-text-muted hover:text-text-primary hover:bg-bg-editor transition-colors"
              aria-label="Edit mock"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-none p-1 text-text-muted hover:text-text-primary hover:bg-bg-editor transition-colors"
              aria-label="Copy mock URL"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-none p-1 text-text-muted hover:text-state-error hover:bg-state-error/10 transition-colors"
              aria-label="Delete mock"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex">
          <p
            className="mt-1 font-mono text-[12px] text-text-secondary truncate w-fit"
            title={mockUrl}
          >
            {mockUrl}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {methods.map((method) => (
          <MethodBadge key={method} method={method} />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-text-muted">
        Created{" "}
        {new Date(mock.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
