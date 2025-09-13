import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

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
