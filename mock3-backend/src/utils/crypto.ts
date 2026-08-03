import { createHash } from "node:crypto";

export function sha256Hash(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}