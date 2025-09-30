import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";

// Daily standup configuration
export interface DailyStandupConfig {
  id: string;
  isActive: boolean;
  time: string;
  frequency: string[];
  timezone: string;
}

// Channel with configuration for dashboard
export interface ChannelWithConfig {
  id: string;
  name: string;
  displayName: string;
  memberCount: number;
  isPrivate: boolean;
  hasConfiguration: boolean;
  config: DailyStandupConfig;
}

// Available channel (raw Slack channel data)
export interface AvailableChannel {
  id: string;
  created: number;
  creator: string;
  is_org_shared: boolean;
  is_im: boolean;
  context_team_id: string;
  updated: number;
  name: string;
  name_normalized: string;
  is_channel: boolean;
  is_group: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_archived: boolean;
  is_general: boolean;
  is_shared: boolean;
  is_ext_shared: boolean;
  unlinked: number;
  is_pending_ext_shared: boolean;
  pending_shared: any[];
  parent_conversation: any;
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  shared_team_ids: string[];
  pending_connected_team_ids: any[];
  is_member: boolean;
  num_members: number;
  properties?: any;
  previous_names: any[];
}

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await callSlackAPI<DashboardData>("dashboard");
      setData(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [callSlackAPI]);

  useEffect(() => {
    fetchDashboardData();
  }, [callSlackAPI]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

export default useDashboardData;
