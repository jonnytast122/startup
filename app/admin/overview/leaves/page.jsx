"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
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
import {
  LogIn,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AddLeaveDialog from "./components/addleavedialog";
import UserProfileSection from "./components/user-profile-section";
import { DateRangePicker } from "react-date-range";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeave } from "@/lib/api/adminLeave";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const identityColumns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile;
      const initials = (row.original.fullname || "")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

      return (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-300">
          {profileExists ? (
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
];

const leaveInfoColumns = [
  {
    accessorKey: "dates",
    header: "Leave Dates",
    cell: ({ row }) => {
      const startDate = formatDate(row.original.startDate);
      const endDate = formatDate(row.original.endDate);
      return `${startDate} - ${endDate}`;
    },
  },
  {
    accessorKey: "policy",
    header: "Leave Policy",
    cell: ({ row }) => (
      <div className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-red text-red-500">
        {row.original.type?.name || "--"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Leave Type",
    cell: ({ row }) => {
      const type = row.original.type?.type || "paid";
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
    accessorKey: "totalLeaveBalance",
    header: "Total Leave Balance",
    cell: ({ row }) => {
      const balance =
        row.original.totalLeaveBalance ??
        row.original.totalLeave ??
        row.original.totalLeaveDays ??
        0;
      return (
        <span className="x-2 py-0.5 px-2 rounded-lg text-xs font-semibold text-red-500 bg-red-100">
          {balance}
        </span>
      );
    },
  },
  {
    accessorKey: "onleavestatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
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
  {
    accessorKey: "managerNote",
    header: "Manager Note",
    cell: ({ row }) =>
      row.original.managerNote || row.original.response || "--",
  },
  {
    accessorKey: "actionBy",
    header: "Approved/Rejected By",
    cell: ({ row }) => {
      const status = String(row.original.status || "").toLowerCase();
      if (status === "approved") return row.original.approvedBy?.name || "--";
      if (status === "rejected") return row.original.rejectedBy?.name || "--";
      return "--";
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "attachment",
    header: "Attachment",
    cell: ({ row }) => {
      const attachment = row.original.attachment;
      if (!attachment) return "--";
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{attachment}</span>
        </div>
      );
    },
  },
];

const Leaves = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddLeaveDialog, setOpenAddLeaveDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState(() => {
    const today = new Date();
    return {
      startDate: today,
      endDate: today,
      key: "selection",
    };
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const queryClient = useQueryClient();

  // Fetch leave data from API
  const startDateParam = selectedRange.startDate.toISOString().split("T")[0];
  const endDateParam = selectedRange.endDate.toISOString().split("T")[0];

  const {
    data: leaveResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leave", startDateParam, endDateParam],
    queryFn: () =>
      getLeave({
        startDate: startDateParam,
        endDate: endDateParam,
      }),
    enabled: !!selectedRange.startDate && !!selectedRange.endDate,
  });

  const leavePolicies = Array.isArray(leaveResponse?.meta?.leavePolicies)
    ? leaveResponse.meta.leavePolicies
    : [];

  console.log("Leave Response:", leaveResponse);
  // Transform API data to match table format
  const leaveData = useMemo(() => {
    const leaveRows = Array.isArray(leaveResponse?.data)
      ? leaveResponse.data
      : [];
    if (leaveRows.length === 0) return [];

    return leaveRows.map((leave) => ({
      ...leave,
      fullname: leave.employee?.name || "--",
      department: leave.employee?.info?.department?.name || "--",
      job: leave.employee?.info?.job || "--",
      profile: leave.employee?.info?.profileImg || null,
      shiftType: Array.isArray(leave.employee?.info?.shiftType)
        ? leave.employee.info.shiftType
        : leave.employee?.info?.shiftType
          ? [leave.employee.info.shiftType]
          : [],
      policyBalances: leave.policyBalances || {},
    }));
  }, [leaveResponse]);

  const dynamicPolicyColumns = useMemo(
    () =>
      leavePolicies.map((policy) => ({
        id: `policy-${policy.id}`,
        header: policy.name,
        cell: ({ row }) => {
          const balance = row.original.policyBalances?.[policy.id];
          if (!balance) return "--";
          return `${balance.used ?? 0} / ${balance.total ?? 0} days`;
        },
      })),
    [leavePolicies],
  );

  const tableColumns = useMemo(() => {
    const balanceColumns =
      dynamicPolicyColumns.length > 0
        ? dynamicPolicyColumns
        : [
            {
              id: "no-policy-balance",
              header: "No Policy",
              cell: () => "--",
            },
          ];

    return [
      ...identityColumns,
      {
        id: "leaveInfoGroup",
        header: "Leave Info",
        columns: leaveInfoColumns,
      },
      {
        id: "leaveBalanceInfoGroup",
        header: "Leave Balance Info",
        columns: balanceColumns,
      },
    ];
  }, [dynamicPolicyColumns]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return leaveData.filter((item) => {
      const employeeName = item.fullname || "";
      const matchesSearch = employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, leaveData, selectedRange]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const datePickerRef = useRef(null);

  // Close date picker when clicking outside
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full py-10">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-custom text-red-500">
          Error loading leave data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border font-custom">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/overview/leaves" className="block">
            <div className="flex items-center space-x-3">
              <LogIn className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Leaves</span>
            </div>
          </a>

          {/* Asset Admins (Moved before badges) */}
          {/* <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 sm:-space-x-4 min-w-0">
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
                  } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${
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

      {selectedEmployee ? (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : (
        <>
          <div className="p-4 bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              {/* Left Side Dropdowns */}
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
                          if (
                            start &&
                            end &&
                            start.getTime() !== end.getTime()
                          ) {
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

              {/* Right Side Dropdowns */}
              <div className="flex w-full sm:w-auto gap-4">
                {/* Search Input */}

                <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
                  <Search className="absolute left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="font-custom w-full pl-10 text-sm border rounded-lg focus:outline-none focus:ring-1 font-custom focus:ring-blue-500 pr-12 py-2 px-3"
                    placeholder="Search..."
                  />
                </div>

                <PendingDialog />

                <Button
                  onClick={() => setOpenAddLeaveDialog(true)}
                  variant="outline"
                  className="rounded-full border border-gray-400 flex items-center justify-between font-custom w-auto h-9 text-blue-500"
                >
                  Add Leave
                </Button>
                <AddLeaveDialog
                  open={openAddLeaveDialog}
                  onOpenChange={setOpenAddLeaveDialog}
                  onConfirm={(newLeave) => {}}
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

            {filteredData.length === 0 ? (
              <p className="text-center text-gray-300 mt-4 text-xl font-custom">
                No Leave Data Available
              </p>
            ) : (
              <div className="rounded-md border mt-6 overflow-y-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="text-dark-blue font-custom "
                      >
                        {headerGroup.headers.map((header) => {
                          const parentId = header.column.parent?.id;
                          const isLeaveInfo =
                            header.column.id === "leaveInfoGroup" ||
                            parentId === "leaveInfoGroup";
                          const isLeaveBalanceInfo =
                            header.column.id === "leaveBalanceInfoGroup" ||
                            parentId === "leaveBalanceInfoGroup";

                          const sectionBgClass = isLeaveInfo
                            ? "bg-yellow-100"
                            : isLeaveBalanceInfo
                              ? "bg-blue-100"
                              : "bg-gray-200";
                          const isLeaveBalanceColumn =
                            header.column.id?.startsWith("policy-") ||
                            header.column.id === "no-policy-balance" ||
                            header.column.parent?.id ===
                              "leaveBalanceInfoGroup";
                          const widthClass = isLeaveBalanceColumn
                            ? "min-w-[180px]"
                            : "min-w-[50px]";

                          return (
                            <TableHead
                              key={header.id}
                              colSpan={header.colSpan}
                              className={`whitespace-nowrap px-2 ${widthClass} text-md text-center ${sectionBgClass}`}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => setSelectedEmployee(row.original)}
                        className="items-center font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis text-center cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => {
                          if (cell.column.id === "shiftType") {
                            const shiftType = Array.isArray(
                              row.original.shiftType,
                            )
                              ? row.original.shiftType
                              : [];

                            let cellContent;
                            if (shiftType.length === 0) {
                              cellContent = "--";
                            } else if (shiftType.length === 1) {
                              cellContent = shiftType[0]?.name || "--";
                            } else {
                              cellContent = (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-blue-600 cursor-pointer font-custom bg-gray-100 px-2 py-1 rounded-full">
                                        {shiftType.length} Shift Type
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="bottom"
                                      align="start"
                                      className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-1"
                                    >
                                      <div className="whitespace-pre-wrap font-custom">
                                        <p className="text-xl mb-2">
                                          Shift Type
                                        </p>
                                        {shiftType.map((g) => (
                                          <span
                                            key={g?._id || g?.id || g?.name}
                                            className="block bg-gray-100 px-2 py-1 rounded-full mb-1 font-custom text-center"
                                          >
                                            {g?.name || "--"}
                                          </span>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            }

                            return (
                              <TableCell
                                key={cell.id}
                                className="whitespace-nowrap overflow-hidden text-ellipsis text-center items-center"
                              >
                                {cellContent}
                              </TableCell>
                            );
                          }

                          const isLeaveBalanceCell =
                            cell.column.id?.startsWith("policy-") ||
                            cell.column.id === "no-policy-balance";

                          return (
                            <TableCell
                              key={cell.id}
                              className={`font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis ${
                                isLeaveBalanceCell ? "min-w-[180px]" : ""
                              }`}
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
        </>
      )}
    </div>
  );
};

export default Leaves;
