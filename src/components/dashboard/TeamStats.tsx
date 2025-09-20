"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, CheckCircle, TrendingUp } from "lucide-react";
import {
  useTeamAnalytics,
  useChannels,
  useCheckinStatus,
} from "@/hooks/useAPI";

export function TeamStats() {
  const { data: channels, isLoading: channelsLoading } = useChannels();
  const { data: analytics, isLoading: analyticsLoading } = useTeamAnalytics();
  const { data: checkinStatus, isLoading: statusLoading } = useCheckinStatus();

  // Calculate stats from checkinStatus array
  const todayStats = checkinStatus?.data
    ? checkinStatus.data.reduce(
        (acc, status) => {
          acc.totalResponses += status.respondedUsers;
          acc.totalUsers += status.totalUsers;
          if (status.status !== "none") {
            acc.activeChannels += 1;
          }
          return acc;
        },
        { totalResponses: 0, totalUsers: 0, activeChannels: 0 }
      )
    : { totalResponses: 0, totalUsers: 0, activeChannels: 0 };

  const todayResponseRate =
    todayStats.totalUsers > 0
      ? Math.round((todayStats.totalResponses / todayStats.totalUsers) * 100)
      : 0;

  const stats = [
    {
      title: "Active Channels",
      value: channels?.data?.filter((channel) => channel.isActive)?.length || 0,
      icon: MessageSquare,
      change: undefined,
      loading: channelsLoading,
    },
    {
      title: "Today's Response Rate",
      value: `${todayResponseRate}%`,
      icon: Users,
      change: undefined,
      loading: statusLoading,
    },
    {
      title: "Today's Responses",
      value: todayStats.totalResponses || 0,
      icon: CheckCircle,
      change: undefined,
      loading: statusLoading,
    },
    {
      title: "Overall Avg Rate",
      value: analytics?.data?.avgResponseRate
        ? `${Math.round(analytics.data.avgResponseRate * 100)}%`
        : "N/A",
      icon: TrendingUp,
      change: undefined,
      loading: analyticsLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.loading ? (
                <div className="animate-pulse bg-muted rounded h-8 w-16"></div>
              ) : (
                stat.value
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
