import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = true;

  return (
    <div>
      <section className="flex md:flex-row flex-col items-center gap-12 md:gap-6 md:pt-16 text-center md:text-start container">
        <div className="space-y-6">
          <h1 className="bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400 font-pasifico font-semibold text-transparent text-5xl md:text-6xl text-balance min-[320px]:leading-24 min-[580px]:leading-[6.6rem]">
            Elevate Your Digital Vision
          </h1>
          <p className="font-semibold text-muted-foreground text-xs min-[460px]:text-base text-balance">
            Discover, Download, and Elevate Your <br /> Projects with
            High-Quality Digital Solutions
          </p>

          <div className="flex min-[390px]:flex-row flex-col justify-center md:justify-start gap-4">
            {user ? null : (
              <>
                <Link
                  to="/register"
                  className={cn(buttonVariants({ size: "lg" }), "px-12")}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" })
                  )}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <img
          alt="Design assets"
          className="min-[320px]:max-w-[260px] min-md:max-w-[320px] lg:max-w-[360px]"
          height={600}
          src="/creative.png"
          width={600}
        />
      </section>
    </div>
  );
}
