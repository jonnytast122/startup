"use client";

import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Navbar / Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white">
          {/* Left Section: Sidebar Toggle & Search Form */}
          <div className="flex items-center gap-3">
            <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Separator orientation="vertical" className="mr-2 h-6" />

            {/* Search Form */}
            <form className="relative">
              <input
                type="text"
                placeholder="Search anything"
                className="px-2.5 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              {/* Search Icon */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-3 w-3" />
              </button>
            </form>
          </div>

          {/* Right Section: Notifications & Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Button */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <Separator orientation="vertical" className="h-6" />

            {/* User Profile */}
            <div className="flex items-center gap-2">
              {/* Circular Profile Picture */}
              <img
                src="/images/profile.jpg" // Replace with actual profile image path
                alt="Profile"
                className="h-9 w-9 rounded-full border"
              />
              <span className="text-sm text-blue font-medium">John Doe</span>

              {/* Dropdown Button */}
              <button className="p-1 rounded-md hover:bg-gray-100">
                <ChevronDown className="h-4 w-4 text-blue" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-gray-100 flex flex-1 flex-col gap-4 p-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
