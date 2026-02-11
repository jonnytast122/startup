"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatWorkHours } from "@/lib/helper/dateTimeConveter";
import { FaSpinner } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CalendarPlus2, Search, ChevronLeft, ChevronRight } from "lucide-react";

import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import AddOTDialog from "./components/addotdialog";
import UserProfileSection from "./components/user-profile-section";
import { DateRangePicker } from "react-date-range";

import { getOvertime } from "@/lib/api/adminOvertime";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

// Table columns definition
const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile; // Check if profile exists
      const initials = (row.original.fullname || "")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

      return (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-300">
          {profileExists ? (
            // Replace with an actual image if available
            <img
              src={row.original.profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500 font-custom">
              {initials}
            </span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "fullname", header: "Full name" },
  { accessorKey: "department", header: "Department" },
  {
    accessorKey: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5494DA] text-blue">
        {row.original.job}
      </div>
    ),
  },
  {
    accessorKey: "shiftType",
    header: "Shift Type",
    cell: ({ row }) => {
      const shiftType = row.original.shiftType || [];
      if (shiftType.length === 0) return "--";
      if (shiftType.length === 1) return shiftType[0].name;
      return `${shiftType.length} Shifts`;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.date || ""}</span>
    ),
  },
  { accessorKey: "otType", header: "OT Type" },
  {
    accessorKey: "otrequest",
    header: "OT Request",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.otrequest || "No request"}
      </span>
    ),
  },
  {
    accessorKey: "otassigned",
    header: "OT Assigned",
    cell: ({ row }) => (
      <span className="text-green-500 text-sm">
        {row.original.otassigned || "0 hours"}
      </span>
    ),
  },

  {
    accessorKey: "ottotal",
    header: "Total",
    cell: ({ row }) => {
      const value = row.original.ottotal;
      if (!value)
        return <span className="text-gray-500 text-sm">No total</span>;
      const [amountStr] = value.split(" ");
      const amount = parseFloat(amountStr);
      const color = amount > 25 ? "text-blue-500" : "text-red-500";
      return <span className={`${color} text-sm`}>{value}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "Request for overtime";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold${
            status === "approved"
              ? "text-blue-500 bg-blue-100"
              : status === "rejected"
                ? "text-red-500 bg-red-100"
                : "text-yellow-500 bg-yellow-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },

  { accessorKey: "description", header: "Note" },

  { accessorKey: "attachment", header: "Attachment" },
];

// Helpers
const calculateHours = (start, end) => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let hours = endH - startH + (endM - startM) / 60;
  if (hours < 0) hours += 24;
  return Number(hours.toFixed(2));
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Transform API data
const useTransformedOvertimeData = (apiData) => {
  return useMemo(() => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map((item) => {
      const startTime = item.startTime || "";
      const endTime = item.endTime || "";
      const hoursValue =
        typeof item.totalHours === "number"
          ? item.totalHours
          : startTime && endTime
            ? calculateHours(startTime, endTime)
            : 0;
      const hoursLabel = formatWorkHours(hoursValue || 0);
      const requestType = item.requestType || "request";

      return {
        employee: item.employee,
        profile: item.employee?.info?.profileImg || null,
        fullname: item.employee?.name || "--",
        department: item.employee?.info?.department?.name || "--",
        job: item.employee?.info?.job || "--",
        shiftType: Array.isArray(item.employee?.info?.shiftType)
          ? item.employee.info.shiftType
          : item.employee?.info?.shiftType
            ? [item.employee.info.shiftType]
            : [],
        otType: item.overtimeType?.name || "--",
        otrequest: requestType === "request" ? hoursLabel : "--",
        otassigned: requestType === "assigned" ? hoursLabel : "--",
        ottotal: hoursLabel,
        description: item.description || "Request for overtime",
        status: item.status || "Pending",
        date: item.date ? formatDate(item.date) : "",
      };
    });
  }, [apiData]);
};

const Overtime = () => {
  const [otData, setOtData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddOTDialog, setOpenAddOTDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState(() => {
    const now = new Date();
    return {
      startDate: now,
      endDate: now,
      key: "selection",
    };
  });

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { data: overtime, isLoading: isOvertimeLoading } = useQuery({
    queryKey: [
      "overtime",
      company?.id,
      selectedRange.startDate.toISOString(),
      selectedRange.endDate.toISOString(),
    ],
    queryFn: () =>
      getOvertime({
        startDate: selectedRange.startDate.toISOString().split("T")[0],
        endDate: selectedRange.endDate.toISOString().split("T")[0],
      }),
    enabled: !!company?.id,
  });

  const transformedOvertimeData = useTransformedOvertimeData(overtime?.data);

  const isTodayRange = useMemo(() => {
    const today = new Date();
    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    return (
      selectedRange.startDate &&
      selectedRange.endDate &&
      sameDay(selectedRange.startDate, today) &&
      sameDay(selectedRange.endDate, today)
    );
  }, [selectedRange.startDate, selectedRange.endDate]);

  // Merge API data into state (optional, if you want live update)
  React.useEffect(() => {
    setOtData(transformedOvertimeData || []);
  }, [transformedOvertimeData]);

  const filteredData = useMemo(() => {
    return otData.filter((item) =>
      `${item.fullname || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [otData, searchQuery, selectedRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // No manual invalidation needed; query key already includes the range.

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/overtime" className="block">
            <div className="flex items-center space-x-3">
              <CalendarPlus2
                className="text-[#2998FF]"
                width={40}
                height={40}
              />
              <span className="font-custom text-3xl text-black">Overtime</span>
            </div>
          </a>
          {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-custom">
            <span>
              Request OT Hours:{" "}
              <span className="text-blue-500 font-semibold">
                {overtime?.summary?.requestHours?.toFixed(2) || "0.00"}
              </span>
            </span>
            <span>
              Assigned OT Hours:{" "}
              <span className="text-blue-500 font-semibold">
                {overtime?.summary?.assignedHours?.toFixed(2) || "0.00"}
              </span>
            </span>
            <span>
              Total OT Hours:{" "}
              <span className="text-blue-500 font-semibold">
                {overtime?.summary?.totalHours?.toFixed(2) || "0.00"}
              </span>
            </span>
          </div> */}
          {/* <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>
            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 min-w-0">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${
                    badge.bg
                  } rounded-full flex items-center justify-center border-2 border-white text-xs sm:text-xs md:text-sm lg:text-md font-bold ${
                    badge.textColor || "text-white"
                  }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            <SettingDialog />
          </div> */}
        </div>
      </div>

      {/* Employee Profile or Table */}
      {selectedEmployee ? (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : (
        <div className="p-4 bg-white rounded-xl mb-3 shadow-md py-6 px-6 border font-custom">
          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
            <div className="flex w-full sm:w-auto gap-4">
              {/* <Select>
                <SelectTrigger className="w-fit px-3 font-custom rounded-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="w-fit font-custom">
                  {ALL.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              {/* Date Picker */}
              <div className="flex items-center relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
                >
                  <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
                  {`${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`}
                  <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
                </button>
                {showDatePicker && (
                  <div className="absolute font-custom z-10 mt-2 bg-white shadow-lg border p-2 rounded-md">
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
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  const today = new Date();
                  setSelectedRange({
                    startDate: today,
                    endDate: today,
                    key: "selection",
                  });
                }}
                className="font-custom rounded-full border border-gray-400 flex items-center justify-between w-auto h-9 text-white"
              >
                Today
              </Button>
            </div>

            <div className="flex w-full sm:w-auto gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  className="font-custom w-full pl-10 text-sm border rounded-lg focus:outline-none focus:ring-1 font-custom focus:ring-blue-500 pr-12 py-2 px-3"
                  placeholder="Search..."
                />
              </div>

              <PendingDialog />
              <Button
                onClick={() => setOpenAddOTDialog(true)}
                variant="outline"
                className="rounded-full border border-gray-400 flex items-center justify-between font-custom w-auto h-9 text-blue-500"
              >
                Add OT
              </Button>

              <AddOTDialog
                open={openAddOTDialog}
                onOpenChange={setOpenAddOTDialog}
              />

              <Select>
                <SelectTrigger className="w-24 font-custom rounded-full">
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

          {/* Table */}
          {isOvertimeLoading ? (
            <div className="flex items-center justify-center w-full h-full py-10">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-300 mt-4 text-xl font-custom">
              {isTodayRange ? "No overtime today" : "No Data Available"}
            </p>
          ) : (
            <div className="rounded-md border mt-6 overflow-y-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="bg-gray-200 text-dark-blue"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-md text-center"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => setSelectedEmployee(row.original)}
                      className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => {
                        if (cell.column.id === "shiftType") {
                          const shiftTypes = Array.isArray(
                            row.original.shiftType,
                          )
                            ? row.original.shiftType
                            : row.original.shiftType
                              ? [row.original.shiftType]
                              : [];
                          let cellContent;

                          if (shiftTypes.length === 0) cellContent = "--";
                          else if (shiftTypes.length === 1)
                            cellContent = shiftTypes[0].name;
                          else
                            cellContent = (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-blue-600 cursor-pointer font-custom bg-gray-100 px-2 py-1 rounded-full">
                                      {shiftTypes.length} Shifts
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    align="start"
                                    className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-1"
                                  >
                                    <div className="whitespace-pre-wrap font-custom">
                                      <h1 className="font-bold text-xl">
                                        Shift Types
                                      </h1>
                                      <br />
                                      {shiftTypes.map((g) => (
                                        <span
                                          key={g.id || g.name}
                                          className="block bg-gray-100 px-2 py-1 rounded-full mb-1 font-custom text-center"
                                        >
                                          {g.name}
                                        </span>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );

                          return (
                            <TableCell
                              key={cell.id}
                              className="whitespace-nowrap overflow-hidden text-ellipsis text-center items-center"
                            >
                              {cellContent}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={cell.id}
                            className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="font-custom text-gray-400">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overtime;
