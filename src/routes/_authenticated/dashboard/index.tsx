import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/dashboard/"!
      <Link to="/auth/login" search={{ redirect: "/dashboard" }}>
        go to login (should be redirected back)
      </Link>
    </div>
  );
}
