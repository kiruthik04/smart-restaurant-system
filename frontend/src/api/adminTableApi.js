import api from "./axiosConfig";

const adminTableApi = api.create({
  baseURL: "http://localhost:8084" // Reservation Service
});

export const getAllTables = () =>
  adminTableApi.get("/api/admin/tables");

export const forceReleaseTable = (tableId) =>
  adminTableApi.put(`/api/admin/tables/${tableId}/release`);

export const createTable = (data) =>
  adminTableApi.post("/api/admin/tables", data);

export const disableTable = (tableId) =>
  adminTableApi.put(`/api/admin/tables/${tableId}/disable`);

export const enableTable = (tableId) =>
  adminTableApi.put(`/api/admin/tables/${tableId}/enable`);
