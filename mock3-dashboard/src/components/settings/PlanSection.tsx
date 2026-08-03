import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import RateLimitBar from "@/components/usage/RateLimitBar";
import { useUIStore } from "@/stores/ui.store";
import type { UserProfile } from "@/types";

interface PlanSectionProps {
  me: UserProfile | undefined;
  requestsUsage: { count: number; limit: number } | undefined;
  mocksUsage: { used: number; max: number } | undefined;
  isLoading: boolean;
}

export default function PlanSection({
  me,
  requestsUsage,
  mocksUsage,
  isLoading,
}: PlanSectionProps) {
  const openPaywall = useUIStore((s) => s.openPaywall);

  return (
    <Card className="rounded-none border-border-strong bg-card shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-text-primary">Plan</span>
          {isLoading ? (
            <div className="h-5 w-14 animate-pulse bg-border" />
          ) : me ? (
            <span
              className={cn(
                "rounded-none border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                me.plan === "pro"
                  ? "border-accent-amber/30 text-accent-amber-light"
                  : "border-accent-blue/30 text-accent-blue"
              )}
            >
              {me.plan}
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="mt-4 space-y-4">
            <div className="h-12 animate-pulse bg-border" />
            <div className="h-9 animate-pulse bg-border" />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <RateLimitBar
              count={requestsUsage?.count ?? 0}
              limit={requestsUsage?.limit ?? 300}
              label="Rate Limit"
              unit="req/hour"
            />
            <RateLimitBar
              count={mocksUsage?.used ?? 0}
              limit={mocksUsage?.max ?? 3}
              label="Mock Slots"
              unit="mocks"
            />
          </div>
        )}

        {isLoading ? (
          <div className="mt-4 h-9 animate-pulse bg-border" />
        ) : (
          <button
            type="button"
            onClick={openPaywall}
            className="mt-4 w-full cursor-pointer rounded-none bg-accent-amber px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-accent-amber-light"
          >
            Upgrade to Pro
          </button>
        )}
      </CardContent>
    </Card>
  );
}
