import axios from "axios";

const getBaseUrl = () => {
  // Check if running locally
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  }
  // Fallback for production (Render)
  return "https://smart-restaurant-system-cog3.onrender.com";
};

const baseURL = getBaseUrl();
console.log("Using API Base URL:", baseURL);

const api = axios.create({
  baseURL: baseURL,
});

export default api;
