"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SlackLoginForm } from "@/components/slack/SlackLoginForm";
import { SlackDashboard } from "@/components/slack/SlackDashboard";

/**
 * Home page component that renders either login form or user dashboard
 * Based on authentication state from the AuthContext
 * @returns {JSX.Element} The home page component
 */
export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Sign in with Slack
        </h1>

        {user ? <SlackDashboard /> : <SlackLoginForm />}
      </div>
    </main>
  );
}
