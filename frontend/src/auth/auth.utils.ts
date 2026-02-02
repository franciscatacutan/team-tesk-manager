import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string; // email
  userId: number; // id
};

/*
 * Extract User Id and Email from token
 */
export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};
