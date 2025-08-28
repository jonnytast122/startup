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

const workShiftData = [
  { shift: "Full Time Shift", accuracy: 98 },
  { shift: "Part Time Shift", accuracy: 98 },
  { shift: "Morning Shift", accuracy: 98 },
  { shift: "Weekend Shift", accuracy: 98 },
  { shift: "Full Time Shift", accuracy: 98 },
  { shift: "Part Time Shift", accuracy: 98 },
  { shift: "Morning Shift", accuracy: 98 },
  { shift: "Weekend Shift", accuracy: 98 },
];

// Reusable controls: auto-close the picker after both dates selected
function Controls({ popoverAlign = "left", selectedRange, setSelectedRange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      {/* Date Button */}
      <button
        onClick={() => setShowDatePicker((v) => !v)}
        className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom w-fit"
      >
        <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
        {format(selectedRange.startDate, "MMM dd")} -{" "}
        {format(selectedRange.endDate, "MMM dd")}
        <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
      </button>

      {/* Date Picker Popover */}
      {showDatePicker && (
        <div
          ref={datePickerRef}
          className={[
            "absolute top-full mt-2 bg-white shadow-lg border p-2 rounded-md z-50",
            popoverAlign === "left" ? "left-0" : "left-5 -translate-x-[150px]",
          ].join(" ")}
        >
          <DateRange
            ranges={[selectedRange]}
            onChange={(ranges) => {
              const newRange = ranges.selection;
              setSelectedRange(newRange);
              // Auto-close only after both dates are selected and different
              if (
                newRange.startDate &&
                newRange.endDate &&
                newRange.startDate.getTime() !== newRange.endDate.getTime()
              ) {
                setShowDatePicker(false);
              }
            }}
            moveRangeOnFirstSelection={false}
            rangeColors={["#3b82f6"]}
          />
        </div>
      )}

      {/* Filter */}
      <Select>
        <SelectTrigger className="w-28 font-custom rounded-full flex items-center gap-2 relative text-[#5494DA]">
          <ListFilter size={20} />
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent className="font-custom">
          {[
            { value: "Select all", label: "Select all" },
            { value: "All users group", label: "All users group" },
            { value: "Assigned features", label: "Assigned features" },
          ].map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function WorkShift() {
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      {/* Header with title and controls (controls shown here on md+) */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl text-black">Work Shift Attendance Preview</h2>
        <div className="hidden md:block">
          <Controls
            popoverAlign="nudge"
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>
      </div>

      {/* Separator under title */}
      <Separator className="mb-4" />

      {/* Mobile controls BELOW the separator */}
      <div className="block md:hidden mb-4">
        <Controls
          popoverAlign="left"
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      </div>

      {/* Bordered table container */}
      <div className="border border-gray-300 rounded-md p-4 pb-10">
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-gray-600 text-sm">Work Shift</TableHead>
                <TableHead className="text-right text-gray-600 text-sm">
                  Accuracy Rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workShiftData.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-sm">{item.shift}</TableCell>
                  <TableCell className="text-right text-sm text-gray-800">
                    {item.accuracy}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
