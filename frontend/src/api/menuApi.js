import api from "./axiosConfig";

export const getAvailableMenuItems = () => {
    return api.get("/api/menu");
};
