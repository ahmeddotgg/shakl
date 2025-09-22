import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/_app/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container space-y-3 text-center">
      <h1 className="font-bold text-2xl">You are already logged in</h1>
      <p className="text-muted-foreground">You can go back to the homepage.</p>
      <Link to="/" className={buttonVariants()}>
        Go Home
      </Link>
    </div>
  );
}
