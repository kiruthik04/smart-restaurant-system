import api from "./axios";

export const getKitchenOrders = () => {
  return api.get("/api/kitchen/orders");
};

export const startOrder = (orderId) => {
  return api.put(`/api/kitchen/orders/${orderId}/start`);
};

export const completeOrder = (orderId) => {
  return api.put(`/api/kitchen/orders/${orderId}/complete`);
};
