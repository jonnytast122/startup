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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { getMyRequests } from "@/lib/api/userLeave";
import { useQuery } from "@tanstack/react-query";

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
      if (!d) return "--";
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
        s.toLowerCase() === "approved"
          ? "text-blue-600"
          : s.toLowerCase() === "pending"
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

// 🔹 Transform API data into flat rows for table
function normalizeRequests(requests) {
  return requests.flatMap((req) =>
    req.dateTime.map((dt) => {
      const start = new Date(dt.start_time);
      const end = new Date(dt.end_time);
      const diffHrs = Math.floor((end - start) / (1000 * 60 * 60));
      const diffMin = Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60));

      return {
        date: dt.start_time,
        policy: req.type?.name || "--",
        requestedOn: req.createdAt,
        totalOvertime: "--", // adjust if you track OT separately
        status: req.status
          ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
          : "--",
        totalHour: `${String(diffHrs).padStart(2, "0")}:${String(
          diffMin
        ).padStart(2, "0")}`,
        note: req.note || "--",
      };
    })
  );
}

export default function TimesheetTable() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 31),
    key: "selection",
  });
  const datePickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { data: requests = [] } = useQuery({
    queryKey: ["user-leave-requests"],
    queryFn: getMyRequests,
  });

  // 🔹 transform requests
  const data = useMemo(() => normalizeRequests(requests), [requests]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  useEffect(() => {
    if (showDatePicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640; // sm breakpoint

      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: isMobile
          ? window.innerWidth / 2
          : rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [showDatePicker]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white rounded-xl shadow-md py-6 px-2 sm:px-6 border mt-5 mb-10 min-w-[800px]">
        <div className="mb-3">
          <div className="flex items-center gap-3 w-full flex-nowrap">
            <div className="ml-2 font-custom text-xl font-semibold whitespace-nowrap">
              Request History
            </div>

            <div className="relative min-w-0">
              <button
                ref={buttonRef}
                onClick={() => setShowDatePicker((v) => !v)}
                className="flex items-center font-custom justify-between px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm w-auto max-w-[60vw] truncate text-left"
                title={`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
              >
                <ChevronLeft className="inline-block w-4 h-4 mb-0.5 mr-3" />
                <span className="truncate">
                  {format(selectedRange.startDate, "MMM dd")} -{" "}
                  {format(selectedRange.endDate, "MMM dd")}
                </span>
                <ChevronRight className="inline-block w-4 h-4 mb-0.5 ml-3" />
              </button>

              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="fixed -translate-x-1/2 bg-white shadow-2xl border p-2 rounded-md z-[9999]"
                  style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                  }}
                >
                  <DateRange
                    ranges={[selectedRange]}
                    onChange={(ranges) => {
                      const newRange = ranges.selection;
                      setSelectedRange(newRange);
                    }}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#3b82f6"]}
                    showDateDisplay={false}
                    showPreview={false}
                    months={1}
                    direction="horizontal"
                  />
                </div>
              )}
            </div>

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

        <div className="ml-2 mb-2 mt-2 flex flex-col sm:flex-row gap-4 text-base font-custom">
          <span>
            <span className="font-semibold text-black">Total Leaves:</span>{" "}
            {data.length} day
          </span>
        </div>

        <div className="w-full ml-2">
          <Table className="min-w-[750px] w-full">
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
                data.map((row, i) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
