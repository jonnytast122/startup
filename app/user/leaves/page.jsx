"use client";

import { LogOut } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import HistoryTable from "./components/historytable";

export default function Leaves() {

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-1 px-1 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/user/Leaves" className="block">
            <div className="flex items-center space-x-3">
              <LogOut className="text-[#2998FF]" width={36} height={36} />
              <span className="font-custom text-3xl text-black">Leaves</span>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <RequestDialog />
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        {/* Title */}
        <h2 className="text-2xl font-custom font-semibold mb-6">Leave Policies</h2>

        {/* Boxes container */}
        <div className="flex justify-center gap-6">
          {/* Box 1 */}
          <div className="bg-blue-100 rounded-lg shadow-sm w-48 h-32 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-custom">Sick Leave</span>
            <div className="w-2/3 h-px bg-gray-500 my-2"></div>
            <span className="text-lg font-custom">12 days</span>
          </div>

          {/* Box 2 */}
          <div className="bg-blue-100 rounded-lg shadow-sm w-48 h-32 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-custom">Annual Leave</span>
            <div className="w-2/3 h-px bg-gray-500 my-2"></div>
            <span className="text-lg font-custom">13.5 days</span>
          </div>

          {/* Box 3 */}
          <div className="bg-blue-100 rounded-lg shadow-sm w-48 h-32 flex flex-col items-center justify-center p-4">
            <span className="text-sm font-custom">Unpiad Leave</span>
            <div className="w-2/3 h-px bg-gray-500 my-2"></div>
            <span className="text-lg font-custom">--</span>
          </div>
        </div>
      </div>

      <div>
        <HistoryTable />
      </div>
    </div>
  );
}
