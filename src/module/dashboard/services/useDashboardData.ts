import { useAuth } from "@/contexts/AuthContext";

import { useQuery } from "@tanstack/react-query";
import { DashboardData } from "../types";

const useDashboardData = () => {
  const { callSlackAPI } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => callSlackAPI<DashboardData>("dashboard"),
  });
};

export default useDashboardData;
