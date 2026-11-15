"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, type AuthUser } from "@/services/api";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, recaptchaToken?: string, website?: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    recaptchaToken?: string,
    website?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function initAuth() {
      const savedToken = typeof window !== "undefined" ? localStorage.getItem("lb_token") : null;
      if (!savedToken) {
        if (!ignore) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await api.auth.me();
        if (!ignore) {
          setUser(currentUser);
          setTokenState(savedToken);
        }
      } catch {
        setToken(null);
        if (!ignore) {
          setUser(null);
          setTokenState(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      ignore = true;
    };
  }, []);

  async function refresh() {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("lb_token") : null;
    if (!savedToken) {
      setUser(null);
      setTokenState(null);
      setIsLoading(false);
      return;
    }
    try {
      const currentUser = await api.auth.me();
      setUser(currentUser);
      setTokenState(savedToken);
    } catch {
      setToken(null);
      setUser(null);
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string, recaptchaToken?: string, website?: string) {
    const res = await api.auth.login(email, password, recaptchaToken, website);
    setUser(res.user);
    setTokenState(res.accessToken);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    recaptchaToken?: string,
    website?: string
  ) {
    await api.auth.register(name, email, password, recaptchaToken, website);
    // After successful registration, log the user in immediately
    await login(email, password, recaptchaToken, website);
  }

  async function logout() {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setTokenState(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
