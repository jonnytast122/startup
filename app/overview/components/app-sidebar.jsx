"use client";

import {
  LayoutDashboard,
  CalendarClock,
  CalendarPlus2,
  LogOut,
  CreditCard,
  Settings,
  BookCheck,
  Lightbulb,
  User,
  Users,
  Info,
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
      title: "Main",
      items: [
        { title: "Overview", url: "/overview", icon: LayoutDashboard },
      ],
    },
    {
      title: "Operation",
      items: [
        { title: "Attendance", url: "/overview/timeclock", icon: CalendarClock },
        { title: "Leaves", url: "/overview/leaves", icon: LogOut },
        { title: "Overtime", url: "/overview/overtime", icon: CalendarPlus2 },
        { title: "Payroll", url: "/overview/payroll", icon: CreditCard },
      ],
    },
    {
      title: "Setting",
      items: [
        { title: "Company", url: "/overview/company", icon: Settings },
        { title: "Policy", url: "/overview/policy", icon: Lightbulb },
        { title: "Workshift", url: "/overview/workshift", icon: BookCheck },
        { title: "Users & Admin", url: "/overview/users-admin", icon: User },
        { title: "Groups", url: "/overview/groups", icon: Users },
      ],
    },
    {
      title: "Support",
      items: [
        { title: "Help", url: "/overview/help", icon: Info },
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
