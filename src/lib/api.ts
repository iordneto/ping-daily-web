/**
 * API Client Configuration
 *
 * Centralized configuration for making API calls to the ping-daily backend.
 * Handles authentication, error handling, and response formatting.
 * Integrates with Next-Auth for session management.
 */

import { getSession } from "next-auth/react";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export interface APIError {
  error: string;
  code: string;
  details?: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === "undefined") {
      return null;
    }

    const session = await getSession();
    return session?.backendToken || null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = await this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: APIError = await response.json().catch(() => ({
          error: "Unknown error occurred",
          code: "UNKNOWN_ERROR",
          timestamp: new Date().toISOString(),
        }));

        throw new APIClientError(errorData, response.status);
      }

      const data: APIResponse<T> = await response.json();
      return data;
    } catch (error) {
      if (error instanceof APIClientError) {
        throw error;
      }

      throw new APIClientError(
        {
          error: error instanceof Error ? error.message : "Network error",
          code: "NETWORK_ERROR",
          timestamp: new Date().toISOString(),
        },
        0
      );
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<APIResponse<T>> {
    const searchParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${searchParams}`, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Health check
  async healthCheck(): Promise<
    APIResponse<{ status: string; timestamp: string; version: string }>
  > {
    return this.get("/api/health");
  }
}

export class APIClientError extends Error {
  public readonly status: number;
  public readonly error: APIError;

  constructor(error: APIError, status: number) {
    super(error.error);
    this.name = "APIClientError";
    this.error = error;
    this.status = status;
  }

  get isAuthError() {
    return this.status === 401 || this.error.code === "TOKEN_EXPIRED";
  }

  get isPermissionError() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isValidationError() {
    return this.status === 400 && this.error.code === "VALIDATION_ERROR";
  }
}

// Global API client instance
export const apiClient = new APIClient(API_BASE_URL);

// Helper function for handling API errors in components
export function handleAPIError(error: unknown): string {
  if (error instanceof APIClientError) {
    return error.error.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
