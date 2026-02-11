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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MapPin,
  Search,
} from "lucide-react";
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
import PendingDialog from "./pendingdialog";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import AddAttendanceDialog from "./addattendencedialog";
import AddAttendanceTableDialog from "./addattendencetabledialog";
import UserProfileSection from "../records/[id]/user-profile-section"; // adjust the path if needed

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendances } from "@/lib/api/adminAttendance";
import { fetchCompany } from "@/lib/api/company";
import { formatWorkHours } from "@/lib/helper/dateTimeConveter";

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
  { accessorKey: "shiftType", header: "Shift Type" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.trim();

      const statusClass =
        status === "On time"
          ? "px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5CB85C] text-green"
          : status === "Late"
            ? "px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#ED4C4C] text-red"
            : status === "Early"
              ? "px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#ED4C4C] text-yellow-400"
              : "px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5CB85C] text-green";

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
      return (
        <div className="text-md font-custom">{row.original.totalhours}</div>
      );
    },
  },
  { accessorKey: "regularhours", header: "Regular Hours" },
  { accessorKey: "overtime", header: "Overtime" },
];

// Helper to format time (HH:mm)
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Transform attendances into table-friendly rows

const TodayScreen = () => {
  const cambodiaNow = useMemo(
    () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
      ),
    [],
  );
  const [selectedDate, setSelectedDate] = useState(cambodiaNow.toISOString());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openAddAttendenceDialog, setOpenAddAttendenceDialog] = useState(false);
  const [showAddAttendenceTableDialog, setShowAddAttendenceTableDialog] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceTables, setAttendanceTables] = useState([
    {
      tableName: "Today Attendance",
    },
  ]);

  const formatDate = useMemo(
    () => (date) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date),
    [],
  );

  const [selectedRange, setSelectedRange] = useState({
    startDate: cambodiaNow,
    endDate: cambodiaNow,
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

  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
    enabled: true,
  });

  const rangeStartKey = selectedRange?.startDate
    ? formatDate(selectedRange.startDate)
    : "";
  const rangeEndKey = selectedRange?.endDate
    ? formatDate(selectedRange.endDate)
    : "";

  const { data: attendances } = useQuery({
    queryKey: ["attendances", company?.id, rangeStartKey, rangeEndKey],
    queryFn: () =>
      getAttendances(
        company?.id,
        formatDate(selectedRange.startDate),
        formatDate(selectedRange.endDate),
      ),
    enabled: !!company?.id && !!rangeStartKey && !!rangeEndKey,
  });

  const transformedData = useMemo(() => {
    if (!attendances) return [];
    return attendances.map((record) => {
      // Get first checkIn
      const checkIns = record.transactions.filter((t) => t.type === "checkIn");
      const firstCheckIn = checkIns.length > 0 ? checkIns[0] : null;

      // Get last checkOut
      const checkOuts = record.transactions.filter(
        (t) => t.type === "checkOut",
      );
      const lastCheckOut =
        checkOuts.length > 0 ? checkOuts[checkOuts.length - 1] : null;

      const shiftTypes = Array.isArray(record.employee?.info?.shiftType)
        ? record.employee?.info?.shiftType
        : record.employee?.info?.shiftType
          ? [record.employee?.info?.shiftType]
          : [];
      const fallbackShift = shiftTypes[0] || null;
      const shiftSource = record.shift || fallbackShift;
      const todayDay = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Phnom_Penh",
        weekday: "short",
      }).format(new Date(record.date));
      const todaySchedule = shiftSource?.schedules?.find(
        (schedule) => schedule.day === todayDay,
      );
      const scheduleLabel = todaySchedule?.workDuration
        ? `${todaySchedule.workDuration.start || "--"} - ${
            todaySchedule.workDuration.end || "--"
          }`
        : "--";

      return {
        id: record._id,
        employeeId: record.employee?._id,
        employee: record.employee,
        profile: record.employee?.profile || null, // if you add profile later
        fullname: record.employee?.name || "",
        department: record.employee?.info?.department?.name || "--",
        job: record.employee?.info?.job || "--",
        shiftType: shiftSource?.name || "Scheduled",
        status: record.status || "",
        Clockin: firstCheckIn ? formatTime(firstCheckIn.time) : "",
        Clockout: lastCheckOut ? formatTime(lastCheckOut.time) : "",
        regularhours: scheduleLabel,
        overtime: record.overtime || "",
        totalhours: formatWorkHours(record.workHours),
        date: record.date,
        lat: firstCheckIn?.geoLocation?.latitude || null,
        lng: firstCheckIn?.geoLocation?.longitude || null,
      };
    });
  }, [attendances]);

  useEffect(() => {
    if (company?.id && selectedRange.startDate && selectedRange.endDate) {
      queryClient.invalidateQueries({
        queryKey: ["attendances", company.id, rangeStartKey, rangeEndKey],
      });
    }
  }, [selectedRange, company?.id, queryClient, rangeStartKey, rangeEndKey]);

  return (
    <>
      {selectedEmployee ? (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : (
        <>
          <div className="mb-4">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              <div className="flex w-full sm:w-auto gap-4">
                {/* <Select>
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
                </Select> */}
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
                >
                  <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
                  {format(selectedRange.startDate, "MMM dd")} -{" "}
                  {format(selectedRange.endDate, "MMM dd")}
                  <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
                </button>

                {showDatePicker && (
                  <div
                    ref={datePickerRef}
                    className="absolute mt-2 bg-white shadow-lg border p-2 rounded-md z-50 font-custom"
                  >
                    <DateRange
                      ranges={[selectedRange]}
                      onChange={(ranges) => {
                        const newRange = ranges.selection;
                        setSelectedRange(newRange);

                        // Only close if both dates are selected and not the same
                        const start = newRange.startDate;
                        const end = newRange.endDate;
                        if (start && end && start.getTime() !== end.getTime()) {
                          setShowDatePicker(false);
                        }
                        queryClient.invalidateQueries({
                          queryKey: [
                            "attendances",
                            company?.id,
                            formatDate(start),
                            formatDate(end),
                          ],
                        });
                      }}
                      rangeColors={["#3b82f6"]}
                    />
                  </div>
                )}
                <Button
                  onClick={() => {
                    const today = new Date(
                      new Date().toLocaleString("en-US", {
                        timeZone: "Asia/Phnom_Penh",
                      }),
                    );
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
                <PendingDialog />
              </div>
            </div>
          </div>
          {attendanceTables.map((table, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl shadow-sm border mt-6"
            >
              <div className="flex items-center p-4 bg-white border-b rounded-t-md gap-4 flex-wrap sm:flex-nowrap">
                <Select
                  onValueChange={(value) =>
                    setStatusFilter(value === "clear" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-36 rounded-full flex items-center gap-2 border border-gray-300">
                    <ListFilter className="text-gray-500" size={20} />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">
                      <div className="text-gray-500 font-custom">All</div>
                    </SelectItem>

                    {["On Time", "Late", "On Leave"].map((status) => {
                      const dotColor =
                        status === "On Time"
                          ? "bg-green-500"
                          : status === "Late"
                            ? "bg-red-500"
                            : "bg-yellow-400";

                      return (
                        <SelectItem
                          key={status}
                          value={status}
                          className="font-custom"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${dotColor}`}
                            />
                            <span className="capitalize">{status}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

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

                <Button
                  onClick={() => setOpenAddAttendenceDialog(true)}
                  variant="outline"
                  className="rounded-full border border-gray-400 flex items-center justify-between font-custom w-auto h-9 text-blue-500"
                >
                  Add Attendance
                </Button>
                <AddAttendanceDialog
                  open={openAddAttendenceDialog}
                  onOpenChange={setOpenAddAttendenceDialog}
                  onConfirm={(newTable) => {
                    // Add new table logic here
                  }}
                />

                {/* Export Select */}
                <Select>
                  <SelectTrigger className="w-24 font-custom rounded-full border-gray-400">
                    <SelectValue placeholder="Export" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    {exportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md">
                {/* Line + summary row */}
                <div className="w-full border-t border-[#A6A6A6]"></div>

                <div className="flex justify-between items-center px-4 py-3">
                  {/* Left side: Shift Type label */}
                  <span className="font-custom text-xl text-blue-500">
                    {table.tableName}
                  </span>

                  {/* Right side: Row count */}
                  {/* <span className="font-custom text-xl text-gray-600">
                    <span className="text-blue-500">{attendances.length}</span>
                    /5 employees clocked in today
                  </span> */}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 text-dark-blue">
                    {columns.map((col, idx) => (
                      <TableHead
                        key={idx}
                        className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-md text-center"
                      >
                        {typeof col.header === "function"
                          ? col.header()
                          : col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transformedData.map((row, rowIdx) => (
                    <TableRow
                      key={rowIdx}
                      onClick={() => setSelectedEmployee(row)}
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      {columns.map((col, colIdx) => (
                        <TableCell
                          key={colIdx}
                          className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis text-center"
                        >
                          {typeof col.cell === "function"
                            ? col.cell({ row: { original: row } })
                            : row[col.accessorKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          {/* Add More Attendence button */}
          {/* <div className="flex justify-center mt-4">
            <Button
              className="mt-4 w-full sm:w-auto font-custom rounded-full h-9 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setShowAddAttendenceTableDialog(true)}
            >
              Add More Attendance
            </Button>
          </div> */}
          {/* <AddAttendanceTableDialog
            open={showAddAttendenceTableDialog}
            onOpenChange={setShowAddAttendenceTableDialog}
            onConfirm={(data) => {
              const newTable = {
                tableName:
                  data.tableName ||
                  `Attendance Table ${attendanceTables.length + 1}`,
                data: [
                  {
                    profile: "/avatars/ralph.png",
                    firstname: "Lucy",
                    lastname: "Trevo",
                    department: "Marketing",
                    job: "Accountant",
                    shifttype: "Scheduled",
                    status: "On time",
                    Clockin: "08:11",
                    Clockout: "17:11",
                    regularhours: "",
                    overtime: "",
                    date: today,
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
                    Clockout: "17:11",
                    regularhours: "",
                    overtime: "",
                    date: today,
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
                    date: today,
                    lat: 11.569,
                    lng: 104.892,
                  },
                ], // same static data used for all tables
              };
              setAttendanceTables((prev) => [...prev, newTable]);
              setShowAddAttendenceTableDialog(false);
            }}
          /> */}
          <div className="bg-white rounded-lg mb-3 mt-6">
            {/* Map */}
            {/* <Map userData={data} selectedDate={selectedDate} /> */}
          </div>

          {/* Activity Section */}
          {/* <div className="p-4 bg-white rounded-lg mb-3 shadow-md border py-6 px-6">
            <div className="flex flex-col items-start text-left">
              <h1 className="font-custom text-2xl sm:text-lg md:text-xl lg:text-3xl mb-3">
                Activity
              </h1>

              <div className="w-full h-[1px] bg-[#A6A6A6]"></div>

              {filteredData.length > 0 ? (
                <>
                  <h2 className="font-custom text-gray-500 text-md py-4">
                    {format(
                      new Date(filteredData[0].date),
                      "eeee, dd MMM yyyy"
                    )}
                  </h2>

                  <div className="flex flex-col items-start text-left gap-4 ml-4">
                    {filteredData
                      .filter((entry) =>
                        ["On time", "Early", "Late"].includes(
                          entry.status.trim()
                        )
                      )
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 font-custom text-md sm:text-sm md:text-md lg:text-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>

                          <span className="text-gray-400 text-xs sm:text-xs md:text-sm lg:text-sm">
                            {entry.Clockin}
                          </span>

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

                          <span className="text-dark-gray text-xs sm:text-sm md:text-md lg:text-md">
                            {entry.firstname} {entry.lastname}{" "}
                            <span>Clock In:</span>
                          </span>

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
          </div> */}
        </>
      )}
    </>
  );
};

export default TodayScreen;
