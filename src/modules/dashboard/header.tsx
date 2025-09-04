import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "@tanstack/react-router";

export function DashboardHeader() {
  const { state } = useRouter();
  const pathname = state.location.pathname;

  let message = "";
  if (pathname === "/dashboard") {
    message = "Welcome to your dashboard!";
  } else if (pathname.startsWith("/dashboard/new")) {
    message = "Create new product";
  } else {
    message = "Hello there!";
  }
  return (
    <header className="flex bg-sidebar h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium text-base">{message}</h1>
      </div>
    </header>
  );
}
