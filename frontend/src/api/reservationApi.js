import api from "./axios";

export const getTableAvailability = (params) => {
    return api.get("/api/reservations/availability/tables", {
        params,
    });
};
export const createSmartReservation = (data) => {
    return api.post("/api/reservations/smart", data);
};
