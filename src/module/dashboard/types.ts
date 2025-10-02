import { AvailableChannel } from "@/types/slack";

// Daily standup configuration - específico do dashboard
export interface DailyStandupConfig {
  id: string;
  isActive: boolean;
  time: string;
  frequency: string[];
  timezone: string;
}

// Channel com configuração - específico da view dashboard
export interface ChannelWithConfig {
  id: string;
  name: string;
  displayName: string;
  memberCount: number;
  isPrivate: boolean;
  hasConfiguration: boolean;
  config: DailyStandupConfig;
}

// Tipo de retorno da API dashboard
export type DashboardData = {
  stats: {
    configuredChannels: number;
    responseRate: number;
    activeMembers: number;
  };
  channelsWithConfig: ChannelWithConfig[];
  availableChannels: AvailableChannel[];
};
