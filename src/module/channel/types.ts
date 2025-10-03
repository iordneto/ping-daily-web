/*
 * Daily standup configuration
 * Type of return of the daily standup configuration
 */
export interface DailyStandupConfig {
  id: string;
  isActive: boolean;
  time: string;
  timezone: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  frequency: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  message: string;
}

/*
 * Channel with configuration
 * Type of return of the channel with configuration
 */
export interface ChannelWithConfig {
  id: string;
  name: string;
  displayName: string;
  memberCount: number;
  isPrivate: boolean;
  hasConfiguration: boolean;
  config: DailyStandupConfig;
}
