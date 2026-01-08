import api from "./axiosConfig";

export const getTableAvailability = (params) => {
    return api.get("/api/reservations/availability/tables", {
        params,
    });
};

export const createSmartReservation = (data) => {
    return api.post("/api/reservations/smart", data);
};
