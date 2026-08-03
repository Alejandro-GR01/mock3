import { useMemo } from "react";
import { Code, Key } from "lucide-react";
import { useApiKeys } from "@/api/useApiKeys";
import { useMocks } from "@/api/useMocks";
import {
  useUsageStats,
  useCurrentUsage,
  useMockUsageRanking,
} from "@/api/useUsage";
import KPICard from "@/components/ui/KPICard";
import LiveIndicator from "@/components/ui/LiveIndicator";
import UsageStatsCards from "@/components/usage/UsageStatsCards";
import RateLimitBar from "@/components/usage/RateLimitBar";
import UsageChart from "@/components/usage/UsageChart";
import MockUsageTable from "@/components/usage/MockUsageTable";

function SkeletonCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-bg-sidebar border border-border p-4 animate-pulse"
        >
          <div className="h-6 w-20 bg-border" />
          <div className="h-3 w-24 bg-border mt-2" />
        </div>
      ))}
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="bg-bg-sidebar border border-border p-4 animate-pulse">
      <div className="h-2 w-full bg-border" />
    </div>
  );
}

export default function Dashboard() {
  const {
    data: apiKeys,
    isLoading: keysLoading,
    dataUpdatedAt: keysUpdatedAt,
  } = useApiKeys();
  const {
    data: mocks,
    isLoading: mocksLoading,
    dataUpdatedAt: mocksUpdatedAt,
  } = useMocks();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    dataUpdatedAt: statsUpdatedAt,
  } = useUsageStats();
  const {
    data: current,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
    dataUpdatedAt: currentUpdatedAt,
  } = useCurrentUsage();
  const {
    data: ranking,
    isLoading: rankingLoading,
    error: rankingError,
    refetch: refetchRanking,
  } = useMockUsageRanking();

  const overviewLoading = keysLoading || mocksLoading;
  const usageLoading = statsLoading || currentLoading;
  const hasError = statsError || currentError || rankingError;

  const lastUpdated = useMemo(() => {
    const timestamps = [
      keysUpdatedAt,
      mocksUpdatedAt,
      statsUpdatedAt,
      currentUpdatedAt,
    ].filter(Boolean);
    return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null;
  }, [keysUpdatedAt, mocksUpdatedAt, statsUpdatedAt, currentUpdatedAt]);

  const handleRetry = () => {
    refetchStats();
    refetchCurrent();
    refetchRanking();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary">
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-text-secondary">
            Welcome to Mock3. Manage your mock API endpoints.
          </p>
        </div>
        <LiveIndicator lastUpdated={lastUpdated} />
      </div>

      {/* Overview KPIs */}
      <div className="*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid gap-4 sm:grid-cols-2">
        <KPICard
          title="Mocks"
          value={overviewLoading ? "..." : String(mocks?.length ?? 0)}
          icon={Code}
          iconClassName="text-accent-blue"
        />
        <KPICard
          title="API Keys"
          value={overviewLoading ? "..." : String(apiKeys?.length ?? 0)}
          icon={Key}
          iconClassName="text-accent-amber"
        />
      </div>

      {/* Usage Section */}
      <h2 className="text-[16px] font-semibold text-text-primary border-l-2 border-accent-blue pl-3">
        Usage
      </h2>

      {hasError ? (
        <div className="bg-bg-sidebar border border-border p-6 text-center">
          <p className="text-[13px] text-state-error mb-3">
            Failed to load usage data
          </p>
          <button
            onClick={handleRetry}
            className="text-[12px] px-4 py-2 bg-accent-blue text-white font-medium hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : usageLoading || !stats || !current ? (
        <div className="space-y-6">
          <SkeletonCards />
          <SkeletonBar />
        </div>
      ) : (
        <>
          <UsageStatsCards stats={stats} current={current} />
          <RateLimitBar count={current.count} limit={current.limit} />
          <UsageChart hourlyData={stats?.hourlyData ?? []} />
        </>
      )}

      {/* Mock Usage Section */}
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary mb-3 border-l-2 border-accent-blue pl-3">
          Mock Usage
        </h2>
        {rankingError ? (
          <div className="bg-bg-sidebar border border-border p-6 text-center">
            <p className="text-[13px] text-state-error mb-3">
              Failed to load mock ranking
            </p>
            <button
              onClick={() => refetchRanking()}
              className="text-[12px] px-4 py-2 bg-accent-blue text-white font-medium hover:opacity-90"
            >
              Retry
            </button>
          </div>
        ) : rankingLoading ? (
          <div className="bg-bg-sidebar border border-border p-6 animate-pulse">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-border" />
              ))}
            </div>
          </div>
        ) : (
          <MockUsageTable ranking={ranking ?? []} />
        )}
      </div>
    </div>
  );
}
