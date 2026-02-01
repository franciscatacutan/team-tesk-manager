import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

type Props = {
  children: JSX.Element;
};

/*
 * PublicRoute component to restrict access to routes for authenticated users
 */
export default function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  //   If a token is found in local storage, redirect to the dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
