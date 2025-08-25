import { useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Group = [
  { value: "Group 1", label: "Group 1" },
  { value: "Group 2", label: "Group 2" },
  { value: "Group 3", label: "Group 3" },
];

const Team = [
  { value: "Team 1", label: "Team 1" },
  { value: "Team 2", label: "Team 2" },
  { value: "Team 3", label: "Team 3" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const users = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    job: "Developer",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 120,
    tax: 30,
    timeOff: "10;31",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2500,
    profile: "/profile1.jpg",
  },
  {
    id: 2,
    firstname: "Jane",
    lastname: "Smith",
    job: "HR",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 150,
    tax: 40,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2300,
    profile: "/profile2.jpg",
  },
  {
    id: 3,
    firstname: "Alice",
    lastname: "Johnson",
    job: "Admin",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 100,
    tax: 20,
    timeOff: "11:11",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2200,
    profile: "/profile3.jpg",
  },
  {
    id: 4,
    firstname: "Bob",
    lastname: "Brown",
    job: "Marketing",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 130,
    tax: 35,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2100,
    profile: "/profile4.jpg",
  },
  {
    id: 5,
    firstname: "Charlie",
    lastname: "Davis",
    job: "Developer",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 140,
    tax: 25,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2400,
    profile: "/profile5.jpg",
  },
  {
    id: 6,
    firstname: "Emma",
    lastname: "Wilson",
    job: "HR",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 160,
    tax: 50,
    timeOff: "12:12",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2700,
    profile: "/profile6.jpg",
  },
  {
    id: 7,
    firstname: "Daniel",
    lastname: "Evans",
    job: "Admin",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 90,
    tax: 15,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2000,
    profile: "/profile7.jpg",
  },
  {
    id: 8,
    firstname: "Sophia",
    lastname: "Taylor",
    job: "Marketing",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 110,
    tax: 30,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2250,
    profile: "/profile8.jpg",
  },
  {
    id: 9,
    firstname: "Liam",
    lastname: "Martinez",
    job: "Developer",
    shiftType: "Scheduled",
    nssfType: "Type",
    nssf: 125,
    tax: 20,
    timeOff: "None",
    sickLeave: "None",
    unpaidLeave: "None",
    netSalary: 2600,
    profile: "/profile9.jpg",
  },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const [imageError, setImageError] = React.useState(false);
      const profile = row.original.profile;
      const firstnameInitial =
        row.original.firstname?.charAt(0).toUpperCase() || "";
      const lastnameInitial =
        row.original.lastname?.charAt(0).toUpperCase() || "";

      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {profile && !imageError ? (
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs text-gray-600 font-medium">
              {firstnameInitial}
              {lastnameInitial}
            </span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "firstname", header: "First name" },
  { accessorKey: "lastname", header: "Last name" },
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
  { accessorKey: "nssfType", header: "NSSF Type" },
  { accessorKey: "nssf", header: "NSSF" },
  { accessorKey: "tax", header: "Tax" },
  { accessorKey: "timeOff", header: "Time Off" },
  { accessorKey: "sickLeave", header: "Sick Leave" },
  { accessorKey: "unpaidLeave", header: "Unpaid Leave" },
  { accessorKey: "netSalary", header: "Net Salary" },
];

const usersPerPage = 8;

export default function DetailCard() {
  const [page, setPage] = useState(0);

  const paginatedUsers = users.slice(
    page * usersPerPage,
    (page + 1) * usersPerPage
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white p-4 mt-10">
      {/* Title */}
      <h2 className="text-2xl font-custom">Details</h2>

      <Separator orientation="horizontal" className="w-full mt-2" />

      {/* Header Controls */}
      <div className="flex justify-between items-center my-4">
        {/* Left: Groups Select */}
        <Select>
          <SelectTrigger className="w-32 font-custom rounded-full">
            <SelectValue placeholder="Group" />
          </SelectTrigger>
          <SelectContent className="w-32 font-custom">
            {Group.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Right: Search, Team, Export */}
        <div className="flex items-center space-x-2">
          <Input placeholder="Search..." className="w-[180px]" />
          <Separator orientation="vertical" className="mr-2 h-10" />

          <Select>
            <SelectTrigger className="w-32 font-custom rounded-full">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent className="w-32 font-custom">
              {Team.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="mr-2 h-10" />
          {/* Export Button */}
          <Select>
            <SelectTrigger className="w-32 font-custom rounded-full">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent className="w-32 font-custom">
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className="font-custom text-gray-400">
          Page {page + 1} of {Math.ceil(users.length / usersPerPage)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={(page + 1) * usersPerPage >= users.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
