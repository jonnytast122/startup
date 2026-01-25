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
  flexRender,
  getCoreRowModel,
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

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const reportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const [imageError, setImageError] = React.useState(false);
      const profile = row.original.profile;
      const name = row.original.name || "";
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

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
              {initials}
            </span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Fullname" },
  { accessorKey: "companyIdentifier", header: "Company ID" },
  { accessorKey: "profileImg", header: "" },
  { accessorKey: "baseSalary", header: "Base Salary" },
  { accessorKey: "cash", header: "Cash" },
  { accessorKey: "ibanking", header: "IBanking" },
  { accessorKey: "bonus", header: "Bonus" },
  { accessorKey: "ot", header: "OT" },
  { accessorKey: "nssfRate", header: "NSSF Rate" },
  { accessorKey: "taxRate", header: "Tax Rate" },
  { accessorKey: "unpaidLeave", header: "Unpaid Leave" },
  { accessorKey: "nssfExpense", header: "NSSF Expense" },
  { accessorKey: "taxRatePercent", header: "Tax Rate (%)" },
  { accessorKey: "taxExpense", header: "Tax Expense" },
  { accessorKey: "estimatedNetPay", header: "Estimated Net Pay" },
  { accessorKey: "netSalary", header: "Net Pay" },
];

export default function PayrollTable({ rows = [], isLoading, errorMessage }) {
  const [page, setPage] = useState(0);

  const usersPerPage = 8;
  const paginatedRows = rows.slice(
    page * usersPerPage,
    (page + 1) * usersPerPage,
  );

  const table = useReactTable({
    data: paginatedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-sm text-gray-500"
                >
                  Loading payroll...
                </TableCell>
              </TableRow>
            ) : errorMessage ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-sm text-red-500"
                >
                  {errorMessage}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-sm text-gray-500"
                >
                  No payroll records.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
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
          Page {page + 1} of {Math.ceil(rows.length / usersPerPage) || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={(page + 1) * usersPerPage >= rows.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
