import { IconHistory } from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, UserRoundPen } from "lucide-react";
import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Settings",
      url: "settings",
      icon: UserRoundPen,
    },
    {
      title: "Orders History",
      url: "orders",
      icon: IconHistory,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  React.useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      setOpenMobile(false);
    });
    return unsub;
  }, [router, setOpenMobile]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <img alt="Logo" className="size-6" src="/logoipsum.svg" />
                <span className="font-semibold text-base">Ashkal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
