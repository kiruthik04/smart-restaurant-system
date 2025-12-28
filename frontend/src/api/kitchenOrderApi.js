import axios from "axios";

const kitchenApi = axios.create({
  baseURL: "http://localhost:8085"
});

export const getKitchenOrders = () => {
  return kitchenApi.get("/api/kitchen/orders");
};

export const startOrder = (orderId) => {
  return kitchenApi.put(`/api/kitchen/orders/${orderId}/start`);
};

export const completeOrder = (orderId) => {
  return kitchenApi.put(`/api/kitchen/orders/${orderId}/complete`);
};
