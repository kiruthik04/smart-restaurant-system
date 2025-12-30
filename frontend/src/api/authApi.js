import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8082"
});

export const login = (data) => {
  return authApi.post("/api/auth/login", data);
};
