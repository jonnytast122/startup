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
import { LogIn, Search } from "lucide-react";
import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AddLeaveDialog from "./components/addleavedialog";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const data = [
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
    unpaidleave: "00.00 hours",
    unpaidleave: "0 / Unlimited",
    onleavestatus: {
      annual: "Declined",
      sick: "Approved",
    },
    date: "2025-03-12", // Example date
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
    unpaidleave: "00.00 hours",
    unpaidleave: "0 / Unlimited",
    onleavestatus: {
      annual: "Declined",
      sick: "Approved",
    },
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
        </div>
      );
    },
  },
];

const Leaves = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddLeaveDialog, setOpenAddLeaveDialog] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = `${item.firstname} ${item.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

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
            <LogIn className="text-[#2998FF]" width={40} height={40} />
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
              onConfirm={(data) => {
                console.log("Confirmed OT payload:", data);
                // You can push it to state, call API, etc.
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
