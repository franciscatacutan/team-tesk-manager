import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./common/ErrorBoundary";
import "./index.css";
import { AuthProvider } from "./features/auth/context/AuthProvider";

// Create a QueryClient instance for React Query
const client = new QueryClient();

/*
 * Main entry point of the application
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ErrorBoundary>,
);
