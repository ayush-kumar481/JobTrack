import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add JWT token to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Only these endpoints are public
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicRequest = publicEndpoints.includes(config.url);

    if (token && !isPublicRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
