"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";

// Sample users
const users = [
  {
    id: 1,
    profile: "/avatars/alex.png",
    firstname: "Lucy",
    lastname: "Trevo",
    department: "Marketing",
    title: "Accountant",
    status: "active",
  },
  {
    id: 2,
    profile: "/avatars/sara.png",
    firstname: "John",
    lastname: "Mark",
    department: "Marketing",
    title: "Marketing",
    status: "active",
  },
  {
    id: 3,
    profile: "/avatars/emily.png",
    firstname: "Doe",
    lastname: "Ibrahim",
    department: "Officer",
    title: "HR",
    status: "inactive",
  },
  {
    id: 4,
    profile: "/avatars/luna.png",
    firstname: "Luke",
    lastname: "Kai",
    department: "Officer",
    title: "General",
    status: "active",
  },
  {
    id: 5,
    profile: "/avatars/omar.png",
    firstname: "Bob",
    lastname: "Mako",
    department: "Marketing",
    title: "Accountant",
    status: "inactive",
  },
];

const FilterOptions = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const UsersDialog = ({ open, onOpenChange }) => {
  const [selectedRows, setSelectedRows] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleRow = (rowId) => {
    setSelectedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const toggleAll = (checked, rows) => {
    const updated = {};
    rows.forEach((row) => {
      updated[row.id] = checked;
    });
    setSelectedRows(updated);
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const columns = [
    {
      id: "select",
      header: ({ table }) => {
        const allRows = table.getRowModel().rows;
        const allChecked =
          allRows.length > 0 &&
          allRows.every((row) => selectedRows[row.original.id]);
        return (
          <Checkbox
            checked={allChecked}
            onCheckedChange={(val) =>
              toggleAll(
                val,
                table.getRowModel().rows.map((r) => r.original)
              )
            }
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={!!selectedRows[row.original.id]}
          onCheckedChange={() => toggleRow(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "profile",
      header: "Profile",
      cell: ({ row }) => {
        const [imageError, setImageError] = React.useState(false);
        const profile = row.original.profile;
        const firstInitial = row.original.firstname?.[0]?.toUpperCase() ?? "";
        const lastInitial = row.original.lastname?.[0]?.toUpperCase() ?? "";

        return (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {profile && !imageError ? (
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-xs text-gray-700 font-semibold">
                {firstInitial}
                {lastInitial}
              </span>
            )}
          </div>
        );
      },
    },
    { accessorKey: "firstname", header: "First Name" },
    { accessorKey: "lastname", header: "Last Name" },
    { accessorKey: "department", header: "Department" },
    {
      accessorKey: "title",
      header: "Job",
      cell: ({ row }) => (
        <span className="px-2 py-0.5 border border-blue-400 text-blue-600 rounded-full text-xs sm:text-sm font-medium">
          {row.original.title}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Filtering logic
  const filteredUsers = users.filter((u) => {
    const matchesName = `${u.firstname} ${u.lastname}`
      .toLowerCase()
      .includes(globalFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : u.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-5xl lg:max-w-6xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-base sm:text-lg md:text-xl lg:text-2xl py-4">
            Group settings
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        {/* 🔎 Search + Filter + Selected count */}
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="font-custom text-sm text-[#3F4648] whitespace-nowrap">
              Search name:
            </label>
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Type name..."
              className="w-40 sm:w-56 md:w-64 font-custom"
            />
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger className="w-28 font-custom rounded-full flex items-center gap-2 text-[#5494DA]">
                <ListFilter size={16} />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="font-custom">
                {FilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm font-custom text-gray-600 whitespace-nowrap">
              {selectedCount} selected
            </span>
          </div>
        </div>

        {/* ✅ Small screens → Card layout */}
        <div className="block lg:hidden space-y-3">
          {/* Select All card */}
          <div className="p-3 border rounded-lg mb-3 flex items-center gap-3 bg-white">
            <Checkbox
              checked={
                filteredUsers.length > 0 &&
                filteredUsers.every((u) => selectedRows[u.id])
              }
              onCheckedChange={(val) => toggleAll(val, filteredUsers)}
            />
            <span className="font-custom text-sm">Select All</span>
          </div>

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-start gap-3 border rounded-xl p-3 shadow-sm"
            >
              <Checkbox
                checked={!!selectedRows[user.id]}
                onCheckedChange={() => toggleRow(user.id)}
                className="mt-3"
              />
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                  <img
                    src={user.profile}
                    alt={user.firstname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-custom text-sm font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{user.department}</span>
                    <span className="text-gray-400">•</span>
                    <span className="px-2 py-0.5 border border-blue-400 text-blue-600 rounded-full text-xs font-medium">
                      {user.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Large screens → Table layout */}
        <div className="hidden lg:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-2 text-xs sm:text-sm md:text-base lg:text-base font-custom"
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
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={selectedRows[user.id] ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={!!selectedRows[user.id]}
                      onCheckedChange={() => toggleRow(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden font-custom">
                      <img
                        src={user.profile}
                        alt={user.firstname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm md:text-base lg:text-base font-custom">{user.firstname}</TableCell>
                  <TableCell className="text-xs sm:text-sm md:text-base lg:text-base font-custom">{user.lastname}</TableCell>
                  <TableCell className="text-xs sm:text-sm md:text-base lg:text-base font-custom">{user.department}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 border border-blue-400 text-blue-600 rounded-full text-xs sm:text-sm md:text-base lg:text-base font-custom">
                      {user.title}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsersDialog;
