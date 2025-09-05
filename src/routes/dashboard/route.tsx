import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/header";
import { AppSidebar } from "@/modules/dashboard/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: ({ context: { auth }, location }) => {
    if (!auth?.user) {
      throw redirect({
        to: "/unauthenticated",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }>
      <AppSidebar />
      <div className="w-full">
        <DashboardHeader />
        <div className="py-16 container">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
