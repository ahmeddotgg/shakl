import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/modules/auth/hooks/use-auth";
import { useCategories } from "@/modules/products/hooks/use-products";
import { IconCircleArrowUpRight } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useSession();
  const { data: category } = useCategories();

  return (
    <div className="space-y-30 container">
      <section className="flex md:flex-row flex-col items-center gap-12 md:gap-6 md:py-30 text-center md:text-start">
        <div className="space-y-6">
          <h1 className="bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400 font-pasifico font-semibold text-transparent text-5xl md:text-6xl text-balance min-[320px]:leading-24 min-[580px]:leading-[6.6rem]">
            Elevate Your Digital Vision
          </h1>
          <p className="font-semibold text-muted-foreground text-xs min-[460px]:text-base text-balance">
            Discover, Download, and Elevate Your <br /> Projects with
            High-Quality Digital Solutions
          </p>

          <div className="flex min-[390px]:flex-row flex-col justify-center md:justify-start gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard/new"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "px-12 rounded-full"
                  )}>
                  Start Sell
                </Link>
                <Link
                  to="/products"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "secondary" }),
                    "rounded-full"
                  )}>
                  Exlpore Products
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/register"
                  className={cn(buttonVariants({ size: "lg" }), "px-12")}>
                  Register
                </Link>
                <Link
                  to="/auth/login"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" })
                  )}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <img
          alt="Design assets"
          className="min-[320px]:max-w-[260px] min-md:max-w-[320px] lg:max-w-[400px]"
          height={600}
          src="/creative.png"
          width={600}
        />
      </section>
      <section className="space-y-16 bg-card px-4 py-10 rounded-lg container">
        <div className="space-y-5 text-center">
          <h2 className="font-light text-6xl">Featured Categories</h2>
          <p className="text-muted-foreground">
            Explore our wide range of categories
          </p>
        </div>
        <div className="gap-6 grid grid-cols-2 md:grid-cols-3 auto-rows-fr">
          {category?.map((category) => (
            <div className="bg-gradient-to-tl from-card to-primary/70 p-6 rounded-2xl">
              <div className="flex justify-between items-center gap-2">
                <h2 className="font-semibold text-2xl">{category.name}</h2>
                <Link
                  to="/products"
                  search={{ category: category.name }}
                  className="group">
                  <IconCircleArrowUpRight className="group-hover:scale-125 transition-transform" />
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
