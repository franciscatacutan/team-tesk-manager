import { api } from "../api/axios";
import type { User } from "./user.types";

/*
 * Fetches the list of users from the backend API.
 */
export const getUsers = async (): Promise<User[]> => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  const { data } = await api.get<User[]>("/users", {
    // Include the authorization header with the token
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
