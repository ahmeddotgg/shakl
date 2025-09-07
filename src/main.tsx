import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routeTree } from "./routeTree.gen";
import { useSession } from "./modules/auth/hooks/use-auth";
import "./index.css";
import { Loading } from "./components/shared/loading";

const rootElement = document.getElementById("root")!;
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
  const { data: session, isPending, isLoading } = useSession();

  if (isPending || isLoading) return <Loading />;

  return (
    <RouterProvider router={router} context={{ queryClient, auth: session }} />
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
