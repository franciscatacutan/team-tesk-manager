import { api } from "../api/axios";
import type { User } from "./user.types";

/*
 * Fetches the list of users from the backend API.
 */
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};
