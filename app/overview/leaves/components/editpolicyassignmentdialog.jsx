"use client";

import React from "react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const roleOptions = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const statusOptions = [
  "Marketing",
  "Administration",
  "Finance",
  "HR",
  "IT",
  "Operations",
  "Sales",
  "Support",
  "Others",
].map((dept) => ({ value: dept, label: dept }));

const archeive = [
  {
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    department: "Marketing",
    job: "Account",
    shifttype: "Schedule",
  },
  {
    profile: "",
    firstname: "Jane",
    lastname: "Smith",
    department: "HR",
    job: "Officer",
    shifttype: "Schedule",
  },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile;
      return profileExists ? (
        <img
          src={row.original.profile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
          {row.original.firstname.charAt(0)}
          {row.original.lastname.charAt(0)}
        </div>
      );
    },
  },
  { accessorKey: "firstname", header: "First Name" },
  { accessorKey: "lastname", header: "Last Name" },
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
];

const EditPolicyAssignmentDialog = ({ onClose }) => {
  const table = useReactTable({
    data: archeive,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Get the count of selected rows
  const selectedRowCount = table.getSelectedRowModel().rows.length;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Policy Assignments</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Editing All Employees
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
              <SelectTrigger className="w-24 rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Display the count of selected rows */}
            <div className="font-custom mt-2">{selectedRowCount} selected</div>
          </div>

          {/* Right Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
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

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-4 py-2">
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
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="w-full h-[1px] bg-[#A6A6A6] mt-6"></div>
        <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
          <Button className="py-4 px-10 text-lg font-custom rounded-full">
            Finish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPolicyAssignmentDialog;
