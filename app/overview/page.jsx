"use client";

import { LayoutDashboard } from "lucide-react";
import DailyAttendance from "./components/daily-attendance";
import Calendar from "./components/calendar";
import LeaveOT from "./components/leave-ot";
import EstimatePayroll from "./components/estimate-payroll";
import UpcomingEvent from "./components/upcoming-event"
import LeavePolicy from "./components/leave-policy"
import WorkShift from "./components/work-shift"
import CompanyOverview from "./components/company-overview"

export default function OverviewPage() {
  return (
    <div className="space-y-2 scrollbar-hide font-custom">
      {/* Header */}
            <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/overview" className="block">
            <div className="flex items-center space-x-3">
              <LayoutDashboard className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Overview</span>
            </div>
          </a>

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
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${badge.bg
                    } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${badge.textColor || "text-white"
                    }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyAttendance />
        <Calendar />

        {/* Full width Leave & OT box */}
        <div className="md:col-span-2">
          <LeaveOT />
        </div>

        <EstimatePayroll />
        <UpcomingEvent />

        <LeavePolicy />
        <WorkShift />

                <div className="md:col-span-2">
          <CompanyOverview />
        </div>
      </div>
    </div>
  );
}