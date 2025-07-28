<<<<<<< HEAD
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import SettingDialog from "./components/settingdialog";
import AddShiftDialog from "./components/addshiftdialog";
import AddMultipleShiftsDialog from "./components/addmultipleshiftsdialog";
import AddTimeOffDialog from "./components/addtimeoffdialog";
import ClearWeekDialog from "./components/clearweekdialog";
import PendingDialog from "./components/pendingdialog";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const Overtime = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 16),
    key: "selection",
  });

  const datePickerRef = useRef(null);

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

  const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const dateColumns = getDatesInRange(selectedRange.startDate, selectedRange.endDate);

  const columns = [
    {
      accessorKey: "member",
      header: (
        <div className="flex justify-center p-2">
          <Select>
            <SelectTrigger className="w-40 font-custom rounded-full text-center">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {ALL.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    ...dateColumns.map((date) => {
      const label = `${format(date, "EEE")} ${format(date, "dd/MM")}`;
      const key = format(date, "yyyy-MM-dd");
      return {
        accessorKey: key,
        header: (
          <div>
            <div className="mt-2">{label}</div>
            <div className="text-xs text-black leading-tight p-2">
              <div>Duration: 8:00</div>
              <div>Shift: 0</div>
              <div>Employee: 0</div>
            </div>
          </div>
        ),
        cell: ({ row }) => {
          const cellData = row.original.schedule?.[key];
          return (
            <div className="p-2 text-sm text-gray-500">
              {cellData ? (
                <>
                  <div className="font-medium">{cellData.title}</div>
                  <div className="text-xs text-gray-400">{cellData.time}</div>
                </>
              ) : (
                <button
                  onClick={() => setShowAddShiftDialog(true)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          );
        },
      };
    })
  ];

  const members = [
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Cashier",
      shift: "2",
      duration: "08:00",
      schedule: {
        "2025-03-11": { title: "Finish for task", time: "08:00 - 12:00" },
        "2025-03-13": { title: "Evening Shift", time: "16:00 - 20:00" },
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Manager",
      shift: "2",
      duration: "08:00",
      schedule: {
        "2025-03-12": { title: "Afternoon Shift", time: "12:00 - 18:00" },
      },
    },
    {
      id: 3,
      name: "Michael Lee",
      profilePic: "https://randomuser.me/api/portraits/men/76.jpg",
      role: "Stock Clerk",
      shift: "1",
      duration: "06:00",
      schedule: {
        "2025-03-11": { title: "Restocking", time: "06:00 - 10:00" },
        "2025-03-14": { title: "Inventory Count", time: "10:00 - 14:00" },
      },
    },
    {
      id: 4,
      name: "Emily Davis",
      profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "Sales Associate",
      shift: "3",
      duration: "04:00",
      schedule: {
        "2025-03-13": { title: "Sales Floor", time: "14:00 - 18:00" },
      },
    },
    {
      id: 5,
      name: "Carlos Martinez",
      profilePic: "https://randomuser.me/api/portraits/men/85.jpg",
      role: "Security Guard",
      shift: "1",
      duration: "08:00",
      schedule: {
        "2025-03-11": { title: "Morning Patrol", time: "08:00 - 16:00" },
        "2025-03-12": { title: "Checkpoint Duty", time: "08:00 - 16:00" },
      },
    },
  ];

  // new states
  const [showAddMultipleShiftsDialog, setShowAddMultipleShiftsDialog] = useState(false);
  const [showClearWeekDialog, setShowClearWeekDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);


  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-3">
            <CalendarPlus2 className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Overtime</span>
          </div>
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

      <div className="p-4 bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
              <SelectTrigger className="w-24 font-custom rounded-full">
                <SelectValue placeholder="Week" />
              </SelectTrigger>
              <SelectContent className="w-24 font-custom">
                {ALL.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
            >
              <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
              {format(selectedRange.startDate, "MMM dd")} - {format(selectedRange.endDate, "MMM dd")}
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

          <div className="flex w-full sm:w-auto gap-4">
            <PendingDialog />

            <Select onValueChange={(value) => {
              if (value === "add-multiple-shifts") setShowAddMultipleShiftsDialog(true);
              if (value === "clear-week") setShowClearWeekDialog(true);
            }}>
              <SelectTrigger className="w-auto px-4 font-custom rounded-full">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add-multiple-shifts">Add multiple overtime</SelectItem>
                <SelectItem value="clear-week">Clear week</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-24 font-custom rounded-full">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent className="font-custom">
                {exportOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Dialogs */}
          <AddMultipleShiftsDialog open={showAddMultipleShiftsDialog} onOpenChange={setShowAddMultipleShiftsDialog} />
          <ClearWeekDialog open={showClearWeekDialog} onOpenChange={setShowClearWeekDialog} />
        </div>
      </div>

      <div className="overflow-x-auto p-6 bg-white rounded-md shadow-md border mb-6">
        <div className="flex font-custom items-center justify-between rounded-md mb-2">
          <div className="text-2xl">Weekly totals</div>
          <div className="flex gap-4">
            <div className="bg-gray-100 py-2 px-8 rounded-lg text-lg font-custom">Hour: 120:00</div>
            <div className="bg-gray-100 py-2 px-8 rounded-lg text-lg font-custom">Shift: 12</div>
            <div className="bg-gray-100 py-2 px-8 rounded-lg text-lg font-custom">Employee: 05</div>
          </div>
        </div>

        <Table className="w-full table-fixed border border-gray-300 rounded-2xl overflow-hidden border-separate border-spacing-0">
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="text-center text-xl font-custom border border-gray-300"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="border border-gray-300 align-top">
                  <div className="flex items-start gap-3">
                    <img
                      src={member.profilePic}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover mt-1"
                    />
                    <div className="text-sm leading-tight">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-blue-500">{member.role}</p>
                      <p className="text-gray-500">Shift: {member.shift}</p>
                      <p className="text-gray-500">Duration: {member.duration}</p>
                    </div>
                  </div>
                </TableCell>
                {dateColumns.map((date, i) => {
                  const key = format(date, 'yyyy-MM-dd');
                  const cellData = member.schedule?.[key];
                  return (
                    <TableCell
                      key={i}
                      className="text-center border border-gray-300"
                    >
                      {cellData ? (
                        <div className="bg-black rounded-2xl p-2">
                          <div className="text-base font-custom text-white">
                            {cellData.time}
                          </div>
                          <div className="text-base font-custom text-white">
                            {cellData.title}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDate(date); // ← this is the date from the map
                            setShowAddShiftDialog(true);
                          }}
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Plus size={16} />
                        </button>

                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddShiftDialog
        open={showAddShiftDialog}
        onOpenChange={setShowAddShiftDialog}
        date={selectedDate} // ← pass it here
      />

    </div>
  );
};

export default Overtime;
=======
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
import { CalendarPlus2, Search, ChevronDown } from "lucide-react";
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
          <a href="/overview/overtime" className="block">
            <div className="flex items-center space-x-3">
              <CalendarPlus2 className="text-[#2998FF]" width={40} height={40} />
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
                  className="flex items-center font-custom justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm"
                >
                  {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 font-custom mt-2 bg-white shadow-lg border p-2 rounded-md">
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
>>>>>>> d8c38a63385556dd479c08931b9c55ec7f45827c
