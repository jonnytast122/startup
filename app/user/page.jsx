"use client";

import { SquareKanban } from "lucide-react";
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
      <div className="bg-white rounded-xl mb-3 shadow-md py-1 px-1 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/overview" className="block">
            <div className="flex items-center space-x-3">
              <SquareKanban className="text-[#2998FF]" width={30} height={30} />
              <span className="font-custom text-3xl text-black">Report</span>
            </div>
          </a>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full width Leave & OT box */}
        <div className="md:col-span-2">
          <DailyAttendance />
        </div>
        {/* Full width Leave & OT box */}
        <div className="md:col-span-2">
          <Calendar />
        </div>
        {/* Full width Leave & OT box */}
        <div className="md:col-span-2">
          <EstimatePayroll />
        </div>

        <LeavePolicy />
        <WorkShift />

      </div>
    </div>
  );
}
