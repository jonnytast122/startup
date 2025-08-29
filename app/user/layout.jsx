"use client";

import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { BottomNavigation } from "./components/bottom-navigation";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRight,
  Bell,
  ChevronDown,
  Eye,
  Globe,
  LogOut,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ReactQueryProvider from "./react-query-provider";

export default function Layout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  // Optional: Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <ReactQueryProvider>
      <SidebarProvider>
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        <SidebarInset className="flex flex-col h-screen overflow-hidden lg:ml-0">
          {/* Sticky Header - Hidden on mobile */}
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 border-b bg-white hidden lg:flex">
            {/* Left section */}
            <div className="flex items-center gap-3">
              {/* Hide sidebar trigger on mobile since we'll use bottom nav */}
              <div className="hidden lg:block">
                <SidebarTrigger />
              </div>
              <Separator
                orientation="vertical"
                className="h-6 hidden lg:block"
              />
              <form className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12 py-2 px-3 w-32 sm:w-auto"
                />
              </form>
            </div>

            {(user?.role === "owner" || user?.role === "admin") && (
              <div className="flex-1 justify-end hidden xl:flex mr-4">
                <div className="px-4 py-1 rounded-lg bg-blue-100 font-medium text-sm font-custom">
                  <Eye className="inline-block mr-1 h-4 w-4" />
                  You are in User's View
                </div>
                <button
                  className="ml-4 px-3 py-1 bg-gray-100 text-blue-400 font-custom rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    router.push("/admin/overview");
                  }}
                >
                  <ArrowLeftRight className="inline-block mr-2 h-4 w-4" />
                  Switch to Admin Dashboard
                </button>
              </div>
            )}

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Notification Bell - Hidden on mobile */}
              {/* <button className="relative p-2 rounded-full hover:bg-gray-100 hidden lg:block">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button> */}

              {/* Separator - Hidden on mobile */}
              <Separator
                orientation="vertical"
                className="h-6 hidden lg:block"
              />

              {/* Profile Dropdown - Hidden on mobile */}
              <div className="relative hidden lg:block" ref={containerRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-gray-100"
                >
                  <img
                    src={user?.avatar || "/images/feature.png"}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border"
                    onError={(e) => {
                      e.currentTarget.src = "/images/feature.png";
                    }}
                  />
                  <span className="text-sm font-custom font-medium text-blue-400 hidden sm:inline">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:inline" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white py-2 shadow-lg">
                    {/* Profile Summary */}
                    <div className="mx-3 flex items-center gap-3 px-2 py-2 rounded-xl bg-blue-100">
                      <img
                        src={user?.avatar || "/images/feature.png"}
                        alt="Profile"
                        className="h-10 w-10 rounded-full border"
                        onError={(e) => {
                          e.currentTarget.src = "/images/feature.png";
                        }}
                      />
                      <div>
                        <div className="font-custom text-md font-medium">
                          {user?.name || "User"}
                        </div>
                        <div className="font-custom text-xs font-medium text-gray-500">
                          {user?.role || "Role"}
                        </div>
                      </div>
                    </div>
                    {/* Line below profile */}
                    <div className="border-b my-2"></div>

                    {/* Actions */}

                    <button
                      className="w-full px-4 py-2 font-custom text-sm text-left text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut className="inline-block mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Language Selector - Hidden on mobile */}
              <Select>
                <SelectTrigger className="w-[85px] font-custom border-none shadow-none focus:ring-0 focus:outline-none flex items-center gap-1 hidden lg:flex">
                  <Globe className="w-4 h-4 text-dark-blue" />
                  <SelectValue placeholder="EN" />
                </SelectTrigger>
                <SelectContent className="font-custom">
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="kh">KH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* Scrollable content - Add bottom padding on mobile for bottom nav */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 pb-20 lg:pb-4">
            {children}
          </div>
        </SidebarInset>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
