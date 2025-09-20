/**
 * API hooks using React Query
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, APIResponse } from "@/lib/api";
import { queryKeys } from "@/lib/react-query";
import {
  User,
  AuthSession,
  ChannelConfig,
  CreateChannelConfigRequest,
  UpdateChannelConfigRequest,
  AvailableChannel,
  CheckinStatus,
  CheckinSummary,
  HistoricalCheckin,
  DetailedHistoricalCheckin,
  TeamAnalytics,
  PaginationMeta,
} from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Authentication Hooks
export function useAuth() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiClient.get<User>("/api/auth/me"),
    enabled: !!session?.backendToken,
  });
}

export function useAuthStatus() {
  const { data: session, status } = useSession();

  return {
    data: {
      authenticated: status === "authenticated",
      user: session?.user,
    },
    isLoading: status === "loading",
    error: null,
  };
}

// These hooks are simplified since we use Next-Auth directly
// Login and logout are handled through Next-Auth's signIn/signOut functions
export function useLoginMutation() {
  return useMutation({
    mutationFn: async () => {
      // This is a placeholder - actual login is handled in the component
      throw new Error("Use signIn from next-auth/react instead");
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This is a placeholder - actual logout is handled in the component
      throw new Error("Use signOut from next-auth/react instead");
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
    },
  });
}

// Channel Management Hooks
export function useChannels() {
  return useQuery({
    queryKey: queryKeys.channels.list(),
    queryFn: () => apiClient.get<ChannelConfig[]>("/api/channels"),
  });
}

export function useAvailableChannels() {
  return useQuery({
    queryKey: queryKeys.channels.available(),
    queryFn: () => apiClient.get<AvailableChannel[]>("/api/channels/available"),
  });
}

export function useChannel(channelId: string) {
  return useQuery({
    queryKey: queryKeys.channels.detail(channelId),
    queryFn: () => apiClient.get<ChannelConfig>(`/api/channels/${channelId}`),
    enabled: !!channelId,
  });
}

export function useCreateChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChannelConfigRequest) =>
      apiClient.post<ChannelConfig>("/api/channels", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all });
      toast.success("Channel configuration created successfully");
    },
  });
}

export function useUpdateChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      channelId,
      data,
    }: {
      channelId: string;
      data: UpdateChannelConfigRequest;
    }) => apiClient.put<ChannelConfig>(`/api/channels/${channelId}`, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.channels.detail(variables.channelId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all });
      toast.success("Channel configuration updated successfully");
    },
  });
}

export function useDeleteChannelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      channelId,
      permanent = false,
    }: {
      channelId: string;
      permanent?: boolean;
    }) => apiClient.delete(`/api/channels/${channelId}?permanent=${permanent}`),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all });
      const action = variables.permanent
        ? "deleted permanently"
        : "deactivated";
      toast.success(`Channel configuration ${action} successfully`);
    },
  });
}

// Check-in Status Hooks
export function useCheckinStatus() {
  return useQuery({
    queryKey: queryKeys.checkins.status(),
    queryFn: () => apiClient.get<CheckinStatus[]>("/api/checkins/status"),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useChannelCheckinStatus(channelId: string) {
  return useQuery({
    queryKey: queryKeys.checkins.channelStatus(channelId),
    queryFn: () =>
      apiClient.get<CheckinStatus>(`/api/checkins/${channelId}/status`),
    enabled: !!channelId,
    refetchInterval: 15000, // Refetch every 15 seconds for active channel
  });
}

export function useLatestCheckin(channelId: string) {
  return useQuery({
    queryKey: queryKeys.checkins.latest(channelId),
    queryFn: () =>
      apiClient.get<CheckinSummary>(`/api/checkins/${channelId}/latest`),
    enabled: !!channelId,
  });
}

export function useTeamOverview(days: number = 7) {
  return useQuery({
    queryKey: queryKeys.checkins.overview(days),
    queryFn: () =>
      apiClient.get<any>(`/api/checkins/team/overview?days=${days}`),
  });
}

export function useGenerateSummaryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) =>
      apiClient.post<{ message: string; postedToChannel: boolean }>(
        `/api/checkins/${channelId}/summary`
      ),
    onSuccess: (response, channelId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.checkins.channelStatus(channelId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.checkins.latest(channelId),
      });
      toast.success("Summary generated successfully");
    },
  });
}

// History Hooks
export function useHistory(filters?: {
  page?: number;
  limit?: number;
  channelId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: queryKeys.history.list(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.page) params.set("page", filters.page.toString());
      if (filters?.limit) params.set("limit", filters.limit.toString());
      if (filters?.channelId) params.set("channelId", filters.channelId);
      if (filters?.status) params.set("status", filters.status);
      if (filters?.startDate) params.set("startDate", filters.startDate);
      if (filters?.endDate) params.set("endDate", filters.endDate);

      return apiClient.get<HistoricalCheckin[]>(
        `/api/history?${params.toString()}`
      );
    },
    keepPreviousData: true,
  });
}

export function useHistoryDetail(uuid: string) {
  return useQuery({
    queryKey: queryKeys.history.detail(uuid),
    queryFn: () =>
      apiClient.get<DetailedHistoricalCheckin>(`/api/history/${uuid}`),
    enabled: !!uuid,
  });
}

export function useChannelHistory(
  channelId: string,
  filters?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  return useQuery({
    queryKey: queryKeys.history.channel(channelId, filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.page) params.set("page", filters.page.toString());
      if (filters?.limit) params.set("limit", filters.limit.toString());
      if (filters?.startDate) params.set("startDate", filters.startDate);
      if (filters?.endDate) params.set("endDate", filters.endDate);

      return apiClient.get<HistoricalCheckin[]>(
        `/api/history/channels/${channelId}?${params.toString()}`
      );
    },
    enabled: !!channelId,
    keepPreviousData: true,
  });
}

export function useTeamAnalytics(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.history.analytics(days),
    queryFn: () =>
      apiClient.get<TeamAnalytics>(`/api/history/analytics/team?days=${days}`),
  });
}
