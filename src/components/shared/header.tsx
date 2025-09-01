import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { Menu } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSignOut, useUser } from "@/hooks/use-auth";
import { toast } from "sonner";
import { CartAndWishlist } from "@/modules/cart/cart-and-wishlist";
import { cn } from "@/lib/utils";

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="items-center grid grid-cols-2 min-[640px]:grid-cols-3 py-4 container">
      <img alt="Logo" className="size-8" src="/logoipsum.svg" />
      {!isMobile && <DesktopHeader />}

      <div className="flex justify-self-end gap-1">
        {isMobile ? (
          <>
            <CartAndWishlist />
            <MobileHeader />
          </>
        ) : (
          <>
            <CartAndWishlist />
            <ThemeToggle />
          </>
        )}
      </div>
    </header>
  );
};

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: signOut } = useSignOut();
  const { navigate } = useRouter();

  const { data: user } = useUser();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate({ href: "/" });
      },
      onError: (err) => {
        console.error("Sign in failed:", err.message);
      },
    });
  };

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild className="justify-self-end">
        <Button aria-label="Toggle Sidebar" size="icon" variant="outline">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle className="pb-4 border-b">
            <img
              alt="Shakl Logo"
              className="me-auto size-8"
              src="/logoipsum.svg"
            />
            <ThemeToggle />
          </SheetTitle>
          <div className="[&>a]:block space-y-4 [&>a.active]:bg-secondary dark:[&>a.active]:bg-secondary/30 py-2 [&>a]:rounded-lg font-semibold text-lg">
            <Link
              className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
              to="/"
            >
              Home
            </Link>
            <Link
              className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
              to="/products"
            >
              Products
            </Link>
            {user ? (
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" })
                    )}
                  >
                    Account
                  </AccordionTrigger>
                  <AccordionContent>
                    <Button onClick={handleSignOut}>Logout</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <>
                <Link
                  className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <SheetDescription className="sr-only" />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export function DesktopHeader() {
  const { mutate: signOut } = useSignOut();
  const { data: user } = useUser();
  const { navigate } = useRouter();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate({ href: "/" });
      },
      onError: (err) => {
        console.error("Sign in failed:", err.message);
      },
    });
  };

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/products">Products</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {user ? (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Account</NavigationMenuTrigger>
            <NavigationMenuContent className="space-y-2 p-4">
              {user && (
                <h4 className="font-semibold capitalize">
                  Welcome {user.user_metadata?.name || "Guest"} 👋
                </h4>
              )}
              <ul className="gap-4 grid w-[200px]">
                <Button variant="outline" onClick={handleSignOut}>
                  Logout
                </Button>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/register">Register</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
