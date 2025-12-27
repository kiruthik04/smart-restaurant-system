import axios from "axios";

const tableApi = axios.create({
  baseURL: "http://localhost:8084"
});

export const releaseTable = (tableId) => {
  return tableApi.put(`/api/tables/release/${tableId}`);
};
