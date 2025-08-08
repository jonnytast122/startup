"use client";

import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "./components/app-sidebar";
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

export default function Layout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  const user_data = {
    firstname: "John",
    lastname: "Doe",
    avatar: "/avatars/cameron.png",
    role: "Owner",
    accessLevel: "Admin",
    phone: "012345678",
    birthday: "1990-01-01",
    branch: "Main Branch",
    department: "HR",
    title: "Manager",
    dateadded: "2022-01-01",
    cash: 123,
    profile: "/avatars/cameron.png",
    banknumber: "12345678",
    banktransfer: 100,
    single: 25,
    nochildren: 0.6,
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
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <Separator orientation="vertical" className="h-6" />

            <div className="relative" ref={containerRef}>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <img
                  src={user_data.avatar}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border"
                />
                <span className="text-sm font-custom font-medium text-blue-400 hidden sm:inline">
                  {user_data.firstname} {user_data.lastname}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:inline" />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white py-2 shadow-lg">
                  {/* Profile Summary */}
                  <div className="mr-3 ml-3 flex items-center gap-3 px-2 py-2 rounded-xl bg-blue-100">
                    <img
                      src={user_data.avatar}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border"
                    />
                    <div>
                      <div className="font-custom text-md font-medium">
                        {user_data.firstname} {user_data.lastname}
                      </div>
                      <div className="font-custom text-xs font-medium text-gray-500">
                        {user_data.role}
                      </div>
                    </div>
                  </div>
                  {/* Line below profile */}
                  <div className="border-b my-2"></div>

                  {/* Actions */}
                  <button
                    className="w-full px-4 py-2 font-custom text-sm text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/user");
                    }}
                  >
                    <User className="inline-block mr-2 h-4 w-4" />
                    Switch to user's view
                  </button>
                  <button
                    className="w-full px-4 py-2 font-custom text-sm text-left text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      alert("Signed Out");
                    }}
                  >
                    <LogOut className="inline-block mr-2 h-4 w-4" />
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
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
