import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";

export interface Context {
  auth: Session | undefined | null;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<Context>()({
  component: () => <Outlet />,
});
