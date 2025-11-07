import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import { secureStore } from "functions/secureStore";

const logIn = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("/login", credentials);
    const { access_token, refresh_token } = response.data;
    console.log("Response data:", response.data);
    secureStore.setItem("accessToken", access_token);
    secureStore.setItem("refreshToken", refresh_token);
    return "Bienvenido";
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Login error:",
        error.response?.data.message || error.message,
        "status:",
        error.response?.status
      );
    }
    throw error;
  }
};

export { logIn };
