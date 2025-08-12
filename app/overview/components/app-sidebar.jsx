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
        { title: "Overview", url: "/overview", icon: LayoutDashboard, alert: 0 },
      ],
    },
    {
      title: "Operation",
      items: [
        { title: "Attendance", url: "/overview/attendence", icon: CalendarClock, alert: 2 },
        { title: "Overtime", url: "/overview/overtime", icon: CalendarPlus2, alert: 0 },
        { title: "Leaves", url: "/overview/leaves", icon: LogOut, alert: 2 },
        { title: "Payroll", url: "/overview/payroll", icon: CreditCard, alert: 0 },
      ],
    },
    {
      title: "Setting",
      items: [
        { title: "Company", url: "/overview/company", icon: Settings, alert: 0 },
        { title: "Policy", url: "/overview/policy", icon: Lightbulb, alert: 0 },
        { title: "Workshift", url: "/overview/workshift", icon: BookCheck, alert: 2 },
        { title: "Users & Admin", url: "/overview/users-admin", icon: User, alert: 0 },
        { title: "Groups", url: "/overview/groups", icon: Users, alert: 0 },
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
