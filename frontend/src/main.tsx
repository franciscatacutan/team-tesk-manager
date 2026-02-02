import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./common/ErrorBoundary";
import "./index.css";

// Create a QueryClient instance for React Query
const client = new QueryClient();

/*
 * Main entry point of the application
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <AppRoutes />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
