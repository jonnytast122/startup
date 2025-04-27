import React, { useState } from "react";
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
import { ListFilter } from "lucide-react";

const Filter = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

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

const reportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const users = [
  {
    id: 1,
    profile: "/avatars/ralph.png",
    lastname: "Doe",
    bankName: "ABA",
    bankAccount: "12345678",
    cash: 500,
    bankTransfer: 2000,
    tax: 30,
    nssf: 120,
    total: 2500,
    status: "Processing",
  },
  {
    id: 2,
    profile: "/avatars/ralph.png",
    lastname: "Smith",
    bankName: "ABA",
    bankAccount: "87654321",
    cash: 300,
    bankTransfer: 2000,
    tax: 40,
    nssf: 150,
    total: 2300,
    status: "Processing",
  },
  {
    id: 3,
    profile: "/avatars/ralph.png",
    lastname: "Johnson",
    bankName: "ABA",
    bankAccount: "11223344",
    cash: 400,
    bankTransfer: 1800,
    tax: 20,
    nssf: 100,
    total: 2200,
    status: "Processing",
  },
  {
    id: 4,
    profile: "/avatars/ralph.png",
    lastname: "Brown",
    bankName: "ABA",
    bankAccount: "44332211",
    cash: 350,
    bankTransfer: 1750,
    tax: 35,
    nssf: 130,
    total: 2100,
    status: "Processing",
  },
  {
    id: 5,
    profile: "/avatars/ralph.png",
    lastname: "Davis",
    bankName: "ABA",
    bankAccount: "99887766",
    cash: 450,
    bankTransfer: 1950,
    tax: 25,
    nssf: 140,
    total: 2400,
    status: "Processing",
  },
  {
    id: 6,
    profile: "/avatars/ralph.png",
    lastname: "Wilson",
    bankName: "ABA",
    bankAccount: "66554433",
    cash: 500,
    bankTransfer: 2200,
    tax: 50,
    nssf: 160,
    total: 2700,
    status: "Processing",
  },
  {
    id: 7,
    profile: "/avatars/ralph.png",
    lastname: "Evans",
    bankName: "ABA",
    bankAccount: "33221100",
    cash: 300,
    bankTransfer: 1700,
    tax: 15,
    nssf: 90,
    total: 2000,
    status: "Processing",
  },
  {
    id: 8,
    profile: "/avatars/ralph.png",
    lastname: "Taylor",
    bankName: "ABA",
    bankAccount: "77889900",
    cash: 350,
    bankTransfer: 1900,
    tax: 30,
    nssf: 110,
    total: 2250,
    status: "Processing",
  },
  {
    id: 9,
    profile: "/avatars/ralph.png",
    lastname: "Martinez",
    bankName: "ABA",
    bankAccount: "55667788",
    cash: 400,
    bankTransfer: 2200,
    tax: 20,
    nssf: 125,
    total: 2600,
    status: "Processing",
  },
];

const Dot = ({ color }) => (
  <span
    className="w-2 h-2 rounded-full inline-block mr-2"
    style={{ backgroundColor: color }}
  />
);

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
  { accessorKey: "lastname", header: "Last name" },
  { accessorKey: "bankName", header: "Bank Name" },
  {
    accessorKey: "bankAccount",
    header: "Bank Account",
    cell: ({ row }) => (
      <span className="text-green">{row.original.bankAccount}</span>
    ),
  },
  { accessorKey: "cash", header: "Cash" },
  { accessorKey: "bankTransfer", header: "Bank Transfer" },
  { accessorKey: "tax", header: "Tax" },
  { accessorKey: "nssf", header: "NSSF" },
  { accessorKey: "total", header: "Total" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.trim();

      const statusStyles = {
        Processing: "bg-[#FFF6C4] text-[#F7D000] border-[#F7D000]",
      };

      const dotColor = {
        Processing: "#F7D000",
      };

      return (
        <span
          className={`px-1.5 py-0.5 text-sm font-semibold rounded-md border inline-flex items-center gap-1 ${
            statusStyles[status] || "bg-gray-200 text-gray-700 border-gray-400"
          }`}
          style={{
            borderWidth: "1px",
            minWidth: "80px",
            justifyContent: "center",
          }}
        >
          <Dot color={dotColor[status] || "#999"} />
          {status}
        </span>
      );
    },
  },
];

const usersPerPage = 8;

export default function PayrollTable() {
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
    <div className="bg-white">
      {/* Header Controls */}
      <div className="flex justify-between items-center my-4">
        {/* Left: Groups Select */}
        <Select>
          <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative">
            <ListFilter className="text-blue-500" size={20} />
            <SelectValue className="text-blue-500" placeholder="Filter" />
            {/* Hides default icon */}
          </SelectTrigger>
          <SelectContent className="font-custom">
            {Filter.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Right: Search, Team, Export */}
        <div className="flex items-center space-x-2">
          <Input placeholder="Search..." className="w-[180px]" />
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
          {/* Export Button */}
          <Select>
            <SelectTrigger className="w-32 font-custom rounded-full">
              <SelectValue placeholder="Report" />
            </SelectTrigger>
            <SelectContent className="w-32 font-custom">
              {reportOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator orientation="horizontal" className="w-full mb-5 bg-black" />
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
