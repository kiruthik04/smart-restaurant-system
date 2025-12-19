import axios from "axios";

const menuApi = axios.create({
    baseURL: process.env.REACT_APP_MENU_API,
});

export const getAvailableMenuItems = () => {
    return menuApi.get("/api/menu");
};
