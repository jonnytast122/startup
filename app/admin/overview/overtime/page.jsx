"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

import { CalendarPlus2, Search, ChevronDown } from "lucide-react";

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
      const profile = row.original.profile;
      const initials = `${row.original.firstname?.charAt(0) || ""}${
        row.original.lastname?.charAt(0) || ""
      }`;
      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300">
          {profile ? (
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">{initials}</span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "firstname", header: "First name" },
  { accessorKey: "lastname", header: "Last name" },
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
  { accessorKey: "shifttype", header: "Shift Type" },
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
    header: "OT Total",
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
          className={`font-medium ${
            status === "Approved"
              ? "text-blue-500"
              : status === "Declined"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Note",
    cell: ({ row }) => {
      const status = row.original.status || "Request for overtime";
      const description = row.original.description || "";
      return (
        <div className="flex items-center space-x-6 text-sm">
          <span className="text-gray-800">{description}</span>
        </div>
      );
    },
  },
];

// Helpers
const calculateHours = (start, end) => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let hours = endH - startH + (endM - startM) / 60;
  if (hours < 0) hours += 24;
  return hours;
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
      const otHours =
        startTime && endTime
          ? `${calculateHours(startTime, endTime)} hours`
          : "";

      return {
        employee: item.employee,
        profile: item.employee?.profile || "/avatars/ralph.png",
        firstname: item.employee?.name?.split(" ")[0] || "",
        lastname: item.employee?.name?.split(" ")[1] || "",
        department: item.department || "N/A",
        job: item.overtimeType?.name || "N/A",
        shifttype: item.shifttype || "Schedule",
        otrequest: otHours,
        otassigned: otHours,
        ottotal: otHours,
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
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 10, 25),
    key: "selection",
  });

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { data: overtime } = useQuery({
    queryKey: ["overtime", company?.id, selectedRange],
    queryFn: () =>
      getOvertime({
        startDate: selectedRange.startDate.toISOString().split("T")[0],
        endDate: selectedRange.endDate.toISOString().split("T")[0],
      }),
    enabled: !!company?.id,
  });

  const transformedOvertimeData = useTransformedOvertimeData(overtime);

  // Merge API data into state (optional, if you want live update)
  React.useEffect(() => {
    if (transformedOvertimeData.length) {
      setOtData(transformedOvertimeData);
    }
  }, [transformedOvertimeData]);

  const filteredData = useMemo(() => {
    return otData.filter((item) =>
      `${item.firstname} ${item.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [otData, searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

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
        <div className="p-4 bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
            <div className="flex w-full sm:w-auto gap-4">
              <Select>
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
              </Select>

              {/* Date Picker */}
              <div className="flex items-center relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center font-custom justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm"
                >
                  {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
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
              <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onConfirm={(data) => {
                  const randomFrom = (arr) =>
                    arr[Math.floor(Math.random() * arr.length)];
                  const jobTypes = [
                    "Accountant",
                    "Engineer",
                    "Supervisor",
                    "Manager",
                  ];
                  const departments = ["HR", "IT", "Marketing", "Operations"];
                  const shiftTypes = ["Schedule", "Flexible", "Night"];
                  const todayStr = new Date().toISOString().split("T")[0];

                  const newRows = data.users.map((user) => ({
                    profile: "/avatars/ralph.png",
                    firstname: user.name.split(" ")[0],
                    lastname: user.name.split(" ")[1] || "",
                    job: randomFrom(jobTypes),
                    department: randomFrom(departments),
                    shifttype: randomFrom(shiftTypes),
                    otrequest: `${data.hours} hours`,
                    otassigned: `${(parseFloat(data.hours) / 2).toFixed(
                      1
                    )} hours`,
                    ottotal: `${data.hours} hours`,
                    onleavestatus: { annual: "Pending", sick: "Approved" },
                    date: data.date
                      ? new Date(data.date).toISOString().split("T")[0]
                      : todayStr,
                  }));

                  setOtData((prev) => [...prev, ...newRows]);
                }}
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
          {filteredData.length === 0 ? (
            <p className="text-center text-gray-300 mt-4 text-xl font-custom">
              No Data Available
            </p>
          ) : (
            <div className="rounded-md border mt-6">
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
                          className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-xs"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
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
