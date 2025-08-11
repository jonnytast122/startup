import React, { useState } from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function RequestLeaveDialog({
  open,
  detail,
  onClose,
  onCloseAll,
}) {
  const [leaveType, setLeaveType] = useState("");
  const [note, setNote] = useState("");

  if (!open || !detail) return null;

  function formatHeaderDate(dateString) {
    try {
      const d = new Date(dateString.split("/").reverse().join("-")); // dd/mm/yyyy → yyyy-mm-dd
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-[#fafafa] p-0 relative">
        {/* Close + Heading */}
        <div className="flex items-center px-8 pt-8 pb-1">
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700 mr-2"
            aria-label="Back"
          >
            &lt;
          </button>
          <div className="text-2xl font-bold font-custom">Request leaves</div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl mx-4 mb-6 mt-2 p-0 shadow">
          {/* Row: Shift date */}
          <div className="flex justify-between items-center px-8 pt-5">
            <div className="text-base font-custom text-gray-800 font-medium">
              Shift date
            </div>
            <div className="text-base font-custom text-gray-500 font-light">
              {formatHeaderDate(detail.date)}
            </div>
          </div>
          <div className="border-t border-gray-100 mx-8 mt-3 mb-1" />

          {/* Leave type (shadcn select) */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-8 pt-2">
            <div className="text-base font-custom text-gray-800 mt-2 sm:mt-0 mb-2 sm:mb-0">
              Leave type
            </div>
            <div className="w-full sm:w-1/2 ml-auto">
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="w-full rounded-xl border border-gray-300 bg-white py-2 px-4 text-[16px] font-custom focus:outline-none focus:border-blue-400 placeholder-gray-400 shadow-none">
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="Sick leave"
                    className="font-custom hover:bg-blue-50 hover:text-[#3B8AFF] transition"
                  >
                    Sick leave
                  </SelectItem>
                  <SelectItem
                    value="Annual leave"
                    className="font-custom hover:bg-blue-50 hover:text-[#3B8AFF] transition"
                  >
                    Annual leave
                  </SelectItem>
                  <SelectItem
                    value="Unpaid leave"
                    className="font-custom hover:bg-blue-50 hover:text-[#3B8AFF] transition"
                  >
                    Unpaid leave
                  </SelectItem>
                  <SelectItem
                    value="Maternity leave"
                    className="font-custom hover:bg-blue-50 hover:text-[#3B8AFF] transition"
                  >
                    Maternity leave
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-gray-200 mx-8 my-5" />

          {/* Note Input */}
          <div className="px-8">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-[16px] font-custom focus:outline-none focus:border-blue-400 placeholder-gray-400"
                placeholder="Add note to your request"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Edit2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Total hours */}
          <div className="flex justify-between items-center px-8 pt-6 pb-3">
            <div className="text-[16px] font-custom text-gray-500">
              Total hours
            </div>
            <div className="text-[22px] font-bold font-custom tracking-wide text-gray-800">
              {detail.workHours}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="text-gray-600 font-custom text-base mb-5">
            Your request will be send for manager’s approval
          </div>
          <Button
            className="w-full rounded-full bg-[#3B8AFF] text-white text-lg font-custom py-3 shadow-none hover:bg-[#246dc3]"
            onClick={() => {
              // handle submit, then close all dialogs
              if (typeof onCloseAll === "function") onCloseAll();
            }}
          >
            Send for approval
          </Button>
        </div>
      </div>
    </div>
  );
}
