import { useEffect, useState } from "react";

interface LiveIndicatorProps {
  lastUpdated: Date | null;
}

export default function LiveIndicator({ lastUpdated }: LiveIndicatorProps) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lastUpdated) return null;

  const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <div className="flex items-center gap-2 text-[12px] text-text-secondary">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-state-success" />
      </span>
      Updated{" "}
      {seconds < 60
        ? `${seconds}s ago`
        : `${Math.floor(seconds / 60)}m ago`}
    </div>
  );
}
