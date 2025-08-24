"use client";

import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, ChevronDown, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ReactQueryProvider from "./react-query-provider";

export default function Layout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  console.log("User in Layout:", user);

  return (
    <ReactQueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {/* Sticky Header */}
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 border-b bg-white">
            {/* Left section */}
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <form className="relative">
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12 py-2 px-3"
                />
              </form>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* <button
              className="relative p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button> */}

              <Separator orientation="vertical" className="h-6" />

              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsDropdownOpen(!isDropdownOpen);
                    }
                    if (e.key === "Escape") {
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  <img
                    src={user?.avatar || "/images/feature.png"}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border"
                    onError={(e) => {
                      e.currentTarget.src = "/images/feature.png";
                    }}
                  />
                  <span className="text-sm font-medium text-gray-800 hidden sm:inline">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:inline" />
                </div>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 z-50 mt-2 w-40 rounded-md border bg-white py-2 shadow-lg"
                    role="menu"
                    aria-label="User menu"
                  >
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        alert("Switched View");
                      }}
                      role="menuitem"
                    >
                      Switch View
                    </button>
                    <button
                      className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <Select>
                <SelectTrigger className="w-[85px] font-custom border-none shadow-none focus:ring-0 focus:outline-none flex items-center gap-1">
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

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
