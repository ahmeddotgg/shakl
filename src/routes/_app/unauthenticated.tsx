import { buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/unauthenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="content-center space-y-3 text-center container">
        <h1 className="font-bold text-2xl">You are not logged in</h1>
        <p className="text-muted-foreground">Please log in to continue.</p>
        <Link to={"/auth/login"} className={buttonVariants()}>
          Go to Login
        </Link>
      </div>
    </>
  );
}
