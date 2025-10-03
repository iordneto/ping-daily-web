import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ChannelWithConfig } from "../types";

/*
 * Get channel info
 * @returns {Object} An object containing channel info
 */
const useGetChannelInfo = (channelId: string) => {
  const { callSlackAPI } = useAuth();

  return useQuery({
    queryKey: ["channel-info"],
    queryFn: () => callSlackAPI<ChannelWithConfig>(`channel/${channelId}`),
  });
};

export default useGetChannelInfo;
