import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Code,
  Key,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  group: "navigate" | "actions";
  run: () => void;
}

type CommandGroup = Command["group"];

const GROUPS: CommandGroup[] = ["navigate", "actions"];

const GROUP_LABELS: Record<CommandGroup, string> = {
  navigate: "Navigate",
  actions: "Actions",
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const close = () => onOpenChange(false);

    return [
      {
        id: "nav-dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        group: "navigate",
        run: () => {
          close();
          navigate("/dashboard");
        },
      },
      {
        id: "nav-mocks",
        label: "Mocks",
        icon: Code,
        group: "navigate",
        run: () => {
          close();
          navigate("/dashboard/mocks");
        },
      },
      {
        id: "nav-api-keys",
        label: "API Keys",
        icon: Key,
        group: "navigate",
        run: () => {
          close();
          navigate("/dashboard/api-keys");
        },
      },
      {
        id: "nav-settings",
        label: "Settings",
        icon: Settings,
        group: "navigate",
        run: () => {
          close();
          navigate("/dashboard/settings");
        },
      },
      {
        id: "action-new-mock",
        label: "New Mock",
        icon: Plus,
        group: "actions",
        run: () => {
          close();
          toast("info", "Press N on the Mocks page");
        },
      },
    ];
  }, [navigate, toast, onOpenChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[selectedIndex]?.run();
    }
  };

  const navigateItems = filtered.filter((c) => c.group === "navigate");
  const actionsItems = filtered.filter((c) => c.group === "actions");

  const renderItem = (command: Command, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <button
        key={command.id}
        type="button"
        onClick={() => command.run()}
        onMouseEnter={() => setSelectedIndex(index)}
        className={cn(
          "flex w-full items-center gap-3 rounded-none px-3 py-2 text-left text-[13px] transition-colors",
          isSelected
            ? "bg-accent-blue/10 text-text-primary"
            : "text-text-secondary hover:bg-accent-blue/5",
        )}
      >
        <command.icon
          size={16}
          className={cn(
            "shrink-0",
            isSelected ? "text-accent-blue" : "text-text-muted",
          )}
        />
        <span>{command.label}</span>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className="gap-0 rounded-none border-border bg-bg-editor p-0 shadow-none sm:max-w-lg"
      >
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="w-full rounded-none border border-border-strong bg-bg-terminal py-2.5 pl-10 pr-4 text-[13px] text-text-primary placeholder-text-secondary outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-text-muted">
              No commands found
            </div>
          ) : (
            GROUPS.map((group) => {
              const items = group === "navigate" ? navigateItems : actionsItems;
              if (items.length === 0) return null;
              const offset = group === "navigate" ? 0 : navigateItems.length;

              return (
                <div key={group}>
                  <div className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-wider text-text-muted">
                    {GROUP_LABELS[group]}
                  </div>
                  {items.map((command, i) => renderItem(command, offset + i))}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
