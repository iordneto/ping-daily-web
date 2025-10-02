"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { SlackLoginForm } from "@/components/slack/SlackLoginForm";
import { SlackDashboard } from "@/components/slack/SlackDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * Home page component that renders either login form or user dashboard
 * Based on authentication state from the AuthContext
 * @returns {JSX.Element} The home page component
 */
export default function Home() {
  const { user, isLoading } = useAuth();

  // Wait for auth state to load before redirecting
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <LoadingSpinner message="Verificando autenticação..." />
      </main>
    );
  }

  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <CardTitle className="text-center text-primary font-bold tracking-wider">
                PING DAILY TACTICAL
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              v1.0.0 OPERATIONAL
            </p>
          </CardHeader>
          <CardContent>
            <h1 className="text-lg font-bold text-center mb-6 text-accent-foreground">
              SECURE SLACK INTEGRATION
            </h1>
            <SlackLoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
