"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { List, Plus, Trash2 } from "lucide-react";
import SuccessDialog from "./successdialog";

export default function AddUserDialog({ open, onClose }) {
  const [data, setData] = useState(
    Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      profile: "",
      fullName: "",
      phone: "",
      branch: "",
      shiftType: "",
      accessLevel: "user",
      cash: 0,
      dateadded: "",
      lastlogin: "",
      bankname: "",
      banknumber: "",
      status: "active",
    }))
  );
  const [addedRowIds, setAddedRowIds] = useState([]);
  const [errorsMap, setErrorsMap] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  const handleAddRow = useCallback(() => {
    const newId = Math.max(...data.map((d) => d.id), 0) + 1;
    const newRow = {
      id: newId,
      profile: "",
      fullName: "",
      phone: "",
      branch: "",
      shiftType: "",
      accessLevel: "user",
      cash: 0,
      dateadded: "",
      lastlogin: "",
      bankname: "",
      banknumber: "",
      status: "active",
    };
    setData((prev) => [...prev, newRow]);
    setAddedRowIds((prev) => [...prev, newId]);
  }, [data]);

  const handleDeleteRow = useCallback((id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    setAddedRowIds((prev) => prev.filter((rowId) => rowId !== id));
  }, []);

  const handleInputChange = useCallback((id, field, value) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }, []);

  const isRowComplete = (row) => {
    return (
      row.fullName.trim() &&
      row.phone.trim() &&
      row.branch.trim() &&
      row.shiftType.trim() &&
      String(row.cash).trim() &&
      row.bankname.trim() &&
      row.banknumber.trim()
    );
  };

  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(() => {
        setSuccessOpen(false);
        onClose();
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [successOpen, onClose]);

  const getDuplicateCount = () => {
    const completeRows = data.filter(isRowComplete);
    const seen = new Map();
    let count = 0;

    for (const row of completeRows) {
      const key = JSON.stringify([
        row.fullName,
        row.phone,
        row.branch,
        row.shiftType,
        row.cash,
        row.bankname,
        row.banknumber,
      ]);
      if (seen.has(key)) {
        count++;
      } else {
        seen.set(key, true);
      }
    }

    return count;
  };

  const countryCodes = [
    { code: "+855", flag: "https://flagcdn.com/w40/kh.png", name: "Cambodia" },
    { code: "+81", flag: "https://flagcdn.com/w40/jp.png", name: "Japan" },
    {
      code: "+82",
      flag: "https://flagcdn.com/w40/kr.png",
      name: "South Korea",
    },
    { code: "+60", flag: "https://flagcdn.com/w40/my.png", name: "Malaysia" },
    {
      code: "+63",
      flag: "https://flagcdn.com/w40/ph.png",
      name: "Philippines",
    },
    { code: "+65", flag: "https://flagcdn.com/w40/sg.png", name: "Singapore" },
    { code: "+66", flag: "https://flagcdn.com/w40/th.png", name: "Thailand" },
    { code: "+84", flag: "https://flagcdn.com/w40/vn.png", name: "Vietnam" },
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => (
          <Input
            value={row.original.fullName}
            onChange={(e) =>
              handleInputChange(row.original.id, "fullName", e.target.value)
            }
            placeholder="Full Name"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            <Select
              value={row.original.countryCode || "+855"}
              onValueChange={(code) =>
                handleInputChange(row.original.id, "countryCode", code)
              }
            >
              <SelectTrigger className="w-[115px] h-9 border-gray-300 font-custom text-black placeholder:text-gray-400 rounded-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-4 h-4"
                      />
                      {country.code}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Input
                value={row.original.phone}
                onChange={(e) =>
                  handleInputChange(row.original.id, "phone", e.target.value)
                }
                placeholder="Phone Number"
                className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md border-gray-300 ${
                  errorsMap[row.original.id]?.phone ? "border-red-500" : ""
                }`}
              />
              {errorsMap[row.original.id]?.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errorsMap[row.original.id]?.phone}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: ({ row }) => (
          <Input
            value={row.original.branch}
            onChange={(e) =>
              handleInputChange(row.original.id, "branch", e.target.value)
            }
            placeholder="Branch"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        cell: ({ row }) => (
          <Select
            value={row.original.shiftType}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "shiftType", value)
            }
          >
            <SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
              <SelectValue placeholder="Select Shift Type" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "cash",
        header: "Cash",
        cell: ({ row }) => (
          <Input
            type="number"
            value={row.original.cash}
            onChange={(e) =>
              handleInputChange(row.original.id, "cash", e.target.value)
            }
            placeholder="Cash"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "bankname",
        header: "Bank Name",
        cell: ({ row }) => (
          <Input
            value={row.original.bankname}
            onChange={(e) =>
              handleInputChange(row.original.id, "bankname", e.target.value)
            }
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "banknumber",
        header: "Bank Account",
        cell: ({ row }) => (
          <Input
            value={row.original.banknumber}
            onChange={(e) =>
              handleInputChange(row.original.id, "banknumber", e.target.value)
            }
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        id: "actions",
        header: ({ table }) => (
          <div className="flex justify-end pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <List size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-md border p-2 font-custom">
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide() && column.id !== "actions"
                  )
                  .map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 py-1 cursor-pointer rounded-md text-md"
                      onClick={() => column.toggleVisibility()}
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={() => column.toggleVisibility()}
                        className="accent-blue-400 w-4 h-4 rounded border-gray-300"
                      />
                      <span className="capitalize">{column.id}</span>
                    </div>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end gap-1 pr-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteRow(row.original.id)}
              className="text-black hover:text-red-500 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ),
      },
    ],
    [handleInputChange, handleDeleteRow]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      handleInputChange,
      data,
    },
    initialState: {
      pagination: { pageSize: 25 },
      columnVisibility: {
        fullName: true,
        phone: true,
        title: false,
        banktransfer: false,
        branch: true,
        shiftType: true,
        cash: false,
        bankname: false,
        banknumber: false,
        filter: true,
      },
    },
  });

  const duplicateCount = getDuplicateCount();
  const addedCount = addedRowIds.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl">
          <DialogHeader className="text-center">
            <DialogTitle className="sr-only">Add New User</DialogTitle>
            <div className="flex items-center justify-center space-x-3">
              <h1 className="text-2xl font-custom text-light-gray">
                Step 2: Review
              </h1>
            </div>
            {(addedCount > 0 || duplicateCount > 0) && (
              <div className="flex justify-start gap-6 pt-2 pl-2">
                {addedCount > 0 && (
                  <p className="text-red-500 font-medium text-sm">
                    {addedCount} Added
                  </p>
                )}
                {duplicateCount > 0 && (
                  <p className="text-blue-500 font-medium text-sm">
                    {duplicateCount} Duplicated
                  </p>
                )}
              </div>
            )}
          </DialogHeader>

          <div className="mt-6 overflow-x-auto">
            <Table className="w-full min-w-max rounded-lg overflow-hidden">
              <TableHeader className="bg-[#e4e4e4] rounded-lg font-custom text-md">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={
                          header.id === "actions" ? "w-[60px]" : "min-w-[100px]"
                        }
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
                      <TableCell key={cell.id}>
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

          <div className="flex justify-center mt-4">
            <Button
              onClick={handleAddRow}
              className="bg-white border rounded-full text-blue-500 hover:bg-blue-100 flex items-center space-x-2 font-custom py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Row</span>
            </Button>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-full border border-gray-300 text-blue-500 hover:bg-gray-100 font-custom py-6 px-9"
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setSuccessOpen(true);
              }}
              className="rounded-full bg-blue-500 text-white hover:bg-blue-600 font-custom py-6 px-9"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          onClose();
        }}
      />
      ;
    </>
  );
}
