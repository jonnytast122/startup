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
    accessorKey: "leaveDate",
    header: "Leave Date",
    cell: ({ row }) => row.original.leaveDate || "--",
  },
  {
    accessorKey: "leavePolicy",
    header: "Leave Policy",
    cell: ({ row }) => row.original.leavePolicy || "--",
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
    cell: ({ row }) => {
      const type = row.original.leaveType || "paid";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold${
            type === "paid"
              ? "text-blue-500 bg-blue-100"
              : type === "unpaid"
                ? "text-red-500 bg-red-100"
                : "text-yellow-500 bg-yellow-100"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "totalLeave",
    header: "Total Leave",
    cell: ({ row }) => `${row.original.totalLeave} day(s)`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Pending";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold${
            status === "Approved"
              ? "text-blue-500 bg-blue-100"
              : status === "Rejected"
                ? "text-red-500 bg-red-100"
                : "text-yellow-500 bg-yellow-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "managerNote",
    header: "Manager Note",
    cell: ({ row }) => row.original.managerNote || "--",
  },
  {
    accessorKey: "actionBy",
    header: "Approved/Rejected By",
    cell: ({ row }) => row.original.actionBy || "--",
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => row.original.note || "--",
  },
  {
    accessorKey: "attachment",
    header: "Attachment",
    cell: ({ row }) => {
      const attachment = row.original.attachment;
      if (!attachment || attachment === "--") return "--";
      return (
        <a
          href={attachment}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          See Attachment
        </a>
      );
    },
  },
  {
    accessorKey: "requestedOn",
    header: "Requested On",
    cell: ({ row }) => row.original.requestedOn || "--",
  },
];

// 🔹 Transform API data into flat rows for table
function normalizeRequests(requests) {
  return requests.map((req) => {
    const totalLeaveRaw =
      req.totalLeaveBalance ?? req.totalLeave ?? req.totalLeaveDays ?? 0;
    const totalLeave = Number(totalLeaveRaw);

    const start = req.startDate ? new Date(req.startDate) : null;
    const end = req.endDate ? new Date(req.endDate) : null;
    const leaveDate =
      start && end
        ? `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`
        : "--";

    const status = req.status
      ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
      : "Pending";

    const actionBy =
      status === "Approved"
        ? req.approvedBy?.name || "--"
        : status === "Rejected"
          ? req.rejectedBy?.name || "--"
          : "--";

    return {
      leaveDate,
      leavePolicy: req.type?.name || "--",
      leaveType: req.type?.type || "paid",
      requestedOn: req.createdAt
        ? new Date(req.createdAt).toLocaleDateString("en-GB")
        : "--",
      totalLeave: Number.isFinite(totalLeave)
        ? Number(totalLeave.toFixed(2))
        : 0,
      status,
      managerNote: req.managerNote || req.response || "--",
      actionBy,
      note: req.note || "--",
      attachment: req.attachment || "--",
    };
  });
}

export default function TimesheetTable() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState(() => {
    const now = new Date();
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      endDate: now,
      key: "selection",
    };
  });
  const datePickerRef = useRef(null);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const startDateParam = selectedRange.startDate.toISOString().split("T")[0];
  const endDateParam = selectedRange.endDate.toISOString().split("T")[0];

  const { data: requestResponse, isLoading } = useQuery({
    queryKey: ["user-leave-requests", startDateParam, endDateParam],
    queryFn: () =>
      getMyRequests({
        startDate: startDateParam,
        endDate: endDateParam,
      }),
  });

  const requests = Array.isArray(requestResponse?.data)
    ? requestResponse.data
    : [];

  // 🔹 transform requests
  const data = useMemo(() => normalizeRequests(requests), [requests]);
  const totalLeaveUsed = Number(requestResponse?.summary?.approvedTotalLeave ?? 0);

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
      <div className="bg-white rounded-xl shadow-md py-6 px-2 sm:px-6 border mt-5 mb-10 min-w-full">
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
              {/* <Select>
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
              </Select> */}
            </div>
          </div>
        </div>

        <div className="ml-2 mb-2 mt-2 flex flex-col sm:flex-row gap-4 text-base font-custom">
          <span>
            <span className="font-semibold text-black">Total Leaves:</span>{" "}
            {Number.isInteger(totalLeaveUsed)
              ? totalLeaveUsed
              : totalLeaveUsed.toFixed(2)}{" "}
            day(s)
          </span>
        </div>

        <div className="w-full ml-2 overflow-y-auto">
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-400 font-custom"
                  >
                    Loading leave history...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
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
