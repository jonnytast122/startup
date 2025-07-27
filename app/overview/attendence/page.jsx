"use client";

import { useState } from "react";
import { Search, ListFilter, CalendarClock, ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TimesheetScreen from "./components/timesheetscreen";
import TodayScreen from "./components/todayscreen";
import SettingDialog from "./components/settingdialog";

export default function TimeClock() {
  const [activeTab, setActiveTab] = useState("TODAY");

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/attendence" className="block">
            <div className="flex items-center space-x-3">
              <CalendarClock className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Attendence</span>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 sm:-space-x-4 min-w-0">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${badge.bg
                    } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${badge.textColor || "text-white"
                    }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            <SettingDialog />
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
                setSearchQuery(""); // reset search
              }}
              className={`flex-1 py-3 font-custom sm:text-md md:text-md lg:text-2xl transition-all ${activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 font-custom">
          {activeTab === "TODAY" && <TodayScreen />}
          {activeTab === "TIMESHEETS" && (
            <TimesheetScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
