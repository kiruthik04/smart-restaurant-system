import axios from "axios";

const menuApi = axios.create({
    baseURL: "http://localhost:8081",
});

export const getAvailableMenuItems = () => {
    return menuApi.get("/api/menu");
};
