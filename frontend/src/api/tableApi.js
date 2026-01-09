import api from "./axios";

export const releaseTable = (tableId) => {
  return api.put(`/api/tables/release/${tableId}`);
};
