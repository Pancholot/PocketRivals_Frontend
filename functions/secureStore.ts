import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

export const secureStore = {
  setItem: async (key, value) => {
    if (value === undefined || value === null) return;

    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    if (isWeb) {
      localStorage.setItem(key, stringValue);
    } else {
      await SecureStore.setItemAsync(key, stringValue);
    }
  },

  getItem: async (key) => {
    const value = isWeb
      ? localStorage.getItem(key)
      : await SecureStore.getItemAsync(key);

    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return value;
    }
  },

  deleteItem: async (key) => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
