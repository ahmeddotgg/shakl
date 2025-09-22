import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (auth) {
      throw redirect({
        to: "/unauthorized",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="container min-h-svh content-center">
      <section className="mx-auto max-w-xl rounded-lg border bg-secondary/30 p-8">
        <Outlet />
      </section>
    </div>
  );
}
