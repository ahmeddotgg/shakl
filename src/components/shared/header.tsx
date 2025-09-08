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
import { Menu, User2 } from "lucide-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useSession, useSignOut, useUser } from "@/modules/auth/hooks/use-auth";
import { CartAndWishlist } from "@/modules/cart/cart-and-wishlist";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";
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
import { cn } from "@/lib/utils";

export const ProfileMenu = () => {
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
      <DropdownMenuContent className="max-w-[190px]">
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
          <DropdownMenuItem asChild>
            <Link to="/dashboard/new">
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
    <header className="items-center grid grid-cols-2 min-[640px]:grid-cols-3 py-4 container">
      <Link to="/">
        <img alt="Logo" className="size-8" src="/logoipsum.svg" />
      </Link>

      {!isMobile && <DesktopHeader />}

      <div className="flex justify-self-end gap-1">
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
            {user ? (
              <Link
                className="hover:bg-secondary dark:hover:bg-secondary/30 p-3 duration-200"
                to="/dashboard">
                Dashboard
              </Link>
            ) : (
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
    <div className="flex justify-self-center gap-1">
      <Link to="/" className={cn(buttonVariants({ variant: "link" }))}>
        Home
      </Link>
      <Link to="/products" className={cn(buttonVariants({ variant: "link" }))}>
        Products
      </Link>
      {user ? (
        <Link
          to="/dashboard"
          className={cn(buttonVariants({ variant: "link" }))}>
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/auth/login"
            className={cn(buttonVariants({ variant: "link" }))}>
            Login
          </Link>
          <Link
            to="/auth/register"
            className={cn(buttonVariants({ variant: "link" }))}>
            Register
          </Link>
        </>
      )}
    </div>
  );
}
