"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/service/auth.service";

interface AuthContextType {
  user: any;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { fullName: string; email: string; password: string; phone: string }) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<any>;
  resendCode: (email: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        console.log("🔍 Checking auth:", { savedUser, hasToken: !!token });
        
        if (savedUser && token) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Handle Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log(" Attempting login...");
      const res = await authService.login({ email, password });
      
      console.log(" Login response:", res);

      if (res.success && res.data?.user) {
        setUser(res.data.user);
        console.log(" Login successful! Redirecting to dashboard...");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (err: any) {
      console.error(" Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const register = async (data: { fullName: string; email: string; password: string; phone: string }) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      if (res.success) {
        router.push(`/email-verification?email=${encodeURIComponent(data.email)}`);
      } else {
        throw new Error(res.message || "Registration failed");
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Email
  const verifyEmail = async (email: string, code: string) => {
    setLoading(true);
    try {
      const res = await authService.verifyEmail({ email, code });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        console.log(" Email verified! Redirecting to dashboard...");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        throw new Error(res.message || "Verification failed");
      }
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend Code
  const resendCode = async (email: string) => {
    try {
      const res = await authService.resendCode(email);
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  // Logout
  const logout = () => {
    console.log(" Logging out...");
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  // Compute isAuthenticated
  const isAuthenticated = !!user && !!authService.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isAuthenticated,
        login,
        register,
        verifyEmail,
        resendCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};