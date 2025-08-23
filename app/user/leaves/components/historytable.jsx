"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const fakeData = [
  {
    date: "2025-07-02",
    policy: "Sick Leave",
    requestedOn: "2025-07-02",
    totalOvertime: "2 hour",
    status: "Pending",
    totalHour: "08:00",
    note: "Reviewed by manager",
  },
  {
    date: "2025-07-04",
    policy: "Annual Leave",
    requestedOn: "2025-07-04",
    totalOvertime: "3 hour",
    status: "Approved",
    totalHour: "07:30",
    note: "Auto-submitted",
  },
  {
    date: "2025-07-06",
    policy: "Weekend OT",
    requestedOn: "2025-07-06",
    totalOvertime: "4 hour",
    status: "Rejected",
    totalHour: "06:45",
    note: "—",
  },
];

/* =======================
   Utils
   ======================= */
const fmtKey = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Build rows (with week section rows) */
function getTimesheetRows(selectedRange) {
  if (!selectedRange.startDate || !selectedRange.endDate) return [];
  const allDates = getDatesInRange(
    selectedRange.startDate,
    selectedRange.endDate
  );

  const fakeMap = {};
  for (const item of fakeData) {
    fakeMap[item.date] = item;
  }

  const weeks = [];
  for (let i = 0; i < allDates.length; i += 7) {
    const slice = allDates.slice(i, i + 7);
    const weekLabel = `${slice[0].toLocaleDateString("en-GB", {
      month: "short",
      day: "2-digit",
    })} - ${slice[slice.length - 1].toLocaleDateString("en-GB", {
      month: "short",
      day: "2-digit",
    })}`;

    weeks.push({
      week: weekLabel,
      days: slice.map((date) => {
        const key = fmtKey(date);
        const info = fakeMap[key];
        return info ? { ...info, date } : { date };
      }),
    });
  }

  const out = [];
  for (const wk of weeks) {
    out.push({ _section: true, week: wk.week });
    out.push(...wk.days);
  }
  return out;
}

/* =======================
   Table Columns
   ======================= */
const columns = [
  {
    id: "empty",
    header: () => null,
    cell: () => null,
    size: 36,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      let d = row.original.date;
      if (!d || row.original._section) return "";
      if (typeof d === "string") d = new Date(d);
      return d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "policy",
    header: "Policy",
    cell: ({ row }) => (row.original.policy ? row.original.policy : "--"),
  },
  {
    accessorKey: "requestedOn",
    header: "Requested on",
    cell: ({ row }) => {
      const v = row.original.requestedOn;
      if (!v) return "--";
      const d = typeof v === "string" ? new Date(v) : v;
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "totalOvertime",
    header: "Total requested",
    cell: ({ row }) =>
      row.original.totalOvertime ? row.original.totalOvertime : "--",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      if (!s) return "--";
      const color =
        s === "Approved"
          ? "text-blue-600"
          : s === "Pending"
          ? "text-yellow-600"
          : "text-red-600";
      return <span className={`font-medium ${color}`}>{s}</span>;
    },
  },
  {
    accessorKey: "totalHour",
    header: "Total hour",
    cell: ({ row }) => (row.original.totalHour ? row.original.totalHour : "--"),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (row.original.note ? row.original.note : "--"),
  },
];

/* =======================
   Component
   ======================= */
export default function TimesheetTable() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 31),
    key: "selection",
  });
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (!showDatePicker) return;
    function handleClickOutside(e) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [showDatePicker]);

  const data = useMemo(() => getTimesheetRows(selectedRange), [selectedRange]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  return (
    // Make the ENTIRE screen horizontally scrollable when needed
    <div className="w-full overflow-x-auto">
      {/* Inner content gets a minimum width that matches table width,
          so the header bar and table scroll together */}
      <div className="bg-white rounded-xl shadow-md py-6 px-2 sm:px-6 border mt-5 mb-10 min-w-[980px]">
        {/* Single-row Top Bar: Title + Date Picker + Export (export sticks to far right) */}
        <div className="mb-3">
          <div className="flex items-center gap-3 w-full flex-nowrap">
            {/* Title (left) */}
            <div className="ml-2 font-custom text-xl font-semibold whitespace-nowrap">
              Request History
            </div>

            {/* Date Picker Button (middle) */}
            <div className="relative min-w-0">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center font-custom justify-between px-4 py-2 border rounded-full text-sm bg-white shadow-sm w-auto max-w-[60vw] truncate text-left"
              >
                <span className="truncate">
                  {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500 flex-shrink-0" />
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

            {/* Export (far right) */}
            <div className="ml-auto">
              <Select>
                <SelectTrigger className="w-28 font-custom rounded-full shrink-0">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent className="font-custom">
                  {exportOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="ml-2 mb-2 mt-2 flex flex-col sm:flex-row gap-4 text-base font-custom">
          <span>
            <span className="font-semibold text-black">Total Leaves:</span>{" "}
            {data.filter((r) => !r._section).length} day
          </span>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto ml-2">
          <Table className="min-w-[980px] w-full">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="bg-gray-100 text-gray-500 text-lg font-custom"
                >
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="whitespace-nowrap px-2 min-w-[70px] text-xs font-custom"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-400 font-custom"
                  >
                    No records for this date range.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) =>
                  row._section ? (
                    <tr key={`section-${row.week}`}>
                      <td
                        colSpan={columns.length}
                        className="bg-gray-100 text-gray-500 font-custom px-3 py-1 text-center font-semibold"
                      >
                        {row.week}
                      </td>
                    </tr>
                  ) : (
                    <TableRow key={i} className="hover:bg-white transition">
                      {table.getAllColumns().map((col) => (
                        <TableCell
                          key={col.id}
                          className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis px-2"
                        >
                          {flexRender(col.columnDef.cell, {
                            row: { original: row, index: i },
                          })}
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
    </div>
  );
}
