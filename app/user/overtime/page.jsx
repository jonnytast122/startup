"use client";

import { CalendarPlus2 } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import PendingDialog from "./components/pendingdialog";
import HistoryTable from "./components/historytable";

export default function Overtime() {
  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl shadow-md py1 px-1 border">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
          {/* Title */}
          <a href="/user/overtime" className="block">
            <div className="flex items-center space-x-3">
              <CalendarPlus2 className="text-[#2998FF]" width={30} height={36} />
              <span className="font-custom text-1xl sm:text-2xl text-black">
                Overtime
              </span>
            </div>
          </a>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <PendingDialog className="px-3 py-1.5 text-sm sm:text-base" />
            <RequestDialog className="px-3 py-1.5 text-sm sm:text-base" />
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
