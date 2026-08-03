export const httpMethodColors: Record<string, { text: string; bg: string; borderL: string }> = {
  GET: { text: "text-http-get", bg: "bg-http-get/10", borderL: "border-l-http-get" },
  POST: { text: "text-http-post", bg: "bg-http-post/10", borderL: "border-l-http-post" },
  PUT: { text: "text-http-put", bg: "bg-http-put/10", borderL: "border-l-http-put" },
  PATCH: { text: "text-http-patch", bg: "bg-http-patch/10", borderL: "border-l-http-patch" },
  DELETE: { text: "text-http-delete", bg: "bg-http-delete/10", borderL: "border-l-http-delete" },
};

export function getMethodColor(method: string) {
  return httpMethodColors[method.toUpperCase()] ?? {
    text: "text-text-secondary",
    bg: "bg-text-secondary/10",
    borderL: "border-l-text-secondary",
  };
}

export const httpStatusCodeColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  "1xx": {
    text: "text-state-info",
    bg: "bg-state-info/10",
    border: "border-border-strong",
  },
  "2xx": {
    text: "text-state-success",
    bg: "bg-state-success/10",
    border: "border-border-strong",
  },
  "3xx": {
    text: "text-accent-blue",
    bg: "bg-accent-blue/10",
    border: "border-border-strong",
  },
  "4xx": {
    text: "text-state-warning",
    bg: "bg-state-warning/10",
    border: "border-border-strong",
  },
  "5xx": {
    text: "text-state-error",
    bg: "bg-state-error/10",
    border: "border-border-strong",
  },
  invalid: {
    text: "text-state-error",
    bg: "bg-state-error/20",
    border: "border-state-error",
  },
};

export function getStatusCodeColor(status: number) {
  if (!Number.isFinite(status) || status < 100 || status > 599) {
    return httpStatusCodeColors.invalid;
  }
  if (status < 200) return httpStatusCodeColors["1xx"];
  if (status < 300) return httpStatusCodeColors["2xx"];
  if (status < 400) return httpStatusCodeColors["3xx"];
  if (status < 500) return httpStatusCodeColors["4xx"];
  return httpStatusCodeColors["5xx"];
}
