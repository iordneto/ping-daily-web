"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { SlackUser } from "@/types";

interface AuthContextType {
  user: SlackUser | null;
  accessToken: string | null;
  login: (userData: SlackUser, accessToken: string) => void;
  logout: () => void;
  callSlackAPI: (endpoint: string, options?: RequestInit) => Promise<any>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SlackUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Recuperar dados do usuário ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem("slack_user");
    const savedToken = localStorage.getItem("slack_access_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedToken);
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        localStorage.removeItem("slack_user");
        localStorage.removeItem("slack_access_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: SlackUser, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("slack_user", JSON.stringify(userData));
    localStorage.setItem("slack_access_token", token);
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("slack_user");
    localStorage.removeItem("slack_access_token");
    // ✅ Limpar outros dados relacionados
    localStorage.removeItem("slack_oauth_state");
    localStorage.removeItem("slack_oauth_nonce");
  };

  // 🚀 Função para chamar API do Slack usando o access_token
  const callSlackAPI = async (endpoint: string, options: RequestInit = {}) => {
    if (!accessToken) {
      throw new Error("Token de acesso não encontrado");
    }

    try {
      const response = await fetch(`/api/slack/${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expirado, fazer logout
        await logout();
        throw new Error("Sessão expirada");
      }

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, callSlackAPI, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
