import { IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Menu, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSignOut, useUser } from "@/modules/auth/hooks/use-auth";
import { CartAndWishlist } from "@/modules/cart/cart-and-wishlist";
import { usePreferences } from "@/modules/prefrences/hooks/use-preferences";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export const ProfileMenu = () => {
  const { data: user } = useUser();
  const { mutate: signOut } = useSignOut();
  const navigate = useNavigate();
  const { data } = usePreferences(user?.id as string);

  const handleSignOut = () => {
    if (!user) return;

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

  if (!user) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User2 className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[190px]">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={data?.avatar_url as string} alt="user avatar" />
              <AvatarFallback className="rounded-lg uppercase">
                {data?.first_name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium capitalize">
                {user?.user_metadata.name}
              </span>
              <span className="truncate text-muted-foreground text-xs">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings">
              <IconUserCircle />
              Account Settings
            </Link>
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
    <header className="container grid grid-cols-2 items-center py-4 min-[640px]:grid-cols-3">
      <Link to="/">
        <img alt="Logo" className="size-8" src="/logoipsum.svg" />
      </Link>

      {!isMobile && <DesktopHeader />}

      <div className="flex gap-1 justify-self-end">
        {isMobile ? (
          <>
            <CartAndWishlist />
            <ProfileMenu />
            <MobileHeader />
          </>
        ) : (
          <>
            <CartAndWishlist />
            <ProfileMenu />
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
          <SheetTitle className="border-b pb-4">
            <img
              alt="Shakl Logo"
              className="me-auto size-8"
              src="/logoipsum.svg"
            />
            <ThemeToggle />
          </SheetTitle>
          <div className="space-y-4 py-2 font-semibold text-lg [&>a.active]:bg-secondary dark:[&>a.active]:bg-secondary/30 [&>a]:block [&>a]:rounded-lg">
            <Link
              className="p-3 duration-200 hover:bg-secondary dark:hover:bg-secondary/30"
              to="/"
            >
              Home
            </Link>
            <Link
              className="p-3 duration-200 hover:bg-secondary dark:hover:bg-secondary/30"
              to="/products"
            >
              Products
            </Link>
            {user ? (
              <Link
                className="p-3 duration-200 hover:bg-secondary dark:hover:bg-secondary/30"
                to="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="p-3 duration-200 hover:bg-secondary dark:hover:bg-secondary/30"
                  to="/auth/login"
                >
                  Login
                </Link>
                <Link
                  className="p-3 duration-200 hover:bg-secondary dark:hover:bg-secondary/30"
                  to="/auth/register"
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
    <div className="flex gap-1 justify-self-center">
      <Link to="/" className={cn(buttonVariants({ variant: "link" }))}>
        Home
      </Link>
      <Link to="/products" className={cn(buttonVariants({ variant: "link" }))}>
        Products
      </Link>
      {user ? (
        <Link
          to="/dashboard"
          className={cn(buttonVariants({ variant: "link" }))}
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/auth/login"
            className={cn(buttonVariants({ variant: "link" }))}
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className={cn(buttonVariants({ variant: "link" }))}
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
}
