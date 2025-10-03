import { useAuth } from "@/contexts/AuthContext";
import { AvailableChannel } from "@/types/slack";
import { useQuery } from "@tanstack/react-query";

export type DashboardData = AvailableChannel[];

const useAvailableChannels = () => {
  const { callSlackAPI } = useAuth();

  return useQuery({
    queryKey: ["available-channels"],
    queryFn: () => callSlackAPI<DashboardData>("dashboard/available-channels"),
  });
};

export default useAvailableChannels;
