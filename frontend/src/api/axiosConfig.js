import axios from "axios";
import { getToken, logout } from "../utils/auth";

/**
 * Base axios instance WITHOUT baseURL
 * Each service API will create its own instance
 */
const api = axios.create();

/**
 * Request interceptor
 * Adds JWT token if available
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handles expired / invalid token globally
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
