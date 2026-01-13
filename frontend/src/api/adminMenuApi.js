import api from "./axios";

const BASE_URL = "/api/admin/menu";

export const getMenu = () => api.get(BASE_URL);
export const addMenuItem = (data) => api.post(BASE_URL, data);
export const updateMenuItem = (id, data) => api.post(`${BASE_URL}/${id}`, data);
export const deleteMenuItem = (id) => api.delete(`${BASE_URL}/${id}`);
export const toggleAvailability = (id) =>
    api.patch(`${BASE_URL}/${id}/toggle`);
