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

const register = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const response = await axiosInstance.post("/register", {
      email,
      password,
      username,
    });
    if (response.status === 201) {
      return response.data.message;
    }
    throw new Error("Registration failed");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Registration error:",
        error.response?.data.message || error.message,
        "status:",
        error.response?.status
      );
    }
    throw error;
  }
};

const logout = async () => {
  try {
    secureStore.deleteItem("accessToken");
    secureStore.deleteItem("refreshToken");
  } catch (error) {
    throw error;
  }
};

export { logIn, register, logout };
