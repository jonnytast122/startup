<<<<<<< HEAD
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  CalendarPlus2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, isWithinInterval, parseISO } from "date-fns";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const archeive = [
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    department: "Marketing",
    job: "Account",
    shifttype: "Schedule",
    timeoff: "10.00 hours",
    sickleave: "00.00 hours",
    unpaidleave: "00.00 hours",
    date: "2025-03-12", // Example date
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Smith",
    department: "HR",
    job: "Manager",
    shifttype: "Schedule",
    timeoff: "-5.00 hours",
    sickleave: "02.00 hours",
    unpaidleave: "00.00 hours",
    date: "2025-03-20",
  },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile; // Check if profile exists
      const firstNameInitial = row.original.firstname.charAt(0).toUpperCase();
      const lastNameInitial = row.original.lastname.charAt(0).toUpperCase();

      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300">
          {profileExists ? (
            // Replace with an actual image if available
            <img
              src={row.original.profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">
              {firstNameInitial}
              {lastNameInitial}
            </span>
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
    accessorKey: "timeoff",
    header: "Time Off",
    cell: ({ row }) => {
      const value = row.original.timeoff; // Example: "10.00 hours"

      // Extract number and unit separately
      const match = value.match(/(-?\d+\.\d+)\s*(\w+)/);
      if (!match) return value; // Return as is if no match

      const numberPart = match[1]; // "10.00" or "-10.00"
      const unitPart = match[2]; // "hours"

      // Apply conditional color to both number and text
      const textColor =
        parseFloat(numberPart) >= 0 ? "text-blue-500" : "text-red-500";

      return (
        <span className={textColor}>
          {numberPart} {unitPart}
        </span>
      );
    },
  },
  {
    accessorKey: "sickleave",
    header: "Sick Leave",
    cell: ({ row }) => {
      const value = row.original.sickleave; // Example: "10.00 hours"

      // Extract number and unit separately
      const match = value.match(/(-?\d+\.\d+)\s*(\w+)/);
      if (!match) return value; // Return as is if no match

      const numberPart = match[1]; // "10.00" or "-10.00"
      const unitPart = match[2]; // "hours"

      // Default to green, change if positive/negative
      let textColor = "text-green";
      if (parseFloat(numberPart) > 0) textColor = "text-blue-500";
      if (parseFloat(numberPart) < 0) textColor = "text-red-500";

      return (
        <span className={textColor}>
          {numberPart} {unitPart}
        </span>
      );
    },
  },
  {
    accessorKey: "unpaidleave",
    header: "Unpaid Leave",
    cell: ({ row }) => {
      const value = row.original.sickleave; // Example: "10.00 hours"

      // Extract number and unit separately
      const match = value.match(/(-?\d+\.\d+)\s*(\w+)/);
      if (!match) return value; // Return as is if no match

      const numberPart = match[1]; // "10.00" or "-10.00"
      const unitPart = match[2]; // "hours"

      // Default to green, change if positive/negative
      let textColor = "text-red";
      if (parseFloat(numberPart) > 0) textColor = "text-blue-500";
      if (parseFloat(numberPart) < 0) textColor = "text-red-500";

      return (
        <span className={textColor}>
          {numberPart} {unitPart}
        </span>
      );
    },
  },
];

const Leaves = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 30),
    key: "selection",
  });

  const datePickerRef = useRef(null);

  // Close date picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false); // Close the date picker if click is outside
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredData = useMemo(() => {
    return archeive.filter((item) => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, {
        start: selectedRange.startDate,
        end: selectedRange.endDate,
      });
    });
  }, [selectedRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <CalendarPlus2 className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Leaves</span>
          </div>

          {/* Asset Admins (Moved before badges) */}
          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            {/* Overlapping Circular Badges */}
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
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          {/* Left Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
              <SelectTrigger className="w-16 font-custom rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="w-16 font-custom">
                {ALL.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom p-3"
            >
              <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
              {format(selectedRange.startDate, "MMM dd")} -{" "}
              {format(selectedRange.endDate, "MMM dd")}
              <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
            </button>

            {showDatePicker && (
              <div ref={datePickerRef} className="absolute mt-2 bg-white shadow-lg border p-2 rounded-md z-50 font-custom">
                <DateRange
                  ranges={[selectedRange]}
                  onChange={(ranges) => setSelectedRange(ranges.selection)}
                  rangeColors={["#3b82f6"]}
                />
              </div>
            )}
          </div>
          {/* Right Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
            <PendingDialog />

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
          <p className="text-center text-gray-300 mt-4 text-xl font-custom">No Data Available</p>
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
                  <TableRow key={row.id}>
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
    </div>
  );
};

export default Leaves;
=======
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
import { LogIn, Search, ChevronDown } from "lucide-react";
import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AddLeaveDialog from "./components/addleavedialog";
import UserProfileSection from "./components/user-profile-section";
import { DateRangePicker } from "react-date-range";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile; // Check if profile exists
      const firstNameInitial = row.original.firstname.charAt(0).toUpperCase();
      const lastNameInitial = row.original.lastname.charAt(0).toUpperCase();

      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300">
          {profileExists ? (
            // Replace with an actual image if available
            <img
              src={row.original.profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500">
              {firstNameInitial}
              {lastNameInitial}
            </span>
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
    accessorKey: "annualleave",
    header: "Annual Leaves",
    cell: ({ row }) => {
      const value = row.original.annualleave; // Format: "2.5 / 15 days"
      return value;
    },
  },
  {
    accessorKey: "sickleave",
    header: "Sick Leave",
    cell: ({ row }) => {
      const value = row.original.sickleave; // Expected format: "1.5 / 15 days"
      const match = value.match(/([\d.]+)\s*\/\s*([\d.]+)\s*(\w+)/);

      if (!match) return value;

      const [used, total, unit] = match.slice(1);
      const percentUsed = (parseFloat(used) / parseFloat(total)) * 100;

      const textColor =
        percentUsed > 75
          ? "text-red-500"
          : percentUsed > 50
            ? "text-orange-500"
            : "text-blue-500";

      return (
        <span className={textColor}>
          {used} / {total} {unit}
        </span>
      );
    },
  },
  {
    accessorKey: "unpaidleave",
    header: "Unpaid Leave",
    cell: ({ row }) => {
      const value = row.original.unpaidleave; // Expected format: "0 / Unlimited"
      const match = value.match(/([\d.]+)\s*\/\s*(\w+)/);

      if (!match) return value;

      const [used, total] = match.slice(1);

      const textColor =
        parseFloat(used) > 0 ? "text-orange-500" : "text-red-500";

      return (
        <span className={textColor}>
          {used} / {total}
        </span>
      );
    },
  },
  {
    accessorKey: "assignleave",
    header: "Assigned Leaves",
    cell: ({ row }) => {
      const value = row.original.assignleave;
      return value;
    },
  },
  {
    accessorKey: "onleavestatus",
    header: "On Leave Status",
    cell: ({ row }) => {
      const status = row.original.onleavestatus?.annual || "Pending";

      return (
        <div className="flex items-center space-x-6 text-sm">
          <span className="text-gray-800">Annual Leave</span>
          <span
            className={`font-medium ${status === "Approved"
              ? "text-blue-500"
              : status === "Declined"
                ? "text-red-500"
                : "text-gray-500"
              }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
];

const Leaves = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddLeaveDialog, setOpenAddLeaveDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 31),
    key: "selection",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [leaveData, setLeaveData] = useState([
    {
      profile: "/avatars/ralph.png",
      firstname: "John",
      lastname: "Doe",
      department: "Marketing",
      job: "Account",
      shifttype: "Schedule",
      annualleave: "2.5 / 15 days",
      sickleave: "2.5 / 15 days",
      assignleave: "",
      unpaidleave: "0 / Unlimited",
      onleavestatus: { annual: "Declined", sick: "Approved" },
      date: "2025-03-12",
    },
    {
      profile: "/avatars/ralph.png",
      firstname: "Jane",
      lastname: "Smith",
      department: "HR",
      job: "Manager",
      shifttype: "Schedule",
      annualleave: "2.5 / 15 days",
      sickleave: "2.5 / 15 days",
      assignleave: "",
      unpaidleave: "0 / Unlimited",
      onleavestatus: { annual: "Declined", sick: "Approved" },
      date: "2025-03-20",
    },
  ]);
  const filteredData = useMemo(() => {
    return leaveData.filter((item) => {
      const matchesSearch = `${item.firstname} ${item.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, leaveData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          {/* Title Section */}
          <a href="/overview/leaves" className="block">
            <div className="flex items-center space-x-3">
              <LogIn className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Leaves</span>
            </div>
          </a>

          {/* Asset Admins (Moved before badges) */}
          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            {/* Overlapping Circular Badges */}
            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 sm:-space-x-4 min-w-0">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${badge.bg
                    } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${badge.textColor || "text-white"
                    }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            <SettingDialog />
          </div>
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

                        // ✅ Only close if both dates are selected and not the same
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
                    placeholder="Search by name"
                    className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onConfirm={(newLeave) => {
                    setLeaveData((prev) => [...prev, newLeave]);
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
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
>>>>>>> d8c38a63385556dd479c08931b9c55ec7f45827c
