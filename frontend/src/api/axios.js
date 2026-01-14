import axios from "axios";

const getBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // Check if running locally
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8080";
  }
  // Fallback for production (Render)
  return "https://smart-restaurant-backend.onrender.com";
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

export default api;
