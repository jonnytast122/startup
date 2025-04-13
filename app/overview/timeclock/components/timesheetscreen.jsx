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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
  );
};

export default TimesheetScreen;
