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
  });
};

export default useDashboardData;
