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
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import UserProfileSection from "./user-profile-section"; // adjust the path if needed
import { Search, ListFilter, ChevronDown } from "lucide-react";

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
    totalhours: "90:30",
    regularhours: "85:30",
    overtime: "14:30",
    paidtimeoff: "16:00",
    unpaidtimeoff: "05:00",
    shifonjob: "20",
    issues: "",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Mark",
    department: "Marketing",
    job: "Marketing",
    shifttype: "Scheduled",
    totalhours: "81:50",
    regularhours: "79:35",
    overtime: "10:30",
    paidtimeoff: "12:50",
    unpaidtimeoff: "",
    shifonjob: "20",
    issues: "",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Doe",
    lastname: "Ibrahim",
    department: "Officer",
    job: "HR",
    shifttype: "Scheduled",
    totalhours: "60:56",
    regularhours: "57:30",
    overtime: "05:30",
    paidtimeoff: "",
    unpaidtimeoff: "",
    shifonjob: "19",
    issues: "",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Luke",
    lastname: "Kal",
    department: "Officer",
    job: "General",
    shifttype: "Fixed",
    totalhours: "49:46",
    regularhours: "49:46",
    overtime: "",
    paidtimeoff: "",
    unpaidtimeoff: "",
    shifonjob: "15",
    issues: "",
  },
  {
    profile: "/avatars/ralph.png",
    firstname: "Bob",
    lastname: "Maka",
    department: "Marketing",
    job: "Accountant",
    shifttype: "Fixed",
    totalhours: "62:56",
    regularhours: "62:56",
    overtime: "",
    paidtimeoff: "",
    unpaidtimeoff: "",
    shifonjob: "08",
    issues: "",
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
  { accessorKey: "totalhours", header: "Total Hours" },
  {
    accessorKey: "regularhours",
    header: "Regular Hours",
    cell: ({ row }) => (
      <span className="text-blue">{row.original.regularhours}</span>
    ),
  },
  {
    accessorKey: "overtime",
    header: "Overtime",
    cell: ({ row }) => (
      <span className="text-green">{row.original.overtime}</span>
    ),
  },
  { accessorKey: "paidtimeoff", header: "Paid Time Off" },
  { accessorKey: "unpaidtimeoff", header: "Unpaid Time Off" },
  { accessorKey: "issues", header: "Issues" },
];

