"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const ProfileCell = ({ profileImg, employeeName }) => {
  const nameParts = employeeName.split(" ");
  const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() ?? "";
  const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() ?? "";

  return (
    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
      {profileImg ? (
        <img
          src={profileImg}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-gray-600 font-medium">
          {firstNameInitial}
          {lastNameInitial}
        </span>
      )}
    </div>
  );
};

function UsersScreen({
  users,
  selectedUsers = [],
  setSelectedUsers,
  isViewMode = false,
}) {
  const [safeSelectedUsers, setSafeSelectedUsers] = useState(() => {
    return Array.isArray(selectedUsers)
      ? selectedUsers.map((user) => String(user.employee?.id || user.id))
      : [];
  });

  const toggleUserSelection = (id) => {
    if (isViewMode) return;

    const updated = safeSelectedUsers.includes(id)
      ? safeSelectedUsers.filter((u) => u !== id)
      : [...safeSelectedUsers, id];

    setSafeSelectedUsers(updated);
    setSelectedUsers?.(updated);
  };

  // ✅ Filter users for view mode
  const filteredUsers = useMemo(() => {
    if (!isViewMode) return users;
    return users.filter((u) =>
      safeSelectedUsers.includes(String(u.employee?.id || u.id))
    );
  }, [users, isViewMode, safeSelectedUsers]);

  const columns = [
    ...(!isViewMode
      ? [
          {
            id: "select",
            header: "",
            cell: ({ row }) => {
              const id = String(row.original.employee?.id || row.original.id);
              return (
                <div className="flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-4 h-4"
                    checked={safeSelectedUsers.includes(id)}
                    onChange={() => toggleUserSelection(id)}
                  />
                </div>
              );
            },
          },
        ]
      : []),
    {
      accessorKey: "profile",
      header: "",
      cell: ({ row }) => (
        <ProfileCell
          profileImg={row.original.profileImg}
          employeeName={row.original.employee?.name || ""}
        />
      ),
    },
    {
      accessorFn: (row) => row.employee?.name || "",
      id: "name",
      header: "Fullname",
    },
    {
      accessorKey: "nameInKhmer",
      header: "Name in Khmer",
    },
    {
      accessorFn: (row) => row.employee?.phoneNumber || "",
      id: "phone",
      header: "Phone",
    },
    {
      accessorFn: (row) => row.branch?.name || "",
      id: "branch",
      header: "Branch",
    },
    {
      accessorFn: (row) => row.department?.name || "",
      id: "department",
      header: "Department",
    },
    {
      accessorKey: "job",
      header: "Job",
    },
    {
      accessorFn: (row) => row.position?.title || "",
      id: "position",
      header: "Position",
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const groups = row.original.groups || [];
        if (groups.length === 0) return "-";
        if (groups.length === 1) return groups[0].name;
        return `${groups.length} Groups`;
      },
    },
    {
      accessorKey: "startDate",
      header: "Employment Date",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? format(new Date(value), "dd/MM/yyyy") : "-";
      },
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <div className="rounded-md border mt-6 font-custom">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UsersScreen;
