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
  login: (userData: SlackUser) => void;
  logout: () => void;
  callSlackAPI: (endpoint: string, options?: RequestInit) => Promise<any>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SlackUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Recuperar dados do usuário ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem("slack_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        localStorage.removeItem("slack_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: SlackUser) => {
    setUser(userData);
    localStorage.setItem("slack_user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("slack_user");
    // ✅ Limpar outros dados relacionados
    localStorage.removeItem("slack_oauth_state");
    localStorage.removeItem("slack_oauth_nonce");

    // 🔒 Limpar cookies httpOnly via API
    try {
      await fetch("/api/slack/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // 🚀 Função para chamar API do Slack usando o access_token do cookie
  const callSlackAPI = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`/api/slack/${endpoint}`, {
        ...options,
        credentials: "include", // ✅ Enviar cookies automaticamente
        headers: {
          "Content-Type": "application/json",
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
      value={{ user, login, logout, callSlackAPI, isLoading }}
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
