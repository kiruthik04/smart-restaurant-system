import api from "./axiosConfig";

export const createOrder = (data) =>
  api.post("/api/orders", data);
