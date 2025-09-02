import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/header";
import { AppSidebar } from "@/modules/dashboard/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  beforeLoad({ context }) {
    if (!context.auth?.user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
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
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
