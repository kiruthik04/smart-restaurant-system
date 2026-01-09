import api from "./axios";

export const createOrder = (data) =>
  api.post("/api/orders", data);
