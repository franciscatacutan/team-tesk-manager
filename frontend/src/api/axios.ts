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
