import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.73:5000",
});
export default axiosInstance;
