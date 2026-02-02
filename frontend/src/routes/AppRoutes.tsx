import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import ErrorPage from "../pages/ErrorPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN (PUBLIC) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* PROJECTS */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        {/* PROJECT DASHBOARD */}
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* EVERYTHING ELSE */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <ErrorPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
