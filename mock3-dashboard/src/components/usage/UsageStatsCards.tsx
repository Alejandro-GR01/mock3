import { Activity, Gauge, Box } from "lucide-react";
import type { UsageStats, CurrentUsage } from "@/types";
import KPICard from "@/components/ui/KPICard";

interface UsageStatsCardsProps {
  stats: UsageStats;
  current: CurrentUsage;
}

function calcChange(currentCount: number, hourlyData: number[]): number | undefined {
  const maxHourly = Math.max(...hourlyData, 0);
  if (maxHourly === 0) return undefined;
  return Math.round(((currentCount - maxHourly) / maxHourly) * 100);
}

export default function UsageStatsCards({ stats, current }: UsageStatsCardsProps) {
  const remainingChange = calcChange(current.count, stats.hourlyData);

  return (
    <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <KPICard
        title="Requests Today"
        value={stats.today.toLocaleString()}
        icon={Activity}
        iconClassName="text-accent-blue"
      />
      <KPICard
        title="Remaining"
        value={current.remaining.toLocaleString()}
        change={remainingChange}
        changeLabel="vs peak hour"
        icon={Gauge}
        iconClassName="text-state-success"
      />
      <KPICard
        title="Active Mocks"
        value={`${stats.mockSlots.used} / ${stats.mockSlots.max}`}
        icon={Box}
        iconClassName="text-state-info"
      />
    </div>
  );
}
