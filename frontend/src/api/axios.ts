import axios from "axios";

/*
 * Create an Axios instance with a base URL
 */
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    return Promise.reject(error);
  },
);

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
