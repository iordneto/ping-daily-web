/**
 * Zustand global state management
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AuthSession } from "@/types";
import { apiClient } from "./api";

// Auth Store
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setSession: (session: AuthSession) => {
        apiClient.setToken(session.token);
        set({
          user: session.user,
          token: session.token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearSession: () => {
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuthStatus: async () => {
        const { token } = get();

        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return false;
        }

        try {
          const response = await apiClient.get<{
            authenticated: boolean;
            user?: User;
          }>("/api/auth/status");

          if (response.data.authenticated && response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          } else {
            get().clearSession();
            return false;
          }
        } catch (error) {
          console.error("Auth status check failed:", error);
          get().clearSession();
          return false;
        }
      },
    }),
    {
      name: "ping-daily-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI Store for global UI state
interface UIStore {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      theme: "system",

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      setTheme: (theme: "light" | "dark" | "system") => {
        set({ theme });
      },
    }),
    {
      name: "ping-daily-ui",
    }
  )
);

// Dashboard Store for dashboard-specific state
interface DashboardStore {
  selectedChannelId: string | null;
  refreshInterval: number; // in seconds
  autoRefresh: boolean;

  // Actions
  setSelectedChannelId: (channelId: string | null) => void;
  setRefreshInterval: (interval: number) => void;
  setAutoRefresh: (enabled: boolean) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      selectedChannelId: null,
      refreshInterval: 30, // 30 seconds
      autoRefresh: true,

      setSelectedChannelId: (channelId: string | null) => {
        set({ selectedChannelId: channelId });
      },

      setRefreshInterval: (interval: number) => {
        set({ refreshInterval: interval });
      },

      setAutoRefresh: (enabled: boolean) => {
        set({ autoRefresh: enabled });
      },
    }),
    {
      name: "ping-daily-dashboard",
    }
  )
);

// Initialize auth store on app start
if (typeof window !== "undefined") {
  // Auto-check auth status on app load
  const authStore = useAuthStore.getState();
  if (authStore.token) {
    authStore.checkAuthStatus();
  } else {
    authStore.setLoading(false);
  }
}
