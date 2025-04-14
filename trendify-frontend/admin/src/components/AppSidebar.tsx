import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, AlignJustify, Package2, UserRoundCog, ShoppingBag } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Category",
    url: "/category",
    icon: AlignJustify,
  },
  {
    title: "Product",
    url: "/product",
    icon: Package2,
  },
  {
    title: "User",
    url: "/user",
    icon: UserRoundCog,
  },
  {
    title: "Order",
    url: "/order",
    icon: ShoppingBag,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl uppercase">
            Trendify
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={activePath === item.url ? "bg-black text-white rounded-xl" : ""}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
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
