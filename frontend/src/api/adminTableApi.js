import api from "./axiosConfig";

export const getAllTables = () =>
  api.get("/api/admin/tables");

export const forceReleaseTable = (tableId) =>
  api.put(`/api/admin/tables/${tableId}/release`);

export const createTable = (data) =>
  api.post("/api/admin/tables", data);

export const disableTable = (tableId) =>
  api.put(`/api/admin/tables/${tableId}/disable`);

export const enableTable = (tableId) =>
  api.put(`/api/admin/tables/${tableId}/enable`);
