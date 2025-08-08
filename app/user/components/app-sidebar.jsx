"use client";

import {
  LayoutDashboard,
  CalendarClock,
  CalendarPlus2,
  LogOut,
  CreditCard,
  User,
  Info,
  Calendar1
} from "lucide-react";
import { NavMain } from "./nav-main";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "",
      items: [
        { title: "Calendar", url: "/user", icon: Calendar1, alert: 0 },
        { title: "Profile", url: "/user/profile", icon: User, alert: 2 },
      ],
    },
    {
      title: "Operation",
      items: [
        { title: "Attendance", url: "/user/attendance", icon: CalendarClock, alert: 2 },
        { title: "Overtime", url: "/user/overtime", icon: CalendarPlus2, alert: 0 },
        { title: "Leaves", url: "/user/leaves", icon: LogOut, alert: 2 },
        { title: "Payroll", url: "/user/payroll", icon: CreditCard, alert: 0 },
      ],
    },
    {
      title: "Support",
      items: [
        { title: "Help", url: "/overview/help", icon: Info, alert: 0 },
      ],
    },
  ],
};

export function AppSidebar(props) {
  const { collapsed } = useSidebar()

  // Don't render footer if sidebar is collapsed
  if (collapsed) return null

  return (
    <Sidebar collapsible="icon" className="z-50 bg-white" {...props}>
      <SidebarHeader className="items-center bg-white">
        <img
          src="/images/Logo_2.png"
          alt="Logo"
          className="w-28 h-auto"
        />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter
        className="bg-white"
      >
        <Separator className="mb-2" />
        <span className="text-xs text-blue-600 text-center">ANAN</span>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
