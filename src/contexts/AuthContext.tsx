"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SlackUser } from "@/types/slack";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Type definition for the authentication context
 */
interface AuthContextType {
  /** Currently authenticated user */
  user: SlackUser | null;
  /** Current access token for API calls */
  accessToken: string | null;
  /** Current ID token for API calls */
  idToken: string | null;
  /** Function to log in a user with their data and token */
  login: (params: {
    userData: SlackUser;
    accessToken: string;
    idToken: string;
  }) => void;
  /** Function to log out the current user */
  logout: () => void;
  /** Function to make authenticated calls to Slack API */
  callSlackAPI: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  /** Loading state for authentication operations */
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication context provider component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap with auth context
 * @returns {JSX.Element} The auth provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SlackUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Effect to restore user session from localStorage on component mount
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("slack_user");
    const savedToken = localStorage.getItem("slack_access_token");
    const savedIdToken = localStorage.getItem("slack_id_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
        setIdToken(savedIdToken);
      } catch (error) {
        console.error("Error restoring user data:", error);
        localStorage.removeItem("slack_user");
        localStorage.removeItem("slack_access_token");
        localStorage.removeItem("slack_id_token");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Logs in a user by storing their data and access token
   * @param {SlackUser} userData - The user data from Slack
   * @param {string} token - The access token for API calls
   */
  const login = (params: {
    userData: SlackUser;
    accessToken: string;
    idToken: string;
  }) => {
    const { userData, accessToken, idToken } = params;

    setUser(userData);
    setAccessToken(accessToken);
    setIdToken(idToken);
    localStorage.setItem("slack_user", JSON.stringify(userData));
    localStorage.setItem("slack_access_token", accessToken);
    localStorage.setItem("slack_id_token", idToken);
  };

  /**
   * Logs out the current user by clearing all stored data
   * @async
   * @returns {Promise<void>}
   */
  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("slack_user");
    localStorage.removeItem("slack_access_token");
    // Clear other related OAuth data
    localStorage.removeItem("slack_oauth_state");
    localStorage.removeItem("slack_oauth_nonce");
  };

  /**
   * Makes authenticated API calls to Slack endpoints
   * @async
   * @param {string} endpoint - The API endpoint to call (relative to /api/slack/)
   * @param {RequestInit} options - Optional fetch options
   * @returns {Promise<any>} The API response data
   * @throws {Error} When no access token is available or API call fails
   */
  async function callSlackAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!accessToken || !idToken) {
      throw new Error("Access token not found");
    }

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-ID-Token": idToken,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, logout user
        await logout();
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        idToken,
        login,
        logout,
        callSlackAPI,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the authentication context
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} When used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
