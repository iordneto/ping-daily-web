"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Lock, Hash } from "lucide-react";
import { useAvailableChannels, useCreateChannelMutation } from "@/hooks/useAPI";
import { CreateChannelConfigRequest, DayOfWeek } from "@/types";
import { toast } from "sonner";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export function CreateChannelDialog({
  open,
  onOpenChange,
}: CreateChannelDialogProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const { data: availableChannels, isLoading: channelsLoading } =
    useAvailableChannels();
  const createChannelMutation = useCreateChannelMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateChannelConfigRequest>({
    defaultValues: {
      channelId: "",
      checkTime: "09:00",
      processingDelayMinutes: 30,
      activeDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
      setSelectedChannelId("");
      setActiveDays(["monday", "tuesday", "wednesday", "thursday", "friday"]);
    }
  }, [open, reset]);

  // Update form when selected channel or active days change
  useEffect(() => {
    setValue("channelId", selectedChannelId);
    setValue("activeDays", activeDays);
  }, [selectedChannelId, activeDays, setValue]);

  const handleDayToggle = (day: DayOfWeek) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const onSubmit = async (data: CreateChannelConfigRequest) => {
    try {
      await createChannelMutation.mutateAsync({
        ...data,
        activeDays: activeDays,
      });
      toast.success("Channel configuration created successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create channel configuration");
    }
  };

  const selectedChannel = availableChannels?.data?.find(
    (channel) => channel.id === selectedChannelId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Channel Configuration</DialogTitle>
          <DialogDescription>
            Set up daily check-ins for a channel in your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Channel Selection */}
          <div className="space-y-2">
            <Label htmlFor="channel">Select Channel</Label>
            {channelsLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ) : (
              <Select
                value={selectedChannelId}
                onValueChange={setSelectedChannelId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a channel..." />
                </SelectTrigger>
                <SelectContent>
                  {availableChannels?.data?.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center space-x-2">
                        {channel.isPrivate ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Hash className="h-4 w-4" />
                        )}
                        <span>#{channel.name}</span>
                        {channel.isConfigured && (
                          <span className="text-xs text-muted-foreground">
                            (already configured)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedChannel?.isConfigured && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                This channel is already configured. Creating a new configuration
                will override the existing one.
              </p>
            )}
          </div>

          {/* Selected Channel Preview */}
          {selectedChannel && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">#{selectedChannel.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedChannel.memberCount} members •{" "}
                      {selectedChannel.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Check Time */}
          <div className="space-y-2">
            <Label htmlFor="checkTime">Check-in Time</Label>
            <Input
              id="checkTime"
              type="time"
              {...register("checkTime", {
                required: "Check-in time is required",
              })}
            />
            {errors.checkTime && (
              <p className="text-sm text-red-500">{errors.checkTime.message}</p>
            )}
          </div>

          {/* Processing Delay */}
          <div className="space-y-2">
            <Label htmlFor="processingDelayMinutes">
              Processing Delay (minutes)
            </Label>
            <Input
              id="processingDelayMinutes"
              type="number"
              min="1"
              max="1440"
              {...register("processingDelayMinutes", {
                required: "Processing delay is required",
                min: { value: 1, message: "Minimum delay is 1 minute" },
                max: {
                  value: 1440,
                  message: "Maximum delay is 24 hours (1440 minutes)",
                },
                valueAsNumber: true,
              })}
            />
            <p className="text-sm text-muted-foreground">
              Time to wait for responses before generating the summary
            </p>
            {errors.processingDelayMinutes && (
              <p className="text-sm text-red-500">
                {errors.processingDelayMinutes.message}
              </p>
            )}
          </div>

          {/* Active Days */}
          <div className="space-y-3">
            <Label>Active Days</Label>
            <div className="grid grid-cols-2 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.value}
                    checked={activeDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label htmlFor={day.value} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
            {activeDays.length === 0 && (
              <p className="text-sm text-red-500">
                Select at least one active day
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Check-ins will only be sent on selected days
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createChannelMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedChannelId ||
                activeDays.length === 0 ||
                createChannelMutation.isPending ||
                !isValid
              }
            >
              {createChannelMutation.isPending
                ? "Creating..."
                : "Create Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
