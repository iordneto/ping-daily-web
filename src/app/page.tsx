"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Clock, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signIn("slack", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Ping Daily</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogin}
                disabled={isSigningIn}
                className="bg-primary hover:bg-primary/90"
              >
                {isSigningIn ? "Connecting..." : "Login with Slack"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Automate Your Team's
            <span className="text-primary block">Daily Check-ins</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your team's daily communication with automated,
            intelligent check-ins. Built for modern remote and hybrid teams who
            value structured communication without the overhead.
          </p>
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={isSigningIn}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
          >
            {isSigningIn ? "Connecting..." : "Get Started with Slack"}
          </Button>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>30-Second Setup</CardTitle>
              <CardDescription>
                Get started in under 30 seconds. From install to first check-in,
                it's that fast.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Any time, any days. Customize check-ins to match your team's
                workflow perfectly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Private Responses</CardTitle>
              <CardDescription>
                Team members respond via private DM, then get compiled into
                channel summaries.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Smart Summaries</CardTitle>
              <CardDescription>
                Automatic insights generation with response rates, progress
                tracking, and analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Web Dashboard</CardTitle>
              <CardDescription>
                Manage configurations, view history, and get insights through
                this beautiful dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>
                Secure configuration management with proper permissions and team
                controls.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Team Communication?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of teams using Ping Daily for better daily
            communication.
          </p>
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={isSigningIn}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
          >
            {isSigningIn ? "Connecting..." : "Start Free with Slack"}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-semibold">Ping Daily</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Making team communication more efficient, one check-in at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
