import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import type { Router } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { useSession } from "@/modules/auth/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const rootElement = document.getElementById("root")!;
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { auth: null, queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

function App() {
  const { data: session } = useSession();

  return (
    <RouterProvider router={router} context={{ auth: session, queryClient }} />
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster richColors position="top-center" closeButton />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
