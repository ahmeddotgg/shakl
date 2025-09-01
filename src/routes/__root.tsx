import type { Session } from "@supabase/supabase-js";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ auth: Session | null }>()({
  component: () => <Outlet />,
});
