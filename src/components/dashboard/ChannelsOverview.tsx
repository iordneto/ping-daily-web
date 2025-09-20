"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Plus,
  MoreVertical,
  Clock,
  Users,
  Settings,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import { useChannels, useDeleteChannelMutation } from "@/hooks/useAPI";
import { ChannelConfig } from "@/types";
import { CreateChannelDialog } from "./CreateChannelDialog";
import { toast } from "sonner";

export function ChannelsOverview() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: channels, isLoading } = useChannels();
  const deleteChannelMutation = useDeleteChannelMutation();

  const handleDeleteChannel = async (channelId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this channel configuration? This will stop all future check-ins for this channel."
      )
    ) {
      return;
    }

    try {
      await deleteChannelMutation.mutateAsync({ channelId });
      toast.success("Channel configuration deleted successfully");
    } catch (error) {
      toast.error("Failed to delete channel configuration");
    }
  };

  const handleToggleChannel = async (channel: ChannelConfig) => {
    // TODO: Implement toggle functionality via update mutation
    toast.info("Toggle functionality will be implemented with update API");
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDays = (days: string[]) => {
    const dayAbbr = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    };

    return days.map((day) => dayAbbr[day as keyof typeof dayAbbr]).join(", ");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Channels</span>
            <div className="animate-pulse bg-muted rounded h-8 w-20"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const channelsList = channels?.data || [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Channels ({channelsList.length})
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Channel
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {channelsList.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No channels configured
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first channel for daily check-ins.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Channel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {channelsList.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          #{channel.channelName || channel.channelId}
                        </h3>
                        <Badge
                          variant={channel.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {channel.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(channel.checkTime)}
                        </div>
                        <div>{formatDays(channel.activeDays)}</div>
                        <div>{channel.processingDelayMinutes}min delay</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/channels/${channel.channelId}`)
                      }
                    >
                      View Details
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/channels/${channel.channelId}/edit`
                            )
                          }
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleChannel(channel)}
                        >
                          {channel.isActive ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Check-ins
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Resume Check-ins
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/history?channel=${channel.channelId}`
                            )
                          }
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteChannel(channel.channelId)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Channel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateChannelDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
