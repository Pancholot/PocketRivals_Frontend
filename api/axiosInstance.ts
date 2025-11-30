import axios from "axios";
import { secureStore } from "functions/secureStore";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.187:5000",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await secureStore.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
