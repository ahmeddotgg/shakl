import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, User2 } from "lucide-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { useSession, useSignOut, useUser } from "@/modules/auth/hooks/use-auth";
import { CartAndWishlist } from "@/modules/cart/cart-and-wishlist";
import {
  IconCreditCard,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

const ProfleMenu = () => {
  const { data: session } = useSession();
  const { mutate: signOut } = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (!session) return;

    signOut(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate({ to: "/" });
      },
      onError: (err) => {
        console.error("Sign out failed:", err.message);
      },
    });
  };

  if (!session) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User2 className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[180px]">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
            <Avatar className="rounded-lg w-8 h-8">
              <AvatarImage src="wffwfg" alt="gregreg" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 grid text-sm text-left leading-tight">
              <span className="font-medium truncate capitalize">
                {session?.user?.user_metadata.name}
              </span>
              <span className="text-muted-foreground text-xs truncate">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUserCircle />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconNotification />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
            <ProfleMenu />
            <MobileHeader />
          </>
        ) : (
          <>
            <CartAndWishlist />
            <ProfleMenu />
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
              to="/">
              Home
            </Link>
            <Link
              className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
              to="/products">
              Products
            </Link>
            {user ? null : (
              <>
                <Link
                  className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
                  to="/auth/login">
                  Login
                </Link>
                <Link
                  className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
                  to="/auth/register">
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
        {user ? null : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}>
                <Link to="/auth/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}>
                <Link to="/auth/register">Register</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
