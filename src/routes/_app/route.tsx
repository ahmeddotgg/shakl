import { Header } from "@/components/shared/header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-10 min-h-0">
        <Outlet />
      </main>
    </>
  );
}
