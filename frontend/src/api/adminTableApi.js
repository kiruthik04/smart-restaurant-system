import api from "./axiosConfig";

const adminTableApi = api;
adminTableApi.defaults.baseURL = "http://localhost:8084";

export const getAllTables = () => {
  return adminTableApi.get("/api/admin/tables");
};

export const forceReleaseTable = (tableId) => {
  return adminTableApi.put(`/api/admin/tables/${tableId}/release`);
};

export const createTable = (data) => {
  return adminTableApi.post("/api/admin/tables", data);
};

export const disableTable = (tableId) => {
  return adminTableApi.put(`/api/admin/tables/${tableId}/disable`);
};

export const enableTable = (tableId) => {
  return adminTableApi.put(`/api/admin/tables/${tableId}/enable`);
};