const TimesheetScreen = () => {
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Convert "HH:MM" to total minutes
  const convertToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  // Calculate total minutes from data
  const totalMinutes = data.reduce((sum, item) => {
    return sum + convertToMinutes(item.totalhours);
  }, 0);

  // Convert back to hours with 2 decimal places
  const totalHours = (totalMinutes / 60).toFixed(2);

  // Group data by job
  const groupedByJob = data.reduce((acc, item) => {
    if (!acc[item.job]) acc[item.job] = [];
    acc[item.job].push(item);
    return acc;
  }, {});
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const firstLevelOptions = [
    { key: "user", label: "User" },
    { key: "department", label: "Department" },
    { key: "group", label: "Group" },
    { key: "branch", label: "Branch" },
  ];

  const secondLevelData = {
    user: ["User 1", "User 2", "User 3"],
    department: ["Dept 1", "Dept 2"],
    group: ["Group 1", "Group 2"],
    branch: ["Branch 1", "Branch 2"],
  };

  const handleToggleMenu = () => setMenuOpen((prev) => !prev);

  const handleFirstLevelChange = (key) => {
    let newSelection = [];

    if (key === "all") {
      newSelection =
        selectedFirstLevels.length === firstLevelOptions.length
          ? []
          : firstLevelOptions.map((item) => item.key);
      setHoveredItem(null);
    } else {
      newSelection = selectedFirstLevels.includes(key)
        ? selectedFirstLevels.filter((k) => k !== key)
        : [...selectedFirstLevels, key];
    }
    setSelectedFirstLevels(newSelection);
  };

  const handleSecondLevelChange = (firstKey, value) => {
    setSelectedItems((prev) => {
      const existing = prev[firstKey] || [];
      const alreadyChecked = existing.includes(value);
      return {
        ...prev,
        [firstKey]: alreadyChecked
          ? existing.filter((v) => v !== value)
          : [...existing, value],
      };
    });
  };

  const isAllSelected =
    selectedFirstLevels.length === firstLevelOptions.length &&
    firstLevelOptions.length > 0;

  const firstLevelLabel = isAllSelected
    ? "All"
    : selectedFirstLevels
      .map((key) => firstLevelOptions.find((item) => item.key === key)?.label)
      .join(", ") || "Select...";

  const totalSecondLevelSelected = selectedFirstLevels.reduce((acc, key) => {
    const count = selectedItems[key]?.length || 0;
    return acc + count;
  }, 0);

  return (
    <>
      {selectedEmployee ? (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : (
        <>
          <div className="rounded-md">
            <div className="flex flex-wrap justify-between items-center p-4 bg-white border-b gap-4">
              {/* Left: Filter */}
              <div className="relative flex items-center">
                <button
                  onClick={handleToggleMenu}
                  className="flex items-center justify-between border border-gray-300 rounded-full px-6 py-2 text-blue-400 text-md bg-white hover:bg-gray-100 w-32 md:w-32 lg:w-40 font-custom"
                >
                  <ListFilter className="text-gray-500 mr-2" size={18} />
                  <span className="truncate flex-1">{firstLevelLabel}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>

                {totalSecondLevelSelected > 0 && (
                  <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
                    {totalSecondLevelSelected} selected
                  </span>
                )}

                {menuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 z-10 flex"
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* First-level dropdown */}
                    <div className="w-48 border border-gray-300 bg-white shadow-lg font-custom rounded-xl">
                      <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={() => handleFirstLevelChange("all")}
                          className="mr-2"
                        />
                        All
                      </label>
                      {firstLevelOptions.map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500"
                          onMouseEnter={() => setHoveredItem(item.key)}
                          onClick={() => setHoveredItem(item.key)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFirstLevels.includes(item.key)}
                            onChange={() => handleFirstLevelChange(item.key)}
                            className="mr-2"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>

                    {/* Second-level dropdown */}
                    {hoveredItem &&
                      selectedFirstLevels.includes(hoveredItem) &&
                      secondLevelData[hoveredItem]?.length > 0 && (
                        <div className="ml-2 w-48 border border-gray-300 bg-white shadow-lg font-custom rounded-xl z-20">
                          {secondLevelData[hoveredItem].map((value) => (
                            <label
                              key={value}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedItems[hoveredItem]?.includes(value) ||
                                  false
                                }
                                onChange={() =>
                                  handleSecondLevelChange(hoveredItem, value)
                                }
                                className="mr-2"
                              />
                              {value}
                            </label>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Right: Search + Export */}
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center w-full sm:w-auto max-w-md">
                  <Search className="absolute left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => setSelectedEmployee(row.original)}
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
          </div>

          <div className="p-4 bg-white rounded-lg mb-3 shadow-md py-6 px-6 border mt-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between w-full mb-3">
                <h1 className="font-custom text-2xl sm:text-lg md:text-xl lg:text-3xl">
                  Job insights
                </h1>

                <div className="flex items-center space-x-4">
                  {/* Total Hours Block */}
                  <div className="flex flex-col items-center mr-6">
                    <span className="text-xl font-custom text-blue">
                      {totalHours}
                    </span>
                    <span className="text-md font-custom">Total Hours</span>
                  </div>

                  {/* Export Select */}
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
              <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
              {/* Table with jobs and performed by and shift on job and total hours */}
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 text-dark-blue">
                      <TableHead className="text-md font-custom px-4 rounded-tl-xl">
                        Jobs
                      </TableHead>
                      <TableHead className="text-md font-custom px-4">
                        Performed By
                      </TableHead>
                      <TableHead className="text-md font-custom px-4">
                        Shift on Jobs
                      </TableHead>
                      <TableHead className="text-md font-custom px-4 rounded-tr-xl">
                        Total Hours
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(groupedByJob).map(([job, members]) => {
                      const totalMinutes = members.reduce((sum, member) => {
                        if (!member.totalhours) return sum;
                        const [h, m] = member.totalhours.split(":").map(Number);
                        return sum + h * 60 + m;
                      }, 0);
                      const totalHoursFormatted = `${Math.floor(
                        totalMinutes / 60
                      )}:${String(totalMinutes % 60).padStart(2, "0")}`;

                      // calculate total shiftonjob
                      const totalShifonjob = members.reduce((sum, member) => {
                        if (!member.shifonjob) return sum;
                        return sum + parseInt(member.shifonjob, 10);
                      }, 0);
                      const totalShifonjobFormatted = totalShifonjob.toString();

                      return (
                        <React.Fragment key={job}>
                          {members.map((item, index) => (
                            <TableRow
                              key={`${job}-${index}`}
                              className={
                                index < members.length - 1 ? "border-b-0" : "border-b-0"
                              }
                            >
                              {index === 0 && (
                                <TableCell
                                  className="font-custom px-4 "
                                  rowSpan={members.length + 1}
                                >
                                  {job}
                                </TableCell>
                              )}

                              {/* Name with Profile inside same cell */}
                              <TableCell className="font-custom px-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                                    {item.profile ? (
                                      <img
                                        src={item.profile}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    ) : (
                                      <span className="text-xs text-gray-600 font-custom">
                                        {item.firstname.charAt(0).toUpperCase()}
                                        {item.lastname.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <span>
                                    {item.firstname} {item.lastname}
                                  </span>
                                </div>
                              </TableCell>

                              <TableCell className="font-custom px-4 text-black">
                                {item.shifonjob}
                              </TableCell>
                              <TableCell className="font-custom px-4">
                                {item.totalhours}
                              </TableCell>
                            </TableRow>
                          ))}

                          {/* Total row */}
                          <TableRow>
                            <TableCell colSpan={1}></TableCell>
                            <TableCell className="font-custom px-4 text-blue border-none">
                              {totalShifonjobFormatted}
                            </TableCell>
                            {/* Total Hours Cell */}
                            <TableCell className="font-custom px-4 text-blue border-none">
                              {totalHoursFormatted}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TimesheetScreen;
