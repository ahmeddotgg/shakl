import { IconHistory } from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, PlusCircle, UserRoundPen } from "lucide-react";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Product",
    url: "/dashboard/new",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: UserRoundPen,
  },
  {
    title: "Orders History",
    url: "/dashboard/orders",
    icon: IconHistory,
  },
];

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
              className="data-[slot=sidebar-menu-button]:p-1.5!"
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild tooltip={link.title}>
                    <Link
                      to={link.url}
                      className="links-center flex gap-2"
                      activeOptions={{ exact: true }}
                      activeProps={{ className: "text-primary " }}
                    >
                      {link.icon && <link.icon />}
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
