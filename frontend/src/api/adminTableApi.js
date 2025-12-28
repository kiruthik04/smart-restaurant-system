import axios from "axios";

const adminTableApi = axios.create({
  baseURL: "http://localhost:8084"
});

export const getAllTables = () => {
  return adminTableApi.get("/api/admin/tables");
};

export const forceReleaseTable = (tableId) => {
  return adminTableApi.put(`/api/admin/tables/${tableId}/release`);
};

export const createTable = (data) => {
  return adminTableApi.post("/api/admin/tables", data);
};

