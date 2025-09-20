/**
 * Shared TypeScript types for the Ping Daily dashboard
 */

export interface User {
  id: string;
  name: string;
  teamId: string;
  isAdmin: boolean;
}

export interface AuthSession {
  token: string;
  user: User;
  isAdmin: boolean;
  expiresAt: number;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ChannelConfig {
  id: number;
  teamId: string;
  channelId: string;
  channelName: string;
  checkTime: string;
  processingDelayMinutes: number;
  activeDays: DayOfWeek[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelConfigRequest {
  channelId: string;
  checkTime: string;
  processingDelayMinutes?: number;
  activeDays?: DayOfWeek[] | string;
}

export interface UpdateChannelConfigRequest {
  checkTime?: string;
  processingDelayMinutes?: number;
  activeDays?: DayOfWeek[] | string;
  isActive?: boolean;
}

export interface AvailableChannel {
  id: string;
  name: string;
  isConfigured: boolean;
  isPrivate: boolean;
  memberCount: number;
}

export interface CheckinStatus {
  channelId: string;
  channelName: string;
  hasActiveCheckin: boolean;
  dailyCheckinId?: number;
  dailyCheckinUuid?: string;
  scheduledAt?: string;
  dispatchedAt?: string;
  status: "scheduled" | "dispatched" | "completed" | "failed" | "none";
  totalUsers: number;
  respondedUsers: number;
  pendingUsers: number;
  responseRate: number;
  users: Array<{
    id: string;
    name: string;
    hasAnswered: boolean;
    answeredAt?: string;
  }>;
  processingDelayMinutes: number;
  summaryAvailableAt?: string;
}

export interface CheckinSummary {
  channelId: string;
  channelName: string;
  dailyCheckinUuid: string;
  scheduledAt: string;
  dispatchedAt?: string;
  summaryPostedAt?: string;
  totalUsers: number;
  totalResponses: number;
  responseRate: number;
  answers: Array<{
    userId: string;
    userName: string;
    answer: string;
    answeredAt: string;
  }>;
}

export interface HistoricalCheckin {
  id: number;
  uuid: string;
  channelId: string;
  channelName: string;
  scheduledAt: string;
  dispatchedAt?: string;
  summaryPostedAt?: string;
  status: string;
  totalResponses: number;
  responseRate: number;
  createdAt: string;
}

export interface DetailedHistoricalCheckin extends HistoricalCheckin {
  answers: Array<{
    userId: string;
    userName: string;
    answer: string;
    answeredAt: string;
  }>;
  channelMembers: number;
}

export interface TeamAnalytics {
  totalCheckins: number;
  completedCheckins: number;
  totalResponses: number;
  avgResponseRate: number;
  mostActiveChannel: {
    channelId: string;
    channelName: string;
    checkinsCount: number;
  } | null;
  responseRateByDay: Array<{
    date: string;
    responseRate: number;
    totalCheckins: number;
  }>;
  channelBreakdown: Array<{
    channelId: string;
    channelName: string;
    totalCheckins: number;
    completedCheckins: number;
    avgResponseRate: number;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
