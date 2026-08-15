"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

export type AuthRole = "owner" | "tenant" | "super_admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: AuthRole }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  signIn: async () => ({}),
  signOut: async () => {},
});

function mapUser(supaUser: User): AuthUser {
  const meta = supaUser.user_metadata || {};
  const role = (meta.role as AuthRole) || "owner";
  return {
    id: supaUser.id,
    name: meta.name || supaUser.email?.split("@")[0] || "User",
    email: supaUser.email || "",
    role: role === "super_admin" || role === "tenant" || role === "owner" ? role : "owner",
  };
}

async function ensureSuperAdminRole(accessToken: string) {
  try {
    await fetch("/api/admin/ensure-role", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    // non-blocking
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        if (session.access_token) {
          await ensureSuperAdminRole(session.access_token);
          const { data: refreshed } = await supabase.auth.getUser();
          if (refreshed.user) {
            setUser(mapUser(refreshed.user));
            setLoading(false);
            return;
          }
        }
        setUser(mapUser(session.user));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session?.user) {
          setUser(mapUser(session.user));
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    if (data.session?.user) {
      if (data.session.access_token) {
        await ensureSuperAdminRole(data.session.access_token);
        await supabase.auth.refreshSession();
        const { data: refreshed } = await supabase.auth.getUser();
        if (refreshed.user) {
          const mapped = mapUser(refreshed.user);
          setUser(mapped);
          return { role: mapped.role };
        }
      }

      const mapped = mapUser(data.session.user);
      setUser(mapped);
      return { role: mapped.role };
    }

    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
