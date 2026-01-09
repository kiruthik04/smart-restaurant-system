import api from "./axios";

export const getAvailableMenuItems = () => {
    return api.get("/api/menu");
};
