import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export type UnauthenticatedSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_app/unauthenticated")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): UnauthenticatedSearch => {
    return {
      redirect: (search.redirect as string) || "",
    };
  },
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <div className="container content-center space-y-3 text-center">
      <h1 className="font-bold text-2xl">You are not logged in</h1>
      <p className="text-muted-foreground">Please log in to continue.</p>
      <Link
        to={"/auth/login"}
        reloadDocument={true}
        search={{ redirect: redirect }}
        className={buttonVariants()}
      >
        Go to Login
      </Link>
    </div>
  );
}
