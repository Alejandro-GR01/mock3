import axios from "axios";
import { getAuthToken } from "@/lib/authToken";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";
    const errorCode = error.response?.data?.error;

    if (status === 401) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            type: "error",
            message: "Session expired. Please sign in again.",
          },
        })
      );
    } else if (status === 429) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            type: "warning",
            message: "Rate limit exceeded. Please wait before trying again.",
          },
        })
      );
    } else if (status === 403) {
      if (errorCode === "FREE_TIER_LIMIT_REACHED") {
        // MockList handles this specifically with PaywallModal
      } else {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { type: "error", message },
          })
        );
      }
    } else if (status && status >= 500) {
      window.dispatchEvent(
        new CustomEvent("app:toast", {
          detail: {
            type: "error",
            message: "Server error. Please try again later.",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default http;
