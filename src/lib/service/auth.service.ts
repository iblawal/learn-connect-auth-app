import api from "@/lib/api";

// TypeScript interfaces
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  profileCompleted?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: User;
    userId?: string;
    email?: string;
    fullName?: string;
  };
}

// Auth Service
export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  // Verify Email
  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    const response = await api.post("/api/auth/verify-email", data);
    
    if (response.data.success && response.data.data?.token && response.data.data.user) {
      //  Check if we're in the browser before using localStorage
      if (typeof window !== "undefined") {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    
    return response.data;
  },

  // Resend verification code
  async resendCode(email: string): Promise<AuthResponse> {
    const response = await api.post("/api/auth/resend-code", { email });
    return response.data;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post("/api/auth/login", data);
    
    if (response.data.success && response.data.data?.token && response.data.data.user) {
      //  Check if we're in the browser before using localStorage
      if (typeof window !== "undefined") {
        const { token, user } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    
    return response.data;
  },

  // Logout user
  logout() {
    //  Check if we're in the browser
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    //  Check if we're in the browser
    if (typeof window === "undefined") {
      return null;
    }
    
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    //  Check if we're in the browser
    if (typeof window === "undefined") {
      return false;
    }
    
    return !!localStorage.getItem("token");
  },

  // Get token
  getToken(): string | null {
    //  Check if we're in the browser
    if (typeof window === "undefined") {
      return null;
    }
    
    return localStorage.getItem("token");
  },
};