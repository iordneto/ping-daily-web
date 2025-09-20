/**
 * React Query configuration and providers
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { APIClientError } from "./api";
import { toast } from "sonner";

// Create a client
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Don't retry on auth errors
          if (error instanceof APIClientError && error.isAuthError) {
            return false;
          }
          // Don't retry more than 2 times
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // Global error handling for mutations
          if (error instanceof APIClientError) {
            toast.error(error.error.error);
          } else if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Query key factories
export const queryKeys = {
  // Authentication
  auth: {
    me: ["auth", "me"] as const,
    status: ["auth", "status"] as const,
  },

  // Channels
  channels: {
    all: ["channels"] as const,
    list: () => [...queryKeys.channels.all, "list"] as const,
    available: () => [...queryKeys.channels.all, "available"] as const,
    detail: (channelId: string) =>
      [...queryKeys.channels.all, "detail", channelId] as const,
  },

  // Check-ins
  checkins: {
    all: ["checkins"] as const,
    status: () => [...queryKeys.checkins.all, "status"] as const,
    channelStatus: (channelId: string) =>
      [...queryKeys.checkins.all, "status", channelId] as const,
    latest: (channelId: string) =>
      [...queryKeys.checkins.all, "latest", channelId] as const,
    overview: (days?: number) =>
      [...queryKeys.checkins.all, "overview", { days }] as const,
  },

  // History
  history: {
    all: ["history"] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.history.all, "list", filters] as const,
    detail: (uuid: string) =>
      [...queryKeys.history.all, "detail", uuid] as const,
    channel: (channelId: string, filters?: Record<string, any>) =>
      [...queryKeys.history.all, "channel", channelId, filters] as const,
    analytics: (days?: number) =>
      [...queryKeys.history.all, "analytics", { days }] as const,
  },
} as const;
