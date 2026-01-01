import api from "./axiosConfig";

const orderApi = api.create({
  baseURL: "http://localhost:8085"
});

export const createOrder = (data) =>
  orderApi.post("/api/orders", data);
