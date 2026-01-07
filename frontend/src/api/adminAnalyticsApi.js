import axios from "axios";

const analyticsApi = axios.create({
  baseURL: "http://localhost:8085"
});

export const getAnalytics = (range) => {
  return analyticsApi.get(
    `/api/admin/analytics?range=${range}`
  );
};
