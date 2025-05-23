import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
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
import { ChevronDown, MapPin } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Map from "./map";

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
    firstname: "Lucy",
    lastname: "Trevo",
    department: "Marketing",
    job: "Accountant",
    shifttype: "Scheduled",
    status: "On time",
    Clockin: "08:11",
    Clockout: "",
    regularhours: "",
    overtime: "",
    date: "2025-04-08",
    lat: 11.56786,
    lng: 104.89005,
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Mark",
    department: "Marketing",
    job: "Marketing",
    shifttype: "Scheduled",
    status: "Late",
    Clockin: "08.31",
    Clockout: "",
    regularhours: "",
    overtime: "",
    date: "2025-04-08",
    lat: 11.568,
    lng: 104.891,
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Doe",
    lastname: "Ibrahim",
    department: "Officer",
    job: "HR",
    shifttype: "Scheduled",
    status: "Early",
    Clockin: "08:09",
    Clockout: "17:10",
    regularhours: "8.01",
    overtime: "8.01",
    date: "2025-04-08",
    lat: 11.569,
    lng: 104.892,
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Luke",
    lastname: "Kal",
    department: "Officer",
    job: "General",
    shifttype: "Fixed",
    status: "",
    Clockin: "",
    Clockout: "",
    regularhours: "",
    overtime: "",
    date: "2025-04-08",
    lat: 11.568,
    lng: 104.891,
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Bob",
    lastname: "Maka",
    department: "Marketing",
    job: "Accountant",
    shifttype: "Fixed",
    status: "",
    Clockin: "",
    Clockout: "",
    regularhours: "",
    overtime: "",
    date: "2025-04-08",
    lat: 11.568,
    lng: 104.891,
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.trim(); // Remove extra spaces

      const statusClass =
        status === "On time"
          ? "text-green"
          : status === "Late"
          ? "text-red"
          : status === "Early"
          ? "text-blue"
          : "text-gray";

      return (
        <div className={`text-md font-custom ${statusClass}`}>{status}</div>
      );
    },
  },
  {
    accessorKey: "Clockin",
    header: "Clock In",
    cell: ({ row }) => {
      const { Clockin, lat, lng } = row.original;
      const hasValidLocation = lat && lng;
      return (
        <div className="flex items-center space-x-2">
          <span>{Clockin}</span>
          {Clockin && hasValidLocation && (
            <MapPin className="w-4 h-4 text-gray-600" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "Clockout",
    header: "Clock Out",
    cell: ({ row }) => {
      const { Clockout, lat, lng } = row.original;
      const hasValidLocation = lat && lng;
      return (
        <div className="flex items-center space-x-2">
          <span>{Clockout}</span>
          {Clockout && hasValidLocation && (
            <MapPin className="w-4 h-4 text-gray-600" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalhours",
    header: "Total Hours",
    cell: ({ row }) => {
      const clockIn = row.original.Clockin;
      const clockOut = row.original.Clockout;

      // Only calculate if both Clockin and Clockout exist
      if (!clockIn || !clockOut) return null; // Leave blank instead of showing "N/A"

      // Convert to Date object
      const [inHours, inMinutes] = clockIn.split(":").map(Number);
      const [outHours, outMinutes] = clockOut.split(":").map(Number);

      const clockInDate = new Date(2025, 0, 1, inHours, inMinutes);
      const clockOutDate = new Date(2025, 0, 1, outHours, outMinutes);

      const diffMs = clockOutDate - clockInDate;
      const diffHours = diffMs / (1000 * 60 * 60);

      const totalHoursFormatted = diffHours.toFixed(2) + " hours";

      return <div className="text-md font-custom">{totalHoursFormatted}</div>;
    },
  },
  { accessorKey: "regularhours", header: "Regular Hours" },
  { accessorKey: "overtime", header: "Overtime" },
];

const TodayScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  const filteredData = useMemo(() => {
    const selected = selectedDate ? new Date(selectedDate).toDateString() : "";
    return data.filter((item) => {
      const itemDate = new Date(item.date).toDateString();
      return itemDate === selected;
    });
  }, [selectedDate]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="rounded-md border mt-2">
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
                    className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-md"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-gray-300 mt-4 text-xl font-custom p-24"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 bg-white rounded-lg mb-3 shadow-md py-6 px-6 border mt-6">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          {/* Left Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
              <SelectTrigger className="w-auto font-custom rounded-full">
                <SelectValue placeholder="All activity" />
              </SelectTrigger>
              <SelectContent className="w-48 font-custom">
                {ALL.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full border border-gray-400 flex items-center justify-between font-custom w-auto h-9 text-black"
                >
                  {selectedDate ? (
                    format(new Date(selectedDate), "dd/MM/yyyy")
                  ) : (
                    <span className="text-gray-500">Pick a date</span>
                  )}
                  <ChevronDown className="w-6 h-6 text-light-gray" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="p-0 bg-white border shadow-md rounded-md"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) =>
                    setSelectedDate(date ? date.toISOString() : "")
                  }
                />
              </PopoverContent>
            </Popover>
            <Select>
              <SelectTrigger className="w-auto font-custom rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="w-48 font-custom">
                {ALL.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#A6A6A6] mt-6"></div>
        {/* Map */}
        <Map userData={data} selectedDate={selectedDate} />
      </div>

      {/* Activity Section */}
      <div className="p-4 bg-white rounded-lg mb-3 shadow-md border py-6 px-6">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-custom text-2xl sm:text-lg md:text-xl lg:text-3xl mb-3">
            Activity
          </h1>

          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>

          {filteredData.length > 0 ? (
            <>
              <h2 className="font-custom text-gray-500 text-md py-4">
                {format(new Date(filteredData[0].date), "eeee, dd MMM yyyy")}
              </h2>

              <div className="flex flex-col items-start text-left gap-4 ml-4">
                {filteredData
                  .filter((entry) =>
                    ["On time", "Early", "Late"].includes(entry.status.trim())
                  )
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 font-custom text-md sm:text-sm md:text-md lg:text-lg"
                    >
                      {/* Dot Indicator */}
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>

                      {/* Clock-in time */}
                      <span className="text-gray-400 text-xs sm:text-xs md:text-sm lg:text-sm">
                        {entry.Clockin}
                      </span>

                      {/* User Avatar or Initials */}
                      <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-gray-100">
                        {entry.profile ? (
                          <img
                            src={entry.profile}
                            alt={`${entry.firstname} ${entry.lastname}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">
                            {entry.firstname.charAt(0).toUpperCase()}
                            {entry.lastname.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Name and clock in label */}
                      <span className="text-dark-gray text-xs sm:text-sm md:text-md lg:text-md">
                        {entry.firstname} {entry.lastname}{" "}
                        <span>Clock In:</span>
                      </span>

                      {/* Job title badge */}
                      <span className="px-5 py-1 text-md font-custom rounded-lg border border-[#5494DA] text-blue-600 ml-3 inline-flex items-center gap-1">
                        <span className="text-blue text-xs sm:text-sm md:text-md lg:text-md">
                          {entry.job}
                        </span>
                      </span>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center w-full py-10">
              <p className="text-center text-gray-300 mt-4 text-xl font-custom">
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TodayScreen;
