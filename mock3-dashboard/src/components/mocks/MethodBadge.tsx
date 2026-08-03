import { getMethodColor } from "@/lib/http-colors";

interface MethodBadgeProps {
  method: string;
}

export default function MethodBadge({ method }: MethodBadgeProps) {
  const colors = getMethodColor(method);

  return (
    <span
      className={`inline-block rounded-none px-[6px] py-[2px] font-mono text-[11px] font-bold uppercase ${colors.text} ${colors.bg}`}
    >
      {method}
    </span>
  );
}
