import { useState, useMemo } from "react";
import type { MockUsageRanking } from "@/types";
import { cn } from "@/lib/utils";
import MethodBadge from "@/components/mocks/MethodBadge";

interface MockUsageTableProps {
  ranking: MockUsageRanking[];
}

type SortKey = "name" | "path" | "requestCount";

export default function MockUsageTable({ ranking }: MockUsageTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("requestCount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    return [...ranking].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      const modifier = sortOrder === "asc" ? 1 : -1;
      return aVal < bVal ? -1 * modifier : aVal > bVal ? 1 * modifier : 0;
    });
  }, [ranking, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (ranking.length === 0) {
    return (
      <div className="bg-bg-sidebar border border-border p-6 text-center">
        <p className="text-[13px] text-text-secondary">No request data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-sidebar border border-border overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-strong transition-colors duration-150">
            {(
              [
                { key: "name" as SortKey, label: "Name" },
                { key: "path" as SortKey, label: "Path" },
                { key: null, label: "Method" },
                { key: "requestCount" as SortKey, label: "Requests" },
              ] as { key: SortKey | null; label: string }[]
            ).map((col) => (
              <th
                key={col.label}
                onClick={() => col.key && handleSort(col.key)}
                className={cn(
                  "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider bg-gradient-to-t from-primary/8 to-card border-b border-border-strong",
                  col.key
                    ? "cursor-pointer hover:from-primary/15 hover:to-primary/5 select-none"
                    : "",
                  col.key === "requestCount" ? "text-right" : "text-left",
                  col.key === sortKey
                    ? "text-accent-blue"
                    : "text-text-secondary",
                  "transition-colors duration-150"
                )}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.key === sortKey && (
                    <span className="text-[10px]">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((mock) => (
            <tr
              key={mock.mockId}
              className="border-b border-border last:border-b-0 hover:bg-accent-blue/5 transition-colors duration-150"
            >
              <td className="px-4 py-3 text-[13px] text-text-primary">
                <span className="flex items-center gap-2">
                  {mock.name ?? "Unnamed"}
                  {!mock.isActive && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-http-delete bg-http-delete/10 uppercase tracking-wider">
                      deleted
                    </span>
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-[13px] text-text-primary font-mono">
                {mock.path}
              </td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">
                <MethodBadge method={mock.method} />
              </td>
              <td className="px-4 py-3 text-[13px] text-text-primary text-right font-mono">
                {mock.requestCount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
