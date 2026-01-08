import api from "./axiosConfig";

export const getAnalytics = (range) => {
  return api.get(
    `/api/admin/analytics?range=${range}`
  );
};
