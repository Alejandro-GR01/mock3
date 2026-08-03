import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface RateLimitBarProps {
  count: number;
  limit: number;
  label?: string;
  unit?: string;
}

const TICKS = [0, 1, 2, 3, 4];

export default function RateLimitBar({
  count,
  limit,
  label = "Rate Limit",
  unit = "req/hour",
}: RateLimitBarProps) {
  const isOverLimit = count > limit;
  const percent = limit > 0 ? Math.min((count / limit) * 100, 100) : 0;

  return (
    <Card className="rounded-none border-border-strong shadow-none bg-gradient-to-t from-primary/5 to-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary">
            {label}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-text-secondary">
            {count} / {limit}
            <span className="text-text-muted"> {unit}</span>
            {isOverLimit && (
              <span className="ml-2 font-semibold text-http-delete">
                +{count - limit} over
              </span>
            )}
          </span>
        </div>

        {/* Meter track — inset terminal well, visible in empty state */}
        <div className="relative h-3 w-full border border-border-strong bg-bg-terminal">
          {/* scale ticks */}
          <div className="absolute inset-0 flex justify-between">
            {TICKS.map((t) => (
              <div key={t} className="h-full w-px bg-border-strong/40" />
            ))}
          </div>
          {/* fill */}
          <div
            className={cn(
              "relative h-full transition-all duration-300",
              percent < 80 && "bg-http-get",
              percent >= 80 && percent < 95 && "bg-http-put",
              percent >= 95 && "bg-http-delete"
            )}
            style={{ width: `${percent}%`, minWidth: count > 0 ? "4px" : "0px" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
