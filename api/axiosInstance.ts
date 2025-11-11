import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
});
export default axiosInstance;
