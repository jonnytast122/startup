"use client";

import { useState } from "react";
import { UserRound, Search, ListFilter } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import TimesheetScreen from "./components/timesheetscreen";
import TodayScreen from "./components/todayscreen";
//import SettingDialog from "./components/settingdialog";

export default function TimeClock() {
  const [activeTab, setActiveTab] = useState("TODAY");
  const [searchQuery, setSearchQuery] = useState("");

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-3">
            <UserRound className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Time Clock</span>
          </div>

          {/* Asset Admins (Moved before badges) */}
          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            {/* Overlapping Circular Badges */}
            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 sm:-space-x-4 min-w-0">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${
                    badge.bg
                  } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${
             badge.textColor || "text-white"
           }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            {/* <SettingDialog /> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white rounded-xl shadow-md">
        <div className="flex">
          {["TODAY", "TIMESHEETS"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery("");
              }}
              className={`flex-1 py-3 font-custom sm:text-md md:text-md lg:text-2xl transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex items-center p-4 bg-white border-b">
          {/* New Select on the Left */}
          <div className="flex items-center space-x-2">
            {/* Filter Select */}
            <Select>
              <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative">
                <ListFilter className="text-gray-500" size={20} />
                <SelectValue placeholder="Filter" />
                {/* Hides default icon */}
              </SelectTrigger>
              <SelectContent className="font-custom">
                {Filter.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center ml-auto mr-10 w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "Today" ? "Search" : "Search"}
              className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Export Select */}
          <Select>
            <SelectTrigger className="w-24 font-custom rounded-full">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {exportOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="p-6 font-custom">
          {activeTab === "TODAY" && <TodayScreen searchQuery={searchQuery} />}
          {activeTab === "TIMESHEETS" && (
            <TimesheetScreen searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}
