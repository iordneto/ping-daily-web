"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChannelsOverview } from "@/components/dashboard/ChannelsOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TeamStats } from "@/components/dashboard/TeamStats";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("session", session);
  console.log("status", status);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
        {/* Welcome Section */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your team's daily check-ins and view insights from your
            dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        <TeamStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channels Overview - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ChannelsOverview />
          </div>

          {/* Recent Activity - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
