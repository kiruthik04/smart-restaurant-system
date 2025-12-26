import axios from "axios";

const orderApi = axios.create({
    baseURL: "http://localhost:8085"
});

export const createOrder = (data) => {
    return orderApi.post("/api/orders", data);
};
