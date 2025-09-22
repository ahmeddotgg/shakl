import { IconCircleArrowUpRight } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/modules/auth/hooks/use-auth";
import { useCategories } from "@/modules/products/hooks/use-products";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useUser();
  const { data: category } = useCategories();

  return (
    <div className="container space-y-30">
      <section className="flex flex-col items-center gap-12 text-center md:flex-row md:gap-6 md:py-30 md:text-start">
        <div className="space-y-6">
          <h1 className="text-balance bg-gradient-to-r from-indigo-500 to-rose-400 bg-clip-text font-pasifico font-semibold text-5xl text-transparent md:text-6xl min-[320px]:leading-24 min-[580px]:leading-[6.6rem]">
            Elevate Your Digital Vision
          </h1>
          <p className="text-balance font-semibold text-muted-foreground text-xs min-[460px]:text-base">
            Discover, Download, and Elevate Your <br /> Projects with
            High-Quality Digital Solutions
          </p>

          <div className="flex flex-col justify-center gap-4 md:justify-start min-[390px]:flex-row">
            {user ? (
              <>
                <Link
                  to="/dashboard/new"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "rounded-full px-12",
                  )}
                >
                  Start Sell
                </Link>
                <Link
                  to="/products"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "rounded-full",
                  )}
                >
                  Exlpore Products
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className={cn(buttonVariants({ size: "lg" }), "px-12")}
                >
                  Register
                </Link>
                <Link
                  to="/auth/login"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
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
          className="lg:max-w-[400px] min-[320px]:max-w-[260px] min-md:max-w-[320px]"
          height={600}
          src="/creative.png"
          width={600}
        />
      </section>
      <section className="container space-y-16 rounded-lg bg-secondary/50 px-4 py-10">
        <div className="space-y-5 text-center">
          <h2 className="font-light text-6xl">Featured Categories</h2>
          <p className="text-muted-foreground">
            Explore our wide range of categories
          </p>
        </div>
        <div className="grid auto-rows-fr grid-cols-2 gap-2 md:grid-cols-3">
          {category?.map((category) => (
            <div
              className="space-y-2 rounded-2xl bg-gradient-to-tl from-card to-primary/70 p-4 transition-colors hover:to-primary/60"
              key={category.id}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="textl font-semibold sm:text-2xl">
                  {category.name}
                </h2>
                <Link
                  to="/products"
                  search={{ category: category.name }}
                  className="group"
                >
                  <IconCircleArrowUpRight className="transition-transform group-hover:scale-125" />
                </Link>
              </div>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
