import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth } }) => {
    if (auth?.user) {
      throw redirect({
        to: "/unauthorized",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="content-center min-h-svh container">
      <section className="bg-secondary/30 mx-auto p-8 border rounded-lg max-w-xl">
        <Outlet />
      </section>
    </div>
  );
}
