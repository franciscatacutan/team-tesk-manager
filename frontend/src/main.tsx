import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {
      <QueryClientProvider client={client}>
        <AppRoutes />
      </QueryClientProvider>
    }
  </StrictMode>,
);
