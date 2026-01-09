import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-restaurant-system-cog3.onrender.com",
});

export default api;
