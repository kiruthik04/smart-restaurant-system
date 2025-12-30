import api from "./axiosConfig";

const orderApi = api;
orderApi.defaults.baseURL = "http://localhost:8085";

export const createOrder = (data) => {
  return orderApi.post("/api/orders", data);
};
