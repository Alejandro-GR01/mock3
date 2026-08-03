import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconClassName?: string;
}

export default function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconClassName,
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div data-slot="card" className="group relative bg-gradient-to-t from-primary/5 to-card border border-border-strong p-4 transition-all duration-200 hover:border-accent-blue/30">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent-blue/0 via-accent-blue/50 to-accent-blue/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-muted">
          {title}
        </span>
        {Icon && <Icon size={16} className={cn("text-text-muted", iconClassName)} />}
      </div>
      <p className="mt-3 text-[24px] font-semibold text-text-primary">
        {value}
      </p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "text-[12px] font-medium",
              isPositive && "text-state-success",
              isNegative && "text-state-error",
              !isPositive && !isNegative && "text-text-secondary"
            )}
          >
            {isPositive && "+"}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-[12px] text-text-secondary">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
