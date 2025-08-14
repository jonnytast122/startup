"use client";

import { CalendarPlus2 } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import PendingDialog from "./components/pendingdialog";
import HistoryTable from "./components/historytable";

export default function Overtime() {

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl mb-3 shadow-md border">
        <div
          className="
          p-4 sm:p-5
          flex flex-col sm:flex-row
          gap-4 sm:gap-6
          sm:items-center sm:justify-between
        "
        >
          {/* Title */}
          <a href="/user/overtime" className="block">
            <div className="flex items-center space-x-3">
              <CalendarPlus2 className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Overtime</span>
            </div>
          </a>

          {/* Actions */}
          <div
            className="
            flex flex-col sm:flex-row
            gap-2 sm:gap-4
            w-full sm:w-auto
          "
          >
            {/* Make each trigger full-width on mobile, auto on desktop */}
            <div className="w-full sm:w-auto">
              <PendingDialog className="w-full" />
            </div>
            <div className="w-full sm:w-auto">
              <RequestDialog className="w-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div>
        <HistoryTable />
      </div>
    </div>
  );
}
