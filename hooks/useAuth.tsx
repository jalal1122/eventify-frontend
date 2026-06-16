"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthState } from "@/types/user";
import { authApi } from "@/lib/api";
import { tokenStore } from "@/lib/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refresh = async () => {
    // If no token in localStorage, skip network call entirely
    if (!tokenStore.get()) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const res = await authApi.getProfile();
      setState({
        user: res.data.user as User,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      // If profile fetch fails (e.g., token expired), clear everything
      tokenStore.clear();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    await refresh();
  };

  const googleLogin = async (credential: string) => {
    await authApi.googleLogin(credential);
    await refresh();
  };

  const logout = async () => {
    try {
      await authApi.logout(); // Just clears token locally
    } catch {
      // ignore
    }
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <AuthContext.Provider value={{ ...state, login, googleLogin, logout, refresh }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
