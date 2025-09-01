import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./components/shared/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Router } from "@tanstack/react-router";
import { useSession } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

function AppRouter() {
  const { data: session } = useSession();
  const router = createRouter({
    routeTree,
    context: { auth: null },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
  });

  return <RouterProvider router={router} context={{ auth: session }} />;
}

const rootElement = document.getElementById("root")!;
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof Router<typeof routeTree>;
  }
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AppRouter />
          <Toaster richColors position="top-center" closeButton />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
