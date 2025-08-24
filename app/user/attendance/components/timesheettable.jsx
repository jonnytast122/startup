"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/* =======================
   Fake Timesheet Data
   ======================= */
const fakeData = [
  {
    date: "2025-08-24",
    job: "Accountant",
    status: "Late",
    start: "09:42",
    break: "12:00 - 13:00",
    end: "17:45",
    total: "07:03",
    daily: "06:48",
    note: "",
  },
  {
    date: "2025-08-23",
    job: "Accountant",
    status: "Early",
    start: "08:25",
    break: "12:00 - 13:00",
    end: "17:00",
    total: "07:35",
    daily: "07:30",
    note: "Wife's Birthday",
    subrows: [
      { label: "Sick leave", daily: "08:00" },
      { label: "Time off", daily: "08:00" },
      { label: "Unpaid leave", daily: "07:30" },
    ],
  },
  {
    date: "2025-08-22",
    job: "Accountant",
    status: "Time off",
    start: "--",
    break: "12:00 - 13:00",
    end: "--",
    total: "--",
    daily: "08:00",
  },
  {
    date: "2025-08-21",
    job: "Accountant",
    status: "Absent",
    start: "--",
    break: "--",
    end: "--",
    total: "--",
    daily: "--",
  },
  {
    date: "2025-08-20",
    job: "Accountant",
    status: "On time",
    start: "08:25",
    break: "12:00 - 13:00",
    end: "17:32",
    total: "08:07",
    daily: "08:00",
  },
  {
    date: "2025-08-19",
    job: "Accountant",
    status: "On time",
    start: "08:23",
    break: "12:00 - 13:00",
    end: "17:31",
    total: "08:08",
    daily: "08:00",
  },
  {
    date: "2025-08-18",
    job: "Accountant",
    status: "Time off",
    start: "--",
    break: "--",
    end: "--",
    total: "--",
    daily: "08:00",
  },
  {
    date: "2025-08-17",
    job: "Accountant",
    status: "Late",
    start: "09:15",
    break: "12:30 - 13:15",
    end: "18:00",
    total: "07:45",
    daily: "07:20",
    note: "Traffic delay",
  },
  {
    date: "2025-08-23",
    job: "Accountant",
    status: "Early",
    start: "08:25",
    break: "12:00 - 13:00",
    end: "17:00",
    total: "07:35",
    daily: "07:30",
    note: "Wife's Birthday",
    subrows: [
      { label: "Sick leave", daily: "08:00" },
      { label: "Time off", daily: "08:00" },
      { label: "Unpaid leave", daily: "07:30" },
    ],
  },
  {
    date: "2025-08-16",
    job: "Accountant",
    status: "On time",
    start: "08:10",
    break: "12:00 - 13:00",
    end: "17:05",
    total: "08:55",
    daily: "08:45",
  },
  {
    date: "2025-08-15",
    job: "Accountant",
    status: "Absent",
    start: "--",
    break: "--",
    end: "--",
    total: "--",
    daily: "--",
    note: "Medical leave",
  },
  {
    date: "2025-08-14",
    job: "Accountant",
    status: "Early",
    start: "08:05",
    break: "12:00 - 12:45",
    end: "16:50",
    total: "07:55",
    daily: "07:40",
  },
  {
    date: "2025-08-13",
    job: "Accountant",
    status: "On time",
    start: "08:20",
    break: "12:00 - 13:00",
    end: "17:20",
    total: "08:10",
    daily: "08:00",
    note: "Client meeting",
  },
  {
    date: "2025-08-12",
    job: "Accountant",
    status: "Time off",
    start: "--",
    break: "--",
    end: "--",
    total: "--",
    daily: "08:00",
  },
  {
    date: "2025-08-11",
    job: "Accountant",
    status: "Late",
    start: "09:05",
    break: "12:15 - 13:00",
    end: "17:45",
    total: "07:40",
    daily: "07:15",
  },
  {
    date: "2025-08-10",
    job: "Accountant",
    status: "On time",
    start: "08:18",
    break: "12:00 - 13:00",
    end: "17:28",
    total: "08:10",
    daily: "08:00",
  },
];

/* =======================
   Calendar Control
   ======================= */
function Controls({ selectedRange, setSelectedRange }) {
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
      <button
        onClick={() => setShowDatePicker((v) => !v)}
        className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
      >
        <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
        {format(selectedRange.startDate, "dd/MM")} to{" "}
        {format(selectedRange.endDate, "dd/MM")}
        <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
      </button>

      {showDatePicker && (
        <div
          ref={datePickerRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg border p-2 rounded-md z-50"
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
            moveRangeOnFirstSelection={false}
            rangeColors={["#3b82f6"]}
          />
        </div>
      )}
    </div>
  );
}

/* =======================
   Main Component
   ======================= */
export default function TimesheetTable() {
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 7, 31),
    key: "selection",
  });

  const data = useMemo(() => fakeData, [selectedRange]);

  return (
    <div className="bg-white rounded-xl shadow-md py-6 px-4 sm:px-6 border mt-5 mb-10 w-full overflow-x-auto">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-3 w-full flex-nowrap">
          <div className="font-custom text-xl font-semibold whitespace-nowrap">
            Timesheet
          </div>
          <Controls
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-2 mt-2 flex flex-col sm:flex-row gap-4 text-base font-custom">
        <span>
          <span className="font-semibold text-black">Total Working Day:</span>{" "}
          {data.length} day
        </span>
        <span>
          <span className="font-semibold text-black">Total Regular:</span> 46:48
          hours
        </span>
      </div>

      {/* Table */}
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="bg-gray-100 text-gray-600 text-sm font-custom">
            <TableHead className="w-8">
              <input type="checkbox" className="accent-blue-500" />
            </TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Jobs</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Break</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Total hours</TableHead>
            <TableHead>Daily total</TableHead>
            <TableHead>Employee note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <>
              {/* Main row */}
              <TableRow key={i} className="text-sm font-custom">
                <TableCell></TableCell>
                <TableCell>
                  {new Date(row.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 border border-blue-400 text-blue-600 rounded-full text-xs">
                    {row.job}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`${
                      row.status === "Late"
                        ? "text-red-500"
                        : row.status === "On time"
                        ? "text-green-500"
                        : row.status === "Early"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
                <TableCell>{row.start}</TableCell>
                <TableCell>{row.break}</TableCell>
                <TableCell>{row.end}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell className="font-semibold">{row.daily}</TableCell>
                <TableCell>{row.note}</TableCell>
              </TableRow>

              {/* Subrows */}
              {/* Subrows */}
              {row.subrows &&
                row.subrows.map((sub, j) => (
                  <TableRow
                    key={`${i}-${j}`}
                    className={`text-xs font-custom text-blue-600 ${
                      j === row.subrows.length - 1 ? "" : "border-0"
                    }`}
                  >
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{sub.label}</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>{sub.daily}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
