"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
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
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { List, Plus, Trash2 } from "lucide-react";
import SuccessDialog from "./successdialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUsers, fetchUsers } from "@/lib/api/user";
import { getDepartmentsByBranch } from "@/lib/api/department";

export default function AddUserManuallyDialog({
  open,
  onOpenChange,
  branches,
  positions,
  workshift,
  workshiftLoading,
}) {
  const queryClient = useQueryClient();
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const countryCodes = [
    {
      code: "+855",
      flag: "https://flagcdn.com/w40/kh.png",
      name: "Cambodia",
    },
  ];

  const bankProviders = [
    {
      value: "aba",
      label: "ABA Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY2aqkYA54jTqgCQmP2Zl0W7BwjM_XQ7vjg&s",
    },
    {
      value: "acleda",
      label: "ACLEDA Bank",
      icon: "https://www.acledasecurities.com.kh/as/assets/listed_company/ABC/logo.png",
    },
    {
      value: "canadia",
      label: "Canadia Bank",
      icon: "https://play-lh.googleusercontent.com/hZhdx8AuJsmnZyy6rSLi3fZsWeOJ3qD5LRy2KmKOaXf8uWtsvrYScl_lxyhBsyan2-c",
    },
    {
      value: "ftb",
      label: "FTB Bank",
      icon: "https://play-lh.googleusercontent.com/dBXpI2QOfWndhjQKboqdt6sOdSeeGk_pxeXqVC8hHD-xCDQIKoD_MLHhVH51gb25F1rY",
    },
    {
      value: "wing",
      label: "Wing Bank",
      icon: "https://play-lh.googleusercontent.com/A8bangMCdTPS1Xa9hbuc4pcXxUspKpJhDHWW3QSw3OB-VMtUv6NCnqAd7pUv2C-2OnjJHn0Xmv1cs6c2hFUZMw",
    },
    {
      value: "phillip",
      label: "Phillip Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl5AQ8pKBWNSLy2jNDa3-4ie1RudZ81DUXgg&s",
    },
    {
      value: "sathapana",
      label: "Sathapana Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRttioRPdS1xu-MygwdD1Qb7wTmRAxAo4s0pg&s",
    },
    {
      value: "chipmong",
      label: "Chip Mong Bank",
      icon: "https://play-lh.googleusercontent.com/IwZLaZnWhlINs7AoIg7m7qNR-JNLInrme1xtrXkYoNxWwdTlWZozZnIligkyjUhiO0Q5",
    },
  ];

  const [serverError, setServerError] = useState("");

  const [data, setData] = useState(
    Array.from({ length: 1 }, (_, i) => ({
      id: i + 1,
      companyIdentifier: "",
      fullName: "",
      phone: "",
      branch: "",
      department: "",
      position: "",
      shiftType: "",
      dateOfBirth: "",
      gender: "",
      idCardNumber: "",
      isRequiredToCheckIn: "",
      salaryType: "",
      job: "",
      baseSalary: "",
      cash: "",
      ibanking: "",
      currencyType: "",
      bankProvider: "",
      bankAccount: "",
      spoused: "",
      numberOfChildren: "",
      otherName: "",
      nssfId: "",
      groups: "",
      allowedRemoteCheckIn: "",
      dailyRate: "",
      hourlyRate: "",
    }))
  );

  const [addedRowIds, setAddedRowIds] = useState([]);
  const [errorsMap, setErrorsMap] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleAddRow = useCallback(() => {
    const newId = Math.max(...data.map((d) => d.id), 0) + 1;
    const newRow = {
      id: newId,
      companyIdentifier: "",
      fullName: "",
      phone: "",
      branch: "",
      department: "",
      position: "",
      shiftType: "",
      dateOfBirth: "",
      gender: "",
      idCardNumber: "",
      isRequiredToCheckIn: "",
      salaryType: "",
      job: "",
      baseSalary: "",
      cash: "",
      ibanking: "",
      currencyType: "",
      bankProvider: "",
      bankAccount: "",
      spoused: "",
      numberOfChildren: "",
      otherName: "",
      nssfId: "",
      groups: "",
      allowedRemoteCheckIn: "",
      dailyRate: "",
      hourlyRate: "",
    };
    setData((prev) => [...prev, newRow]);
    setAddedRowIds((prev) => [...prev, newId]);
  }, [data]);

  const handleDeleteRow = useCallback((id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    setAddedRowIds((prev) => prev.filter((rowId) => rowId !== id));
  }, []);

  // Mutation fixed here
  const addUserMutation = useMutation({
    mutationFn: (users) => addUsers(users),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setData([
        {
          id: 1,
          companyIdentifier: "",
          fullName: "",
          phone: "",
          branch: "",
          department: "",
          position: "",
          shiftType: "",
          dateOfBirth: "",
          gender: "",
          idCardNumber: "",
          isRequiredToCheckIn: "",
          salaryType: "",
          job: "",
          baseSalary: "",
          cash: "",
          ibanking: "",
          currencyType: "",
          bankProvider: "",
          bankAccount: "",
          spoused: "",
          numberOfChildren: "",
          otherName: "",
          nssfId: "",
          groups: "",
          allowedRemoteCheckIn: "",
          dailyRate: "",
          hourlyRate: "",
        },
      ]);
      setAddedRowIds([]);
      setSuccessOpen(true);
    },
    onError: (error) => {
      setServerError(
        error?.response?.data?.error ?? "Failed to add users. Please try again."
      );
    },
  });

  // handle select shift REUSABLE COMPONENT
  function ShiftMultiSelect({ value = [], onChange, options = [] }) {
    const shifts = Array.isArray(options) ? options : options?.results ?? [];
    const selected = Array.isArray(value) ? value.map(String) : [];

    const [open, setOpen] = React.useState(false);

    const toggle = (id) => {
      onChange(
        selected.includes(id)
          ? selected.filter((v) => v !== id)
          : [...selected, id]
      );
    };

    const dialogContainer =
      typeof document !== "undefined"
        ? document.querySelector("[data-radix-dialog-content]")
        : null;

    return (
      <Select open={open} onOpenChange={setOpen}>
        <SelectTrigger className="w-full font-custom h-9 text-black">
          <SelectValue
            placeholder={
              selected.length ? `${selected.length} Selected` : "Select Shift"
            }
          />
        </SelectTrigger>

        <SelectContent
          container={dialogContainer}
          side="bottom"
          align="start"
          className="w-[var(--radix-select-trigger-width)] max-h-60 overflow-y-auto p-1 bg-white"
          onPointerDown={(e) => e.preventDefault()} // 🔑 prevent auto-close
        >
          {shifts.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              No shifts available
            </div>
          ) : (
            shifts.map((shift) => {
              const id = String(shift.id);
              const checked = selected.includes(id);

              return (
                <div
                  key={id}
                  onClick={() => toggle(id)}
                  className="flex w-full font-custom items-center gap-2 py-2 cursor-pointer rounded-sm hover:bg-gray-200"
                >
                  <Checkbox
                    className="rounded-none"
                    checked={checked}
                    onCheckedChange={() => toggle(id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm">{shift.name}</span>
                </div>
              );
            })
          )}
        </SelectContent>
      </Select>
    );
  }

  // cell reusable component
  function EditableInputCell({ row, field, value, onChange, error, ...props }) {
    const [localValue, setLocalValue] = React.useState(value ?? "");

    // Sync when row updates (row add/delete/reset)
    React.useEffect(() => {
      setLocalValue(value ?? "");
    }, [value]);

    return (
      <Input
        {...props}
        value={localValue}
        onChange={(e) => {
          const val = e.target.value;
          setLocalValue(val); // keep focus
          onChange(row.original.id, field, val); // update table state
        }}
        className={`${props.className} ${error ? "border-red-500" : ""}`}
      />
    );
  }

  const isRowComplete = (row) => {
    return (
      row.fullName.trim() &&
      row.phone.trim() &&
      row.branch.trim() &&
      row.department.trim() &&
      row.position.trim() &&
      row.job.trim() &&
      row.baseSalary.trim() &&
      row.cash.trim() &&
      row.ibanking.trim()
    );
  };

  const validateRows = useCallback((dataToValidate) => {
    const newErrors = {};

    dataToValidate.forEach((row) => {
      const rowErrors = {};

      // Required fields validation
      if (!row.companyIdentifier?.trim()) rowErrors.companyIdentifier = true;
      if (!row.fullName?.trim()) rowErrors.fullName = true;
      if (!row.phone?.trim() || !/^\d{8,15}$/.test(row.phone.trim()))
        rowErrors.phone = true;
      if (!row.gender?.trim()) rowErrors.gender = true;
      if (!row.dateOfBirth?.trim()) rowErrors.dateOfBirth = true;
      if (!row.branch?.trim()) rowErrors.branch = true;
      if (!row.department?.trim()) rowErrors.department = true;
      if (!row.shiftType || row.shiftType.length === 0)
        rowErrors.shiftType = true;
      if (!row.allowedRemoteCheckIn?.trim())
        rowErrors.allowedRemoteCheckIn = true;
      if (!row.isRequiredToCheckIn?.trim())
        rowErrors.isRequiredToCheckIn = true;
      if (!row.baseSalary || isNaN(Number(row.baseSalary)))
        rowErrors.baseSalary = true;
      if (!row.dailyRate || isNaN(Number(row.dailyRate)))
        rowErrors.dailyRate = true;
      if (!row.hourlyRate || isNaN(Number(row.hourlyRate)))
        rowErrors.hourlyRate = true;
      if (!row.salaryType?.trim()) rowErrors.salaryType = true;
      if (!row.bankProvider?.trim()) rowErrors.bankProvider = true;
      if (!row.nssfId?.trim()) rowErrors.nssfId = true;
      if (!row.bankAccount?.trim()) rowErrors.bankAccount = true;

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.id] = rowErrors;
      }
    });

    setErrorsMap(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleInputChange = useCallback(
    (id, field, value) => {
      setData((prevData) => {
        const newData = prevData.map((row) =>
          row.id === id ? { ...row, [field]: value } : row
        );
        // Validate immediately with the updated data
        validateRows(newData);

        return newData;
      });
    },
    [setData, validateRows]
  );

  // helper to format and submit data
  const isValidValue = (v) =>
    v !== undefined &&
    v !== null &&
    v !== "" &&
    !(Array.isArray(v) && v.length === 0);

  const cleanObject = (obj) =>
    Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => isValidValue(v))
        .map(([k, v]) => [
          k,
          typeof v === "object" && !Array.isArray(v) ? cleanObject(v) : v,
        ])
        .filter(([, v]) =>
          typeof v === "object" ? Object.keys(v).length > 0 : true
        )
    );

  // handle submit users
  const handleAddUsers = () => {
    if (!validateRows(data)) return;
    const formattedUsers = data.map((row) => {
      const user = {
        companyIdentifier: row.companyIdentifier,
        name: row.fullName,
        phoneNumber: row.phone.startsWith("855")
          ? row.phone
          : `855${row.phone.replace(/^0+/, "")}`,

        branch: row.branch,
        department: row.department,
        position: row.position,
        job: row.job,

        shiftType: Array.isArray(row.shiftType) ? row.shiftType : [],

        groups: row.groups,
        allowedRemoteCheckIn: row.allowedRemoteCheckIn,
        isRequiredToCheckIn: row.isRequiredToCheckIn,

        spoused: row.spoused === "true",
        numberOfChildren:
          row.numberOfChildren !== ""
            ? Number(row.numberOfChildren)
            : undefined,

        otherName: row.otherName,
        dateOfBirth: row.dateOfBirth,
        gender: row.gender,
        idCardNumber: row.idCardNumber,
        nssfId: row.nssfId,

        paymentMethod: {
          cashPercentage: row.cash !== "" ? Number(row.cash) : undefined,
          ibankingPercentage:
            row.ibanking !== "" ? Number(row.ibanking) : undefined,
        },

        salaryInfo: {
          baseSalary:
            row.baseSalary !== "" ? Number(row.baseSalary) : undefined,
          currencyType: row.currencyType,
          salaryType: row.salaryType,
          dailyRate: row.dailyRate !== "" ? Number(row.dailyRate) : undefined,
          hourlyRate:
            row.hourlyRate !== "" ? Number(row.hourlyRate) : undefined,
        },

        bankDetails: {
          bankProvider: row.bankProvider,
          accountNumber: row.bankAccount,
        },
      };

      return cleanObject(user);
    });

    console.log("Formatted Users to be added:", formattedUsers);

    addUserMutation.mutate(formattedUsers);
  };

  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(() => {
        setSuccessOpen(false);
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successOpen, onOpenChange]);

  const existingPhones = useMemo(() => {
    if (!usersData?.results) return new Set();
    return new Set(usersData.results.map((u) => u.phoneNumber));
  }, [usersData]);

  const getDuplicateCount = () => {
    const completeRows = data.filter(isRowComplete);
    const seen = new Map();
    let count = 0;

    for (const row of completeRows) {
      const phone = row.phone.startsWith("855")
        ? row.phone
        : `855${row.phone.replace(/^0+/, "")}`;

      // Check against previously entered rows
      if (seen.has(phone)) {
        count++;
        continue;
      }

      // Check against existing users from backend
      if (existingPhones.has(phone)) {
        count++;
        continue;
      }

      seen.set(phone, true);
    }

    return count;
  };

  const columns = useMemo(
    () => [
      {
        // will change ro this style later
        accessorKey: "companyIdentifier",
        header: "Company ID*",
        cell: ({ row }) => (
          <EditableInputCell
            row={row}
            field="companyIdentifier"
            value={row.original.companyIdentifier}
            error={errorsMap[row.original.id]?.companyIdentifier}
            onChange={handleInputChange}
            placeholder="Company ID"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400"
          />
        ),
      },
      {
        accessorKey: "Name",
        header: "Name*",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Input
              value={row.original.fullName}
              onChange={(e) =>
                handleInputChange(row.original.id, "fullName", e.target.value)
              }
              placeholder="Full Name"
              className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md border-gray-300 ${
                errorsMap[row.original.id]?.fullName ? "border-red-500" : ""
              }`}
            />
          </div>
        ),
      },
      {
        accessorKey: "Phone Number",
        header: "Phone Number*",
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
            </div>
          </div>
        ),
      },
      {
        accessorKey: "otherName",
        header: "Other Name",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.otherName}
            onChange={(e) =>
              handleInputChange(row.original.id, "otherName", e.target.value)
            }
            placeholder="Other Names"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "gender",
        header: "Gender*",
        cell: ({ row }) => (
          <Select
            value={row.original.gender}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "gender", value)
            }
          >
            <SelectTrigger
              className={`h-9 w-28 font-custom ${
                errorsMap[row.original.id]?.gender
                  ? "border-red-500"
                  : "border-gray-300"
              } text-black`}
            >
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="font-custom text-center">
              <SelectItem value="male">M</SelectItem>
              <SelectItem value="female">F</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "dateOfBirth",
        header: "Birthday*",
        cell: ({ row }) => (
          <Input
            type="date"
            value={row.original.dateOfBirth}
            onChange={(e) =>
              handleInputChange(row.original.id, "dateOfBirth", e.target.value)
            }
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md ${
              errorsMap[row.original.id]?.dateOfBirth ? "border-red-500" : ""
            }`}
          />
        ),
      },
      {
        accessorKey: "ID Card",
        id: "idCardNumber",
        header: "ID Card",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.idCardNumber}
            onChange={(e) =>
              handleInputChange(row.original.id, "idCardNumber", e.target.value)
            }
            placeholder="ID Card Number"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "branch",
        header: "Branch*",
        cell: ({ row }) => (
          <Select
            value={row.original.branch || ""}
            onValueChange={(branchId) => {
              handleInputChange(row.original.id, "branch", branchId);
              handleInputChange(row.original.id, "department", "");
            }}
          >
            <SelectTrigger
              className={`h-9 w-28 font-custom ${
                errorsMap[row.original.id]?.gender
                  ? "border-red-500"
                  : "border-gray-300"
              } text-black`}
            >
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {branches?.results?.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "department",
        header: "Department*",
        cell: ({ row }) => {
          const selectedBranchId = row.original.branch;
          const selectedDepartmentId = row.original.department || "";
          const { data: departmentsData = { results: [] }, isLoading } =
            useQuery({
              queryKey: ["departments", selectedBranchId],
              queryFn: () => getDepartmentsByBranch(selectedBranchId),
              enabled: !!selectedBranchId,
            });

          return (
            <Select
              value={selectedDepartmentId}
              onValueChange={(deptId) =>
                handleInputChange(row.original.id, "department", deptId)
              }
            >
              <SelectTrigger
                className={`w-full font-custom h-9 text-black placeholder:text-gray-400 ${
                  errorsMap[row.original.id]?.department
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>

              <SelectContent className="font-custom">
                {isLoading ? (
                  <SelectItem value="loading">
                    {" "}
                    <FaSpinner className="animate-spin text-white text-lg" />
                  </SelectItem>
                ) : departmentsData.results.length > 0 ? (
                  departmentsData.results.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    value="no-dept"
                    className="text-red-300 text-center"
                  >
                    Please select branch first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          );
        },
      },

      {
        accessorKey: "shiftType",
        header: "Shift Type*",
        cell: ({ row }) => (
          <ShiftMultiSelect
            value={row.original.shiftType || []}
            options={workshift?.results || []}
            onChange={(val) =>
              handleInputChange(row.original.id, "shiftType", val)
            }
          />
        ),
      },
      {
        accessorKey: "groups",
        header: "Groups",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.groups}
            onChange={(e) =>
              handleInputChange(row.original.id, "groups", e.target.value)
            }
            placeholder="Groups"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },

      {
        accessorKey: "Currency Type",
        header: "Currency Type",
        cell: ({ row }) => (
          <Select
            value={row.original.currencyType}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "currencyType", value)
            }
          >
            <SelectTrigger
              className={`h-9 w-28 font-custom ${
                errorsMap[row.original.id]?.currencyType
                  ? "border-red-500"
                  : "border-gray-300"
              } text-black`}
            >
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="font-custom text-center">
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="KHR">KHR</SelectItem>
            </SelectContent>
          </Select>
        ),
      },

      {
        accessorKey: "Salary Type",
        id: "salaryType",
        header: "Salary Type*",
        cell: ({ row }) => (
          <Select
            value={row.original.salaryType}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "salaryType", value)
            }
          >
            <SelectTrigger
              className={`h-9 w-28 font-custom ${
                errorsMap[row.original.id]?.salaryType
                  ? "border-red-500"
                  : "border-gray-300"
              } text-black`}
            >
              <SelectValue placeholder="Salary Type" />
            </SelectTrigger>
            <SelectContent className="font-custom text-center">
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "Base Salary",
        header: "Base Salary*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.baseSalary ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "baseSalary", value);
              }
            }}
            placeholder="Base Salary"
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                   errorsMap[row.original.id]?.baseSalary
                     ? "border-red-500"
                     : ""
                 }`}
          />
        ),
      },
      {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => (
          <Select
            value={row.original.position}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "position", value)
            }
          >
            <SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
              <SelectValue placeholder="Select Position" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {positions?.results?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "Job Title",
        id: "job",
        header: "Job",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.job}
            onChange={(e) =>
              handleInputChange(row.original.id, "job", e.target.value)
            }
            placeholder="Job Title"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "cash",
        header: "Cash*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.cash ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "cash", value);
              }
            }}
            placeholder="Cash"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ),
      },
      {
        accessorKey: "ibanking",
        header: "IBanking*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.ibanking ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "ibanking", value);
              }
            }}
            placeholder="iBanking"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ),
      },
      {
        accessorKey: "dailyRate",
        header: "Daily Rate*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.dailyRate ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "dailyRate", value);
              }
            }}
            placeholder="Daily Rate"
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                   errorsMap[row.original.id]?.dailyRate ? "border-red-500" : ""
                 }`}
          />
        ),
      },
      {
        accessorKey: "hourlyRate",
        header: "Hourly Rate*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.hourlyRate ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "hourlyRate", value);
              }
            }}
            placeholder="Hourly Rate"
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                   errorsMap[row.original.id]?.hourlyRate
                     ? "border-red-500"
                     : ""
                 }`}
          />
        ),
      },
      {
        accessorKey: "Bank Provider",
        id: "bankProvider",
        header: "Bank Provider*",
        cell: ({ row }) => {
          const selected = bankProviders.find(
            (bank) => bank.value === row.original.bankProvider
          );

          return (
            <Select
              value={row.original.bankProvider}
              onValueChange={(value) =>
                handleInputChange(row.original.id, "bankProvider", value)
              }
            >
              <SelectTrigger
                className={`w-full font-custom h-9 text-black placeholder:text-gray-400 ${
                  errorsMap[row.original.id]?.bankProvider
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select Bank Provider">
                  {selected ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={selected.icon}
                        alt={selected.label}
                        width={20}
                        height={20}
                        className="object-contain rounded-sm"
                      />
                      <span>{selected.label}</span>
                    </div>
                  ) : (
                    "Select Bank Provider"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="font-custom">
                {bankProviders.map((bank) => (
                  <SelectItem key={bank.value} value={bank.value}>
                    <div className="flex items-center gap-2">
                      <img
                        src={bank.icon}
                        alt={bank.label}
                        width={20}
                        height={20}
                        className="object-contain rounded-sm"
                      />
                      <span>{bank.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: "Bank Account ",
        id: "bankAccount",
        header: "Account Number*",
        cell: ({ row }) => (
          <Input
            value={row.original.bankAccount}
            onChange={(e) =>
              handleInputChange(row.original.id, "bankAccount", e.target.value)
            }
            placeholder="Account Number"
            className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md ${
              errorsMap[row.original.id]?.bankAccount
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        ),
      },
      {
        accessorKey: "spoused",
        header: "Spoused",
        cell: ({ row }) => (
          <Select
            value={row.original.spoused}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "spoused", value)
            }
          >
            <SelectTrigger className="h-9 w-28 font-custom text-black border-gray-300">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "Children",
        id: "numberOfChildren",
        header: "Children",
        cell: ({ row }) => (
          <Input
            type="number"
            min="0"
            value={row.original.numberOfChildren}
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "numberOfChildren",
                e.target.value
              )
            }
            placeholder="0"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
          />
        ),
      },
      {
        accessorKey: "NSSF ID",
        id: "nssfId",
        header: "NSSF ID*",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.nssfId}
            onChange={(e) =>
              handleInputChange(row.original.id, "nssfId", e.target.value)
            }
            placeholder="NSSF ID"
            className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md ${
              errorsMap[row.original.id]?.nssfId
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
        ),
      },
      {
        accessorKey: "location",
        id: "allowedRemoteCheckIn",
        header: "Location*",
        cell: ({ row }) => (
          <Select
            value={row.original.allowedRemoteCheckIn}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "allowedRemoteCheckIn", value)
            }
          >
            <SelectTrigger className="h-9 w-32 font-custom text-black border-gray-300">
              <SelectValue placeholder="Required CheckIn" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              <SelectItem value="true">Flexible</SelectItem>
              <SelectItem value="false">Geofencing</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "Required Attendance",
        id: "isRequiredToCheckIn",
        header: "Required Attendance*",
        cell: ({ row }) => (
          <Select
            value={row.original.isRequiredToCheckIn}
            onValueChange={(value) =>
              handleInputChange(row.original.id, "isRequiredToCheckIn", value)
            }
          >
            <SelectTrigger className="h-9 w-32 font-custom text-black border-gray-300">
              <SelectValue placeholder="Required CheckIn" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
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
              <DropdownMenuContent className="bg-white shadow-md border p-2 font-custom max-h-60 overflow-y-auto">
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
    [handleInputChange, handleDeleteRow, branches, workshift, workshiftLoading]
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
        // Required fields - visible by default
        companyIdentifier: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        branch: true,
        department: true,
        shiftType: true,
        allowedRemoteCheckIn: true,
        baseSalary: true,
        cash: true,
        ibanking: true,
        dailyRate: true,
        hourlyRate: true,
        salaryType: true,
        bankProvider: true,
        nssfId: true,
        bankAccount: true,
        filter: true,

        // Optional fields - hidden by default
        otherName: false,
        idCardNumber: false,
        position: false,
        job: false,
        groups: false,
        currencyType: false,
        spoused: false,
        numberOfChildren: false,
      },
    },
  });

  const duplicateCount = getDuplicateCount();
  const addedCount = addedRowIds.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader className="text-center">
            <DialogTitle className="sr-only">Add New User</DialogTitle>
            <div className="flex items-center justify-center space-x-3">
              <h1 className="text-2xl font-custom text-light-gray">Review</h1>
            </div>

            {(addedCount > 0 || duplicateCount > 0) && (
              <div className="flex justify-start gap-6 pt-2 pl-2">
                {addedCount > 0 && (
                  <p className="text-blue-500 font-medium text-sm">
                    {addedCount} Added
                  </p>
                )}
                {duplicateCount > 0 && (
                  <p className="text-red-500 font-medium text-sm">
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

          {/*  Add Row Button      */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleAddRow}
              className="bg-white border rounded-full text-blue-500 hover:bg-blue-100 flex items-center space-x-2 font-custom py-2 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Row</span>
            </Button>
          </div>
          {serverError && (
            <p className="text-red-500 text-sm font-custom mb-2">
              {serverError}
            </p>
          )}

          <p className="text-red-500 text-sm font-custom text-right">
            Please fill all the require information*
          </p>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-gray-300 text-blue-500 hover:bg-gray-100 font-custom py-6 px-9"
            >
              Cancel
            </Button>

            <Button
              onClick={handleAddUsers}
              disabled={
                addUserMutation.isPending ||
                (errorsMap && Object.keys(errorsMap).length > 0)
              }
              className={`rounded-full font-custom py-6 px-9 text-white transition-colors
              ${
                addUserMutation.isPending
                  ? "bg-gray-400 cursor-wait"
                  : errorsMap && Object.keys(errorsMap).length > 0
                  ? "bg-red-500 hover:bg-red-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {addUserMutation.isPending ? (
                <FaSpinner className="animate-spin text-white text-lg" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
