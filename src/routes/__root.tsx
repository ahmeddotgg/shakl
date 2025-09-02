import type { Session } from "@supabase/supabase-js";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  auth: Session | null;
  queryClient: QueryClient;
}>()({
  component: () => <Outlet />,
});
