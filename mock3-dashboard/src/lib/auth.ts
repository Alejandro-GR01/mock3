import http from "./http";

export async function syncUser(): Promise<void> {
  try {
    await http.post("/api/auth/sync");
  } catch (error) {
    console.error("[auth/syncUser] Failed to sync user:", error);
  }
}
