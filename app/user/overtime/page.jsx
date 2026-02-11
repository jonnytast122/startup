"use client";

import { CalendarPlus2 } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import PendingDialog from "./components/pendingdialog";
import HistoryTable from "./components/historytable";

export default function Overtime() {
  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4 lg:py-6 lg:px-6 border">
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <a href="/user/overtime" className="block shrink-0">
            <div className="flex items-center space-x-3">
              <CalendarPlus2
                className="text-[#2998FF]"
                width={30}
                height={36}
              />
              <span className="font-custom text-3xl text-black">Overtime</span>
            </div>
          </a>

          {/* Actions */}
          <div className="flex flex-row lg:flex-wrap items-center gap-2 ">
            <PendingDialog className="px-3 py-1.5 text-sm shrink-0 w-auto" />
            <RequestDialog className="px-3 py-1.5 text-sm shrink-0 w-auto" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-full overflow-auto">
        <HistoryTable />
      </div>
    </div>
  );
}
