"use client";

import { GalleryVerticalEnd, FileText, CreditCard, Settings, Bell, Lightbulb, Menu, X, ChevronDown, LogOut, LayoutDashboard, ChartNoAxesGantt, User, Users, CalendarClock, Calendar1, CalendarPlus2, Calendar1Icon } from "lucide-react";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample navigation data with the "Getting Started" section title removed
const data = {
  navMain: [
    {
      items: [ // Only keep the items, no title
        { title: "Overview", url: "/overview", icon: LayoutDashboard },
        { title: "Activity", url: "/overview/activity", icon: ChartNoAxesGantt },
        { title: "Users & Admin", url: "#", icon: User },
        { title: "Groups", url: "#", icon: Users },
      ],
    },
    {
      title: "Operation",
      url: "",
      items: [
        { title: "Time Clock", url: "#", icon: CalendarClock },
        { title: "Job Schedule", url: "#", icon: Calendar1, isActive: true },
        { title: "Overtime", url: "#", icon: CalendarPlus2 },
        { title: "Leaves", url: "#", icon: LogOut },
        { title: "Payroll", url: "#", icon: CreditCard },
      ],
    },
    {
      title: "Others",
      url: "#",
      items: [
        { title: "Support", url: "#", icon: Lightbulb },
        { title: "Setting", url: "#", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar(props) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem >
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
            {/* Render main items directly without a vertical line */}
            {data.navMain[0].items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className="text-base font-vietname-thin flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <item.icon className="mr-2" /> {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Iterate over the remaining sections (Operation, Others) */}
            {data.navMain.slice(1).map((section, index) => (
              <SidebarMenuItem key={index}>
                {section.title && (
                  <SidebarMenuButton asChild>
                    <a href={section.url} className="text-xs font-vietname-thin">
                      {section.title}
                    </a>
                  </SidebarMenuButton>
                )}
                {section.items?.length > 0 && (
                  <SidebarMenuSub>
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <Link
                            href={item.url}
                            className="text-lg font-vietname-thin flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                          >
                            <item.icon className="mr-2" /> {item.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
