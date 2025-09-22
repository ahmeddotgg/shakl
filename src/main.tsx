import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { Loading } from "./components/shared/loading";
import { useUser } from "./modules/auth/hooks/use-auth";

const rootElement = document.getElementById("root");
const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
    auth: undefined!,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { data: user, isPending, isLoading } = useUser();

  if (isPending || isLoading) return <Loading />;

  return (
    <RouterProvider router={router} context={{ queryClient, auth: user }} />
  );
}

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!);
  root.render(
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" closeButton />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
