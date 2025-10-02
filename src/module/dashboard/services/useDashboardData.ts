import { useAuth } from "@/contexts/AuthContext";
import { AvailableChannel } from "@/types/slack";
import { useQuery } from "@tanstack/react-query";
import { ChannelWithConfig } from "../types";

export type DashboardData = {
  stats: {
    configuredChannels: number;
    responseRate: number;
    activeMembers: number;
  };
  channelsWithConfig: ChannelWithConfig[];
  availableChannels: AvailableChannel[];
};

const useDashboardData = () => {
  const { callSlackAPI } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => callSlackAPI<DashboardData>("dashboard"),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useDashboardData;
