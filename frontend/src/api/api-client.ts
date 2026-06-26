import axios from "axios";

const publicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { publicInstance, instance };
