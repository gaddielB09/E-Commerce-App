"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import supabase from "@/lib/supabase";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, nombre?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

/**
 * Hook para gestionar autenticación con Supabase Auth
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
            created_at: data.session.user.created_at || "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al verificar sesión",
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          created_at: session.user.created_at || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, nombre?: string) => {
    try {
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre || "",
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          created_at: data.user.created_at || "",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en registro";
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          created_at: data.user.created_at || "",
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error en inicio de sesión";
      setError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(message);
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
};
