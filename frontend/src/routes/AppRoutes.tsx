import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "../pages/Auth";
import ProtectedRoute from "./ProtectedRoute";

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
        <Route path="/login" element={<Auth />} />
        <Route
          path="/"
          element={
            /*
             * Protected Route
             */
            <ProtectedRoute>
              <div>Protected Home Page</div>
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </BrowserRouter>
  );
}
