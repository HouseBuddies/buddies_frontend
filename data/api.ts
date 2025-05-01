import axios, { AxiosInstance } from "axios";

const API_URL = "http://localhost:4000/api";

export const API: AxiosInstance = axios.create({
  baseURL: API_URL,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
