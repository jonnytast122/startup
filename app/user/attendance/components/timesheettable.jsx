"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Utility: get all days between two dates
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Utility: group days into weeks, return section headers + rows
function getTimesheetRows(selectedRange) {
  if (!selectedRange.startDate || !selectedRange.endDate) return [];
  const allDates = getDatesInRange(selectedRange.startDate, selectedRange.endDate);

  const weeks = [];
  let weekStartIdx = 0;

  while (weekStartIdx < allDates.length) {
    // Each "week" is at most 7 days
    const weekDates = allDates.slice(weekStartIdx, weekStartIdx + 7);
    const weekLabel = `${weekDates[0].toLocaleDateString("en-GB", {
      month: "short",
      day: "2-digit",
    })} - ${weekDates[weekDates.length - 1].toLocaleDateString("en-GB", {
      month: "short",
      day: "2-digit",
    })}`;

    weeks.push({
      week: weekLabel,
      days: weekDates.map((date, idx) => ({
        date,
        weeklyTotal: idx === weekDates.length - 1 ? "––" : "",
      })),
    });

    weekStartIdx += 7;
  }

  // Flatten for the table (section row + date rows)
  const result = [];
  for (const week of weeks) {
    result.push({ _section: true, week: week.week });
    for (let i = 0; i < week.days.length; ++i) {
      result.push(week.days[i]);
    }
  }
  return result;
}

// --- Table columns ---
const columns = [
  {
    id: "checkbox",
    header: () => <input type="checkbox" className="accent-blue-500" />,
    cell: () => <input type="checkbox" className="accent-blue-500" />,
    size: 36,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date;
      if (!date) return "";
      return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: () => "--",
  },
  {
    accessorKey: "subjob",
    header: "Sub job",
    cell: () => "--",
  },
  {
    accessorKey: "start",
    header: "Start",
    cell: () => "--",
  },
  {
    accessorKey: "end",
    header: "End",
    cell: () => "--",
  },
  {
    accessorKey: "totalhours",
    header: "Total hours",
    cell: () => "--",
  },
  {
    accessorKey: "dailytotal",
    header: "Daily total",
    cell: () => "--",
  },
  {
    accessorKey: "weeklyTotal",
    header: "Weekly total",
    cell: ({ row }) => row.original.weeklyTotal || "",
  },
];

export default function TimesheetTable() {
  // --- Date range state ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),  // July 1, 2025
    endDate: new Date(2025, 6, 31),   // July 31, 2025
    key: "selection",
  });
  const datePickerRef = useRef(null);

  // --- Close picker on outside click ---
  useEffect(() => {
    if (!showDatePicker) return;
    function handleClickOutside(event) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [showDatePicker]);

  // --- Table data based on current date range ---
  const data = useMemo(() => getTimesheetRows(selectedRange), [selectedRange]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl shadow-md py-6 px-2 sm:px-6 border mt-5 mb-10 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="font-custom text-xl font-semibold">Timesheet</div>
          {/* Date Range Picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center font-custom justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm w-full sm:w-auto"
            >
              {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute font-custom z-10 mt-2 bg-white shadow-lg border p-2 rounded-md"
              >
                <DateRangePicker
                  ranges={[selectedRange]}
                  onChange={(ranges) => {
                    const newRange = ranges.selection;
                    setSelectedRange(newRange);

                    const start = newRange.startDate;
                    const end = newRange.endDate;
                    if (start && end && start.getTime() !== end.getTime()) {
                      setShowDatePicker(false);
                    }
                  }}
                  rangeColors={["#3b82f6"]}
                  moveRangeOnFirstSelection={false}
                  showMonthAndYearPickers={true}
                  showSelectionPreview={true}
                />
              </div>
            )}
          </div>
        </div>
        <button className="rounded-full px-5 py-1 text-blue-500 border border-blue-100 font-custom bg-white hover:bg-blue-50 w-full sm:w-auto">
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="mb-2 mt-2 flex flex-col sm:flex-row gap-4 text-base font-custom">
        <span>
          <span className="font-semibold text-black">Total Working Day:</span>{" "}
          {data.filter((row) => !row._section).length} day
        </span>
        <span>
          <span className="font-semibold text-black">Total Regular:</span>{" "}
          46:48 hours
        </span>
      </div>

      {/* Table: horizontally scrollable on mobile */}
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px] w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100 text-gray-500 text-lg font-custom">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap px-2 min-w-[70px] text-xs font-custom"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-gray-400 font-custom">
                  No records for this date range.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) =>
                row._section ? (
                  <tr key={"section-" + row.week}>
                    <td colSpan={columns.length} className="bg-gray-100 text-gray-500 font-custom px-3 py-1 text-center font-semibold">
                      {row.week}
                    </td>
                  </tr>
                ) : (
                  <TableRow key={i} className="hover:bg-white transition">
                    {table.getAllColumns().map((col, ci) => (
                      <TableCell
                        key={col.id}
                        className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis px-2"
                      >
                        {flexRender(col.columnDef.cell, { row: { original: row } })}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
