import api from "./axiosConfig";

export const getHallAvailability = (params) => {
  return api.get("/api/events/availability/halls", {
    params,
  });
};

export const createEventBooking = (data) => {
  return api.post("/api/events", data);
};

export const getAvailableHalls = (params) => {
  return api.get("/api/events/availability/halls", {
    params,
  });
}
