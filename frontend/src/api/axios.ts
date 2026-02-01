import axios from "axios";

/*
 * Create an Axios instance with a base URL
 */
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
