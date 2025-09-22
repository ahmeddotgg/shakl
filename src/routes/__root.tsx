import type { User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

export interface Context {
  auth: User | undefined | null;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<Context>()({
  component: () => (
    <>
      <HeadContent />
      <NuqsAdapter>
        <Outlet />
      </NuqsAdapter>
    </>
  ),

  head: () => ({
    meta: [
      {
        name: "description",
        content: "My App is a web application",
      },
      {
        title: "Shakl",
      },
    ],
  }),
});
