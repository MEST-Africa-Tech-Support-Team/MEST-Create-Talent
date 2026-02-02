import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL 
});

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});