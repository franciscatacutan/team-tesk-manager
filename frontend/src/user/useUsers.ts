import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user.service";

/*
 * Custom hook to fetch users using React Query
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};
