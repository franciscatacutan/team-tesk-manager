import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

/*
 * ProtectedRoute component to guard routes that require authentication
 */
export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  /*
   * If no token is found in local storage, redirect to the login page
   */
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
