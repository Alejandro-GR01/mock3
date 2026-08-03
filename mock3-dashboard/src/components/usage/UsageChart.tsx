import { useState, useMemo } from "react";
import ChartCard from "@/components/ui/ChartCard";

interface UsageChartProps {
  hourlyData: number[];
}

export default function UsageChart({ hourlyData }: UsageChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const shiftedData = useMemo(() => {
    const now = new Date();
    const localHour = now.getHours();
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = Math.round(offsetMinutes / 60);
    const shift = ((localHour - 23 + offsetHours) % 24 + 24) % 24;

    return hourlyData.map((_, i) => hourlyData[(i + shift) % 24] ?? 0);
  }, [hourlyData]);

  const maxCount = useMemo(() => Math.max(...shiftedData, 1), [shiftedData]);

  const hoveredHour =
    hoveredIndex !== null
      ? new Date(
          Date.now() - (23 - hoveredIndex) * 60 * 60 * 1000
        ).getHours()
      : null;

  const subtitleText =
    hoveredIndex !== null && hoveredHour !== null
      ? `${hoveredHour.toString().padStart(2, "0")}:00 — ${shiftedData[hoveredIndex].toLocaleString()} requests`
      : "";

  return (
    <ChartCard
      title="Requests over last 24 hours"
      subtitle={subtitleText}
    >
      <div className="flex items-end gap-1 h-[80px]">
        {shiftedData.map((count, i) => {
          const heightPct = (count / maxCount) * 100;
          const hour = new Date();
          hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end h-full"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`w-full rounded-none transition-all duration-200 ease-out cursor-pointer ${
                  hoveredIndex === i ? "bg-accent-blue" : "bg-accent-blue/40"
                }`}
                style={{
                  height: `${heightPct}%`,
                }}
                title={`${hour.getHours().toString().padStart(2, "0")}:00 — ${count.toLocaleString()} requests`}
              />
            </div>
          );
        })}
      </div>
      <div className="relative mt-2">
        <div className="flex justify-between">
          {shiftedData.map((_, i) => {
            const hour = new Date();
            hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
            const h = hour.getHours();
            if (h % 4 === 0) {
              return (
                <span key={i} className="text-[10px] text-text-muted">
                  {h.toString().padStart(2, "0")}:00
                </span>
              );
            }
            return <span key={i} className="text-[10px] text-transparent">-</span>;
          })}
        </div>
      </div>
    </ChartCard>
  );
}
