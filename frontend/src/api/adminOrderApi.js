import axios from "axios";

const adminOrderApi = axios.create({
    baseURL: "http://localhost:8085"
});

export const getAllOrders = () => {
    return adminOrderApi.get("/api/admin/orders");
};

export const getOrderById = (orderId) => {
    return adminOrderApi.get(`/api/admin/orders/${orderId}`);
};

export const completeOrder = (orderId) => {
    return adminOrderApi.put(`/api/admin/orders/${orderId}/complete`);
};
