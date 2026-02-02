import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import PublicRoute from "./PublicRoute";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";

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
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        {/* Catch ALL unknown routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}
