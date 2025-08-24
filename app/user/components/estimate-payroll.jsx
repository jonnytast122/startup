"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const fakeData = [
  { date: "Jul 01", netSalary: 22000 },
  { date: "Jul 05", netSalary: 23000 },
  { date: "Jul 10", netSalary: 32500 },
  { date: "Jul 15", netSalary: 33500 },
  { date: "Jul 20", netSalary: 43800 },
  { date: "Jul 25", netSalary: 43000 },
  { date: "Jul 30", netSalary: 53300 },
];

// Reusable controls: auto-close the picker after both dates are selected
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
        className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
      >
        <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
        {format(selectedRange.startDate, "MMM dd")} - {format(selectedRange.endDate, "MMM dd")}
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
              // Auto-close after both dates are picked and differ
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

export default function EstimatePayroll() {
  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 30),
    key: "selection",
  });

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom border">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-black">Estimate Payroll</h2>

        {/* Desktop / tablet controls (stay in header) */}
        <div className="hidden md:block">
          <Controls
            popoverAlign="nudge"
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Mobile controls: BELOW the separator */}
      <div className="block md:hidden mb-4">
        <Controls
          popoverAlign="left"
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      </div>

      {/* Summary Box + Chart */}
      <div className="border rounded-lg p-4 bg-white">
        {/* Summary */}
        <div className="mb-6">
          {/* Mobile grid: 3 items per row, centered */}
          <div className="grid grid-cols-3 text-center gap-y-4 md:hidden">
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">Regular Pay</span>
              <span className="text-base text-black">2,300$</span>
            </div>
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">Overtime Pay</span>
              <span className="text-base text-black">150$</span>
            </div>
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">Gross Salary</span>
              <span className="text-base text-black">2,450$</span>
            </div>
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">NSSF</span>
              <span className="text-base text-black">50$</span>
            </div>
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">Tax</span>
              <span className="text-base text-black">-100$</span>
            </div>
            <div className="flex flex-col text-sm items-center">
              <span className="text-gray-600">Net Salary</span>
              <span className="text-base text-black">2,300$</span>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-wrap gap-x-8 gap-y-2 ml-2">
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">Regular Pay</span>
              <span className="text-base text-black">2,300$</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">Overtime Pay</span>
              <span className="text-base text-black">150$</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">Gross Salary</span>
              <span className="text-base text-black">2,450$</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">NSSF</span>
              <span className="text-base text-black">50$</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-base text-black">-100$</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-600">Net Salary</span>
              <span className="text-base text-black">2,300$</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={fakeData}
            style={{ backgroundColor: "#f3f4f6", borderRadius: "0.5rem" }}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4E4B51" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="netSalary" stroke="#3b82f6" strokeWidth={2} />
            <ReferenceLine
              x={fakeData[Math.floor(fakeData.length / 2)].date}
              stroke="#9ca3af"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
