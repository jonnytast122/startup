import React, { useEffect } from "react";
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

const roleOptions = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const statusOptions = [
  { value: "Marketing", label: "Marketing" },
  { value: "Administration", label: "Administration" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "IT", label: "IT" },
  { value: "Operations", label: "Operations" },
  { value: "Sales", label: "Sales" },
  { value: "Support", label: "Support" },
  { value: "Others", label: "Others" },
];

const importOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const archeive = [
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "online",
  },
  {
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "offline",
  },
  {
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "online",
  },
  {
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "online",
  },
  {
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "offline",
  },
  {
    firstname: "John2",
    lastname: "Doe",
    title: "CEO",
    job: "CEO",
    dateadded: "10-02-2025",
    lastlogin: "10-02-2025",
    bankname: "johndoe",
    banknumber: "1234567890",
    status: "offline",
  },
];

const Dot = ({ color }) => (
  <span
    className="w-2 h-2 rounded-full inline-block mr-2"
    style={{ backgroundColor: color }}
  />
);

const statusFilter = ["Online", "Offline"];

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
            <img src={row.original.profile} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xs text-gray-500">{firstNameInitial}{lastNameInitial}</span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "firstname", header: "First name" },
  { accessorKey: "lastname", header: "Last name" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "job", header: "Job" },
  { accessorKey: "dateadded", header: "Date Added" },
  { accessorKey: "lastlogin", header: "Last Login" },
  { accessorKey: "bankname", header: "Bank Name" },
  { accessorKey: "banknumber", header: "Bank Account" },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>Status</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "All" ? "" : value);
          }}
        >
          <SelectTrigger className="border-none p-0 w-6"></SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="font-custom">
              All
            </SelectItem>
            {statusFilter.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="font-custom text-light-gray"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const status =
        row.original.status.charAt(0).toUpperCase() +
        row.original.status.slice(1).toLowerCase();

      const statusStyles = {
        Online: "bg-[#05C16833] text-[#14CA74] border-[#14CA74]",
        Offline: "bg-[#AEB9E133] text-[#AEB9E1] border-[#AEB9E1]",
      };

      const dotColor = {
        Online: "#14CA74",
        Offline: "#AEB9E1",
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
          {row.original.status}
        </span>
      );
    },
  },
];

const ArchieveScreen = () => {
  const table = useReactTable({
    data: archeive,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  return (
    <div className="p-4">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        {/* Left Side Dropdowns */}
        <div className="flex w-full sm:w-auto gap-4">
          <Select>
            <SelectTrigger className="w-48 font-custom rounded-full">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent className="w-48 font-custom">
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48 font-custom rounded-full">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent className="w-48 font-custom">
              {statusOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Right Side Dropdowns */}
        <div className="flex w-full sm:w-auto gap-4">
          <Select>
            <SelectTrigger className="w-24 font-custom rounded-full">
              <SelectValue placeholder="Import" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {importOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                    className="whitespace-nowrap px-2 min-w-[50px] w-[50px]"
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
                  <TableCell key={cell.id} className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
  );
};

export default ArchieveScreen;
