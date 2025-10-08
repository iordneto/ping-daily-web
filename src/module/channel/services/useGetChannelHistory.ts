import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export interface DailyStandupResponse {
  userId: string;
  message: string;
  timestamp: string;
  status: "completed" | "partial" | "missed";
}

export interface DailyStandupHistory {
  id: string;
  channelId: string;
  configId: string;
  date: string;
  sentAt: string;
  responseRate: number; // 0-100
  totalMembers: number;
  responses: DailyStandupResponse[];
  compiledMessage?: string;
}

export interface DailyStandupHistoryResponse {
  history: DailyStandupHistory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const useGetChannelHistory = (channelId: string) => {
  const { callSlackAPI } = useAuth();

  return useQuery({
    queryKey: ["channel-history"],
    queryFn: () =>
      callSlackAPI<DailyStandupHistoryResponse>(`channel/${channelId}/history`),
  });
};

export default useGetChannelHistory;
