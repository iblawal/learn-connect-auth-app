import axios from "axios";


const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' 
    ? "http://localhost:5000" 
    : "https://learn-connect-auth-app-backend.onrender.com");


const api = axios.create({
  baseURL: API_BASE_URL,  
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
