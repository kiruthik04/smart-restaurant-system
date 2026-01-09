import api from "./axios";

export const getAllOrders = () => {
    return api.get("/api/admin/orders");
};

export const getOrderById = (orderId) => {
    return api.get(`/api/admin/orders/${orderId}`);
};

export const completeOrder = (orderId) => {
    return api.put(`/api/admin/orders/${orderId}/complete`);
};
