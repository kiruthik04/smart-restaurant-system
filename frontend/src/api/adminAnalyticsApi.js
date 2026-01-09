import api from "./axios";

export const getAnalytics = (range) => {
  return api.get(
    `/api/admin/analytics?range=${range}`
  );
};
