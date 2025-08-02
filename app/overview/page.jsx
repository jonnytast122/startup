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
        <div className="flex items-center space-x-3 p-6">
          <LayoutDashboard className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Overview</span>
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
