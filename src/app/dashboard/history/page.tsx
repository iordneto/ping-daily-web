"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Download, RefreshCw } from "lucide-react";
import { useHistory, useChannels } from "@/hooks/useAPI";

interface HistoryFilters {
  channelId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<HistoryFilters>({
    channelId: searchParams.get("channel") || undefined,
    status: searchParams.get("status") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: 20,
  });

  const { data: channels } = useChannels();
  const { data: historyData, isLoading, error, refetch } = useHistory(filters);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleFilterChange = (newFilters: Partial<HistoryFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedFilters.channelId)
      params.set("channel", updatedFilters.channelId);
    if (updatedFilters.status) params.set("status", updatedFilters.status);
    if (updatedFilters.startDate)
      params.set("startDate", updatedFilters.startDate);
    if (updatedFilters.endDate) params.set("endDate", updatedFilters.endDate);
    if (updatedFilters.page > 1)
      params.set("page", updatedFilters.page.toString());

    router.push(`/dashboard/history?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);

    const params = new URLSearchParams(window.location.search);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    router.push(`/dashboard/history?${params.toString()}`);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Export functionality will be implemented");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Check-in History
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View and analyze past daily check-ins across all your channels
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {historyData?.meta && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {historyData.meta.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Check-ins
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {historyData.data?.filter((h) => h.status === "completed")
                      .length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      ((historyData.data?.reduce(
                        (acc, h) => acc + h.responseRate,
                        0
                      ) || 0) /
                        Math.max(historyData.data?.length || 1, 1)) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Response Rate
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {channels?.data?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Channels
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <HistoryFilters
          channels={channels?.data || []}
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        {/* History List */}
        <HistoryList
          historyData={historyData}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          currentPage={filters.page}
        />
      </div>
    </DashboardLayout>
  );
}
