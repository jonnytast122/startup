"use client";

import React, { useState, useMemo } from "react";
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
import { AlarmClock, Search, ChevronDown } from "lucide-react";
import SettingDialog from "./components/settingdialog";
import PendingDialog from "./components/pendingdialog";
import AddOTDialog from "./components/addotdialog";
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

const data = [
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    department: "Marketing",
    job: "Account",
    shifttype: "Schedule",
    otrequest: "3 hours",
    otassigned: "2 hours",
    ottotal: "5 hours",
    onleavestatus: {
      annual: "Approved",
      sick: "Approved",
    },
    date: "2025-03-12",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Smith",
    department: "HR",
    job: "Manager",
    shifttype: "Schedule",
    otrequest: "2 hours",
    otassigned: "1.5 hours",
    ottotal: "3.5 hours",
    onleavestatus: {
      annual: "Declined",
      sick: "Approved",
    },
    date: "2025-03-20",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Alex",
    lastname: "Chan",
    department: "IT",
    job: "Engineer",
    shifttype: "Flexible",
    otrequest: "4 hours",
    otassigned: "4 hours",
    ottotal: "8 hours",
    onleavestatus: {
      annual: "Declined",
      sick: "Approved",
    },
    date: "2025-03-22",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Sokha",
    lastname: "Lim",
    department: "Operations",
    job: "Supervisor",
    shifttype: "Night",
    otrequest: "",
    otassigned: "",
    ottotal: "",
    onleavestatus: {
      annual: "Declined",
      sick: "Approved",
    },
    date: "2025-03-25",
  },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile;
      const firstNameInitial = row.original.firstname.charAt(0).toUpperCase();
      const lastNameInitial = row.original.lastname.charAt(0).toUpperCase();
      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300">
          {profileExists ? (
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
    accessorKey: "otrequest",
    header: "OT Request",
    cell: ({ row }) => {
      const value = row.original.otrequest; // Format: "2.5 / 15 days"
      return (
        <span className="text-sm text-gray-600">
          {value ? value : "No request"}
        </span>
      );
    },
  },
  {
    accessorKey: "otassigned",
    header: "OT Assigned",
    cell: ({ row }) => {
      const value = row.original.otassigned;
      return (
        <span className="text-green-500 text-sm">
          {value ? value : "0 hours"}
        </span>
      );
    },
  },
  {
    accessorKey: "ottotal",
    header: "OT Total",
    cell: ({ row }) => {
      const value = row.original.ottotal; // Example: "28 hours"
      if (!value)
        return <span className="text-gray-500 text-sm">No total</span>;

      const [amountStr] = value.split(" ");
      const amount = parseFloat(amountStr);
      const color = amount > 25 ? "text-blue-500" : "text-red-500";

      return <span className={`${color} text-sm`}>{value}</span>;
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

const Overtime = () => {
    const [otData, setOtData] = useState([...data]); // ✅ OK here

  const [searchQuery, setSearchQuery] = useState("");
  const [openAddOTDialog, setOpenAddOTDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 31),
    key: "selection",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const filteredData = useMemo(() => {
    return otData.filter((item) => {
      const matchesSearch = `${item.firstname} ${item.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, otData]);

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
              <AlarmClock className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Overtime</span>
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
                  className="flex items-center justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm"
                >
                  {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 bg-white shadow-lg border p-2 rounded-md">
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
                >
                  Today
                </Button>
              </div>

              <div className="flex w-full sm:w-auto gap-4">
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

    const jobTypes = ["Accountant", "Engineer", "Supervisor", "Manager"];
    const departments = ["HR", "IT", "Marketing", "Operations"];
    const shiftTypes = ["Schedule", "Flexible", "Night"];

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const newRows = data.users.map((user) => ({
      profile: "/avatars/ralph.png", // default avatar
      firstname: user.name.split(" ")[0],
      lastname: user.name.split(" ")[1] || "",
      job: randomFrom(jobTypes),
      department: randomFrom(departments),
      shifttype: randomFrom(shiftTypes),
      otrequest: `${data.hours} hours`,
      otassigned: `${(parseFloat(data.hours) / 2).toFixed(1)} hours`,
      ottotal: `${data.hours} hours`,
      onleavestatus: {
        annual: "Pending",
        sick: "Approved",
      },
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

export default Overtime;
