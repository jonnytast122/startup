import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getDailyOvertime } from "@/lib/api/adminOverview";

export default function LeaveOt() {
  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 9, 30),
    key: "selection",
  });

  const datePickerRef = useRef(null);
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  // Fetch from API
  const { data: summaryData } = useQuery({
    queryKey: ["admin-dashboard-leave-ot", company?.id, selectedRange],
    queryFn: () =>
      getDailyOvertime({
        id: company.id,
        startDate: format(selectedRange.startDate, "yyyy-MM-dd"),
        endDate: format(selectedRange.endDate, "yyyy-MM-dd"),
      }),
    enabled: !!company?.id,
  });

  const leaveTotal = summaryData?.data?.leave?.totalApproved ?? 0;
  const leaveTopEmployees = summaryData?.data?.leave?.topEmployees ?? [];

  const otTotalHours = summaryData?.data?.overtime?.totalHours ?? 0;
  const otTopEmployees = summaryData?.data?.overtime?.topEmployees ?? [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-black">Leave and OT</h2>
        <div className="relative flex gap-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
          >
            <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
            {format(selectedRange.startDate, "MMM dd")} -{" "}
            {format(selectedRange.endDate, "MMM dd")}
            <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
          </button>

          {showDatePicker && (
            <div
              ref={datePickerRef}
              className="absolute top-full mt-2 bg-white shadow-lg border p-2 rounded-md z-50 left-5 translate-x-[-150px]"
            >
              <DateRange
                ranges={[selectedRange]}
                onChange={(ranges) => {
                  const newRange = ranges.selection;
                  setSelectedRange(newRange);
                  if (
                    newRange.startDate &&
                    newRange.endDate &&
                    newRange.startDate.getTime() !== newRange.endDate.getTime()
                  ) {
                    setShowDatePicker(false);
                  }
                }}
                rangeColors={["#3b82f6"]}
              />
            </div>
          )}

          <Select>
            <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative text-[#5494DA]">
              <ListFilter size={20} />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {Filter.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5">
        {/* Box 1 - Summary */}
        <div className="flex flex-col">
          <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-md mb-2">
            Summary
          </div>
          <div className="border border-gray-300 rounded-md p-4 flex gap-4 h-full">
            <div className="flex-1 bg-red-200 rounded-lg py-3 px-6 text-center flex flex-col justify-between">
              <div>
                <h3 className="text-lg text-red-500 mb-1">Total Leave</h3>
                <p className="text-4xl">{leaveTotal}</p>
                <p className="text-xl text-gray-700">days taken</p>
              </div>
              <img src="/images/LeaveLine.png" alt="Leave Line" className="w-28 h-auto mx-auto" />
            </div>
            <div className="flex-1 bg-blue-200 rounded-lg py-3 px-6 text-center flex flex-col justify-between">
              <div>
                <h3 className="text-lg text-blue-500 mb-1">Total OT</h3>
                <p className="text-4xl">{otTotalHours}</p>
                <p className="text-xl text-gray-700">hours earned</p>
              </div>
              <img src="/images/OTLine.png" alt="OT Line" className="w-28 h-auto mx-auto" />
            </div>
          </div>
        </div>

        {/* Box 2 - Top Leave */}
        <div className="flex flex-col">
          <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-md mb-2">
            Top Leave
          </div>
          <div className="border border-gray-300 rounded-md p-4 flex-grow">
            <div className="max-h-64 overflow-y-auto pr-2">
              {leaveTopEmployees.length > 0 ? (
                leaveTopEmployees.map((emp) => (
                  <div key={emp._id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="/avatars/default.png"
                          className="w-9 h-9 rounded-full"
                          alt="avatar"
                        />
                        <span className="text-base font-medium text-gray-800">
                          {emp.employeeData?.name || "Unknown"}
                        </span>
                      </div>
                      <span className="text-base">{emp.count} days</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Box 3 - Top OT */}
        <div className="flex flex-col">
          <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-md mb-2">
            Top OT
          </div>
          <div className="border border-gray-300 rounded-md p-4 flex-grow">
            <div className="max-h-64 overflow-y-auto pr-2">
              {otTopEmployees.length > 0 ? (
                otTopEmployees.map((emp) => (
                  <div key={emp._id} className="mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="/avatars/default.png"
                          className="w-9 h-9 rounded-full"
                          alt="avatar"
                        />
                        <span className="text-base font-medium text-gray-800">
                          {emp.employeeData?.name || "Unknown"}
                        </span>
                      </div>
                      <span className="text-base">{emp.hours} hrs</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
