import axios, { AxiosInstance } from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl
console.log("API_URL", API_URL);  
export const API: AxiosInstance = axios.create({
  baseURL: API_URL,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
