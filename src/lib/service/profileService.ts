import api from "@/lib/api";

// TypeScript interfaces
export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  university?: string;
  course?: string;
  yearOfStudy?: string;
  country?: string;
  bio?: string;
  interests?: string[];
  profilePicture?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  yearOfStudy: string;
  country: string;
  bio: string;
  interests: string[];
  profilePicture: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  profileCompleted: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  user: {
    fullName: string;
    email: string;
    profileCompleted: boolean;
    university: string;
    course: string;
  };
  stats: {
    totalUsers: number;
    sameUniversity: number;
    sameCourse: number;
  };
}

export interface SearchFilters {
  university?: string;
  course?: string;
  yearOfStudy?: string;
  country?: string;
  search?: string;
}

// Profile Service Functions
export const profileService = {
  // Get current user's profile
  async getMyProfile(): Promise<{ success: boolean; data: User }> {
    const response = await api.get("/api/profile/me");
    return response.data;
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string; data: User }> {
    const response = await api.put("/api/profile/update", data);
    
    // Update user in localStorage
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    
    return response.data;
  },

  // Get all users (Student Directory)
  async getAllUsers(filters?: SearchFilters): Promise<{ success: boolean; count: number; data: User[] }> {
    const params = new URLSearchParams();
    
    if (filters?.university) params.append("university", filters.university);
    if (filters?.course) params.append("course", filters.course);
    if (filters?.yearOfStudy) params.append("yearOfStudy", filters.yearOfStudy);
    if (filters?.country) params.append("country", filters.country);
    if (filters?.search) params.append("search", filters.search);
    
    const response = await api.get(`/api/profile/users?${params.toString()}`);
    return response.data;
  },

  // Get specific user by ID
  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    const response = await api.get(`/api/profile/user/${userId}`);
    return response.data;
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const response = await api.get("/api/profile/dashboard");
    return response.data;
  },
};