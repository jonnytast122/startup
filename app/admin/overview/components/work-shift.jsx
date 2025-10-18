"use client";

import { useState, useRef, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getWorkShiftRate } from "@/lib/api/adminOverview";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function WorkShift() {
  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const datePickerRef = useRef(null);

  // Hide date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { data: workShiftRate, isLoading } = useQuery({
    queryKey: [
      "admin-dashboard-work-shift-rate",
      company?.id,
      selectedRange.startDate,
      selectedRange.endDate,
    ],
    queryFn: () =>
      getWorkShiftRate({
        id: company.id,
        startDate: format(selectedRange.startDate, "yyyy-MM-dd"),
        endDate: format(selectedRange.endDate, "yyyy-MM-dd"),
      }),
    enabled: !!company?.id,
  });

  const shifts = workShiftRate?.data || [];

  // Calculate accuracy rate per shift
  const shiftRates = shifts.map((shift) => {
    const total =
      shift.attendance.onTime +
      shift.attendance.late +
      shift.attendance.absent +
      shift.attendance.onLeave +
      shift.attendance.early;

    // Accuracy formula: (onTime / total) * 100
    const percentage =
      total > 0 && shift.attendance.onTime > 0
        ? ((shift.attendance.onTime / total) * 100).toFixed(1)
        : 0;

    return {
      ...shift,
      percentage,
    };
  });

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl text-black">Work Shift Attendance Preview</h2>

        <div className="relative flex gap-2">
          {/* Date button */}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom w-fit"
          >
            <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
            {format(selectedRange.startDate, "MMM dd")} -{" "}
            {format(selectedRange.endDate, "MMM dd")}
            <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
          </button>

          {/* Date picker */}
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

          {/* Filter dropdown */}
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

      {/* Table */}
      <div className="border border-gray-400 rounded-md p-4 pb-10">
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-gray-600 text-sm">
                  Work Shift
                </TableHead>
                <TableHead className="text-right text-gray-600 text-sm">
                  Accuracy Rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : shiftRates.length > 0 ? (
                shiftRates.map((shift) => (
                  <TableRow key={shift.shiftId}>
                    <TableCell className="text-sm">
                      {shift.shiftName}
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-800">
                      {shift.percentage}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
