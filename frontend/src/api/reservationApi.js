import api from "./axiosConfig";

const reservationApi = api.create({
  baseURL: "http://localhost:8084"
});
export const getTableAvailability = (params) => {
    return reservationApi.get("/api/reservations/availability/tables", {
        params,
    });
};

export const createSmartReservation = (data) => {
    return reservationApi.post("/api/reservations/smart", data);
};
