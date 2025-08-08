import { MapPin, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function ShiftDetailDialog({ open, detail, onClose, onRequestLeave }) {
  const [note, setNote] = React.useState("");

  if (!open || !detail) return null;

  // Format date as "Tue, Aug 27"
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

  function truncateLocation(loc, maxLen = 40) {
    if (!loc) return "";
    return loc.length > maxLen ? loc.slice(0, maxLen - 3) + "..." : loc;
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f5]/90 flex items-center justify-center px-2">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-[#fafafa] p-0 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>
        {/* Heading */}
        <div className="px-8 pt-8 pb-1">
          <div className="text-2xl font-bold font-custom">Shift details</div>
        </div>
        {/* Card Body */}
        <div className="bg-white rounded-2xl mx-4 mb-6 mt-2 p-0 shadow">
          {/* Row: 'Shift detail' left, date right */}
          <div className="flex justify-between items-center px-8 pt-5 pb-1">
            <div className="text-base font-custom text-gray-800 font-medium">
              Shift detail
            </div>
            <div className="text-base font-custom text-gray-500 font-light">
              {formatHeaderDate(detail.date)}
            </div>
          </div>
          <div className="border-t border-gray-100 mx-8 mt-1 mb-1" />
          {/* Clock-in */}
          <div className="flex justify-between items-center px-8 pt-2">
            <div>
              <div className="text-gray-500 text-[16px] font-custom font-normal">
                Clock-in
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[24px] sm:text-[28px] font-custom text-[#1D73E9] tracking-wide">
                  {detail.clockIn}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 opacity-60" />
                <span className="font-custom">
                  {truncateLocation(detail.location)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mx-8 my-4" />
          {/* Clock-out */}
          <div className="flex justify-between items-center px-8">
            <div>
              <div className="text-gray-500 text-[16px] font-custom font-normal">
                Clock-out
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[24px] sm:text-[28px] font-custom text-[#EF4444] tracking-wide">
                  {detail.clockOut}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4 opacity-60" />
                <span className="font-custom">
                  {truncateLocation(detail.location)}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mx-8 my-4" />
          {/* Total hours */}
          <div className="flex justify-between items-center px-8 pb-3">
            <div className="text-[18px] font-custom text-gray-500">
              Total hours
            </div>
            <div className="text-[24px] font-bold font-custom tracking-wide text-gray-800">
              {detail.workHours}
            </div>
          </div>
          {/* Note Input */}
          <div className="px-8 pb-6">
            <div className="relative mt-3">
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-[16px] font-custom focus:outline-none focus:border-blue-400 placeholder-gray-400"
                placeholder="Note (left blank)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <Edit2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
        {/* Bottom Buttons */}
        <div className="flex flex-row gap-5 px-8 pb-8">
          <Button
            className="flex-1 rounded-full bg-[#3B8AFF] text-white text-lg font-custom py-3 shadow-none hover:bg-[#246dc3]"
            onClick={onClose}
          >
            Confirm hours
          </Button>
          <Button
            className="flex-1 rounded-full bg-[#f7f7fa] text-[#3B8AFF] border border-[#E5EAF2] text-lg font-custom py-3 shadow-none hover:bg-[#f0f7ff]"
            variant="outline"
            onClick={onRequestLeave}
          >
            Request leaves
          </Button>
        </div>
      </div>
    </div>
  );
}
