import axios from "axios";

const tableApi = axios.create({
  baseURL: "http://localhost:8080"
});

export const releaseTable = (tableId) => {
  return tableApi.put(`/api/tables/release/${tableId}`);
};
