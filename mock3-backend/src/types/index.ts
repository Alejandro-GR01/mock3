export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
}