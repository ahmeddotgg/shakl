import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/header";
import { AppSidebar } from "@/modules/dashboard/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
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
