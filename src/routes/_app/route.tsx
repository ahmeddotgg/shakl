import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/shared/header";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <main className="min-h-0 flex-1 py-16">
        <Outlet />
      </main>
    </>
  );
}
