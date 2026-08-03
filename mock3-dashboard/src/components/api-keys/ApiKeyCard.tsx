import { MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/types";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}

function getExpirationBadge(expiresAt: string | null) {
  if (expiresAt === null) {
    return {
      text: "No expiration",
      bgClass: "bg-state-success/10 text-state-success",
      dotClass: "bg-state-success",
    };
  }

  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) {
    return {
      text: "Expired",
      bgClass: "bg-state-error/10 text-state-error",
      dotClass: "bg-state-error",
    };
  }

  if (diffHours <= 24) {
    return {
      text: "Expires soon",
      bgClass: "bg-state-warning/10 text-state-warning",
      dotClass: "bg-state-warning",
    };
  }

  const diffDays = Math.ceil(diffHours / 24);
  return {
    text: `Expires in ${diffDays}d`,
    bgClass: "bg-state-success/10 text-state-success",
    dotClass: "bg-state-success",
  };
}

export default function ApiKeyCard({ apiKey, onRegenerate, onDelete }: ApiKeyCardProps) {
  const badge = getExpirationBadge(apiKey.expiresAt);
  const isExpired = apiKey.expiresAt !== null && new Date(apiKey.expiresAt) <= new Date();

  return (
    <div className="group relative border border-border-strong bg-gradient-to-t from-primary/5 to-card p-4 transition-all duration-200 hover:border-accent-blue/30">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-blue/0 via-accent-blue/50 to-accent-blue/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`inline-block h-2 w-2 rounded-full ${badge.dotClass} shrink-0`}
          />
          <span className="text-sm font-semibold text-foreground truncate">
            {apiKey.name || "Untitled Key"}
          </span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded ${badge.bgClass}`}
          >
            {badge.text}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Key actions"
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onRegenerate(apiKey.id)}
              disabled={isExpired}
              className={isExpired ? "opacity-50" : ""}
            >
              <RefreshCw size={14} className="mr-2" />
              Regenerate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(apiKey.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
