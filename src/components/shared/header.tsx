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
import { LogOut, Menu, Settings, User } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { useSignOut, useUser } from "@/modules/auth/hooks/use-auth";
import { toast } from "sonner";
import { CartAndWishlist } from "@/modules/cart/cart-and-wishlist";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
  const { data: user } = useUser();
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(!open);
    }
    const unsub = router.subscribe("onResolved", () => {
      setIsOpen(false);
    });
    return unsub;
  }, [isMobile, router]);

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
                      buttonVariants({
                        variant: "ghost",
                        size: "lg",
                      })
                    )}
                  >
                    Account
                  </AccordionTrigger>
                  <AccordionContent className="p-4 w-full">
                    <AcccountLinks />
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
  const { data: user } = useUser();

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
            <NavigationMenuContent className="space-y-4 p-4">
              {user && (
                <h4 className="px-4 font-semibold capitalize">
                  Welcome {user.user_metadata?.name || "Guest"} 👋
                </h4>
              )}
              <Separator />
              <AcccountLinks />
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

const AcccountLinks = () => {
  const { mutate: signOut } = useSignOut();
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
    <div className="space-y-3 w-full [&>*>svg]:size-5! [&>*]:font-semibold! [&>*]:text-muted-foreground">
      <Link
        className={buttonVariants({
          className: "w-full justify-start cursor-pointer text-base!",
          variant: "ghost",
          size: "lg",
        })}
        to="/"
      >
        <User />
        Profile
      </Link>

      <Link
        className={buttonVariants({
          className: "w-full justify-start cursor-pointer text-base!",
          variant: "ghost",
          size: "lg",
        })}
        to="/"
      >
        <Settings />
        Account Settings
      </Link>

      <button
        className={buttonVariants({
          className: "w-full justify-start cursor-pointer text-base!",
          variant: "ghost",
          size: "lg",
        })}
        onClick={handleSignOut}
      >
        <LogOut />
        Logout
      </button>
    </div>
  );
};
