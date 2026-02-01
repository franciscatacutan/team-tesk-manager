import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import PublicRoute from "./PublicRoute";

// Dummy Dashboard component
function Dashboard() {
  return <h1 className="text-center mt-20">Dashboard</h1>;
}

/*
 * Application Routes
 */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
         * Public Route
         */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/*
         * Protected Route
         */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch ALL unknown routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
