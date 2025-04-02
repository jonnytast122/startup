"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ChartNoAxesGantt, User, Users, 
  CalendarClock, Calendar1, CalendarPlus2, LogOut, CreditCard, 
  Lightbulb, Settings 
} from "lucide-react";

import Link from "next/link";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      items: [
        { title: "Overview", url: "/overview", icon: LayoutDashboard },
        { title: "Activity", url: "/overview/activity", icon: ChartNoAxesGantt },
        { title: "Users & Admin", url: "/overview/users-admin", icon: User }, // Ensure this route exists
        { title: "Groups", url: "/overview/groups", icon: Users }, // Provide a valid URL
      ],
    },
    {
      title: "Operation",
      items: [
        { title: "Time Clock", url: "/overview/time-clock", icon: CalendarClock },
        { title: "Job Schedule", url: "/overview/job-schedule", icon: Calendar1 },
        { title: "Overtime", url: "/overview/overtime", icon: CalendarPlus2 },
        { title: "Leaves", url: "/overview/leaves", icon: LogOut },
        { title: "Payroll", url: "/overview/payroll", icon: CreditCard },
      ],
    },
    
    {
      title: "Others",
      items: [
        { title: "Support", url: "/overview/support", icon: Lightbulb },
        { title: "Setting", url: "/overview/setting", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar(props) {
  const pathname = usePathname(); // Get current route

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="items-center justify-center">
                <img src="/images/Logo_2.png" alt="Logo" className="h-11" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            {/* Render main items */}
            {data.navMain[0].items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`text-base font-custom flex items-center p-2 rounded-lg ${
                      pathname === item.url
                        ? "bg-[#5494DA33] text-dark-gray" // Active state styling
                        : "text-dark-gray hover:bg-[#5494DA33]"
                    }`}
                  >
                    <item.icon className="mr-2" /> {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Render sections like "Operation", "Others" */}
            {data.navMain.slice(1).map((section, index) => (
              <SidebarMenuItem key={index}>
                {section.title && (
                  <SidebarMenuButton asChild>
                    <span className="text-xs font-vietname-thin">{section.title}</span>
                  </SidebarMenuButton>
                )}
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={item.url}
                          className={`text-base font-custom flex items-center p-2 rounded-lg ${
                            pathname === item.url
                              ? "bg-[#5494DA33] text-dark-gray" // Active state styling
                              : "text-dark-gray hover:bg-[#5494DA33]"
                          }`}
                        >
                          <item.icon className="mr-2" /> {item.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
