"use client";

import { CalendarPlus2 } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import PendingDialog from "./components/pendingdialog";
import HistoryTable from "./components/historytable";

export default function Overtime() {

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/user/overtime" className="block">
            <div className="flex items-center space-x-3">
              <CalendarPlus2 className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Overtime</span>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <PendingDialog />
            <RequestDialog />
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
