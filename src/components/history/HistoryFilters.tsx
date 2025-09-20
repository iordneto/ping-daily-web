"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Filter, X } from "lucide-react";
import { ChannelConfig } from "@/types";

interface HistoryFiltersProps {
  channels: ChannelConfig[];
  filters: {
    channelId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
  };
  onFiltersChange: (filters: any) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In Progress" },
  { value: "cancelled", label: "Cancelled" },
  { value: "failed", label: "Failed" },
];

export function HistoryFilters({
  channels,
  filters,
  onFiltersChange,
}: HistoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      channelId: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      page: 1,
      limit: filters.limit,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.channelId || filters.status || filters.startDate || filters.endDate;

  const activeFiltersCount = [
    filters.channelId,
    filters.status,
    filters.startDate,
    filters.endDate,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && !isExpanded && (
            <div className="flex flex-wrap gap-2">
              {filters.channelId && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                  Channel: #
                  {channels.find((c) => c.channelId === filters.channelId)
                    ?.channelName || filters.channelId}
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                  Status:{" "}
                  {
                    STATUS_OPTIONS.find((s) => s.value === filters.status)
                      ?.label
                  }
                </span>
              )}
              {filters.startDate && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                  From: {new Date(filters.startDate).toLocaleDateString()}
                </span>
              )}
              {filters.endDate && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                  To: {new Date(filters.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {/* Channel Filter */}
              <div className="space-y-2">
                <Label htmlFor="channel-filter">Channel</Label>
                <Select
                  value={localFilters.channelId || ""}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      channelId: value || undefined,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All channels</SelectItem>
                    {channels.map((channel) => (
                      <SelectItem
                        key={channel.channelId}
                        value={channel.channelId}
                      >
                        #{channel.channelName || channel.channelId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={localFilters.status || ""}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      status: value || undefined,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.startDate || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              {/* End Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.endDate || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => setIsExpanded(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApplyFilters}>Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
