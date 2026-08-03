import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
}: ChartCardProps) {
  return (
    <div className="group relative bg-gradient-to-t from-primary/5 to-card border border-border-strong">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-blue/0 via-accent-blue/50 to-accent-blue/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-[13px] font-semibold text-text-primary">
            {title}
          </h3>
          <p
            className={cn(
              "text-[11px] mt-0.5",
              subtitle ? "text-text-secondary" : "invisible select-none"
            )}
          >
            {subtitle || "·"}
          </p>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
