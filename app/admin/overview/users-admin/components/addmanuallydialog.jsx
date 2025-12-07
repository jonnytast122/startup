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
import { FaSpinner } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { List, Plus, Trash2 } from "lucide-react";
import SuccessDialog from "./successdialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBranches, fetchDepartmentsByBranch } from "@/lib/api/branch";
import { fetchPositions } from "@/lib/api/position";
import { fetchWorkShift } from "@/lib/api/work-shift";
import { fetchCompany } from "@/lib/api/company";
import { addUsers, fetchUsers } from "@/lib/api/user";
import { getDepartmentsByBranch } from "@/lib/api/department";

export default function AddUserManuallyDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: workshift, isLoading: workshiftLoading } = useQuery({
    queryKey: ["workShift", company?.id],
    queryFn: () => fetchWorkShift(company?.id),
    enabled: !!company?.id,
  });

  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const [data, setData] = useState(
    Array.from({ length: 1 }, (_, i) => ({
      id: i + 1,
      companyId: "",
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
      baseSalaryKHR: "",
      cash: "",
      cashKHR: "",
      ibanking: "",
      ibankingKHR: "",
      currencyType: "",
      bankProvider: "",
      bankAccount: "",
      spoused: "",
      numberOfChildren: "",
      otherName: "",
      nssfId: "",
      groups: "",
      geofencing: "",
      regularHourDailyRate: "",
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
      companyId: "",
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
      baseSalaryKHR: "",
      cash: "",
      cashKHR: "",
      ibanking: "",
      ibankingKHR: "",
      currencyType: "",
      bankProvider: "",
      bankAccount: "",
      spoused: "",
      numberOfChildren: "",
      otherName: "",
      nssfId: "",
      groups: "",
      geofencing: "",
      regularHourDailyRate: "",
      hourlyRate: "",
    };
    setData((prev) => [...prev, newRow]);
    setAddedRowIds((prev) => [...prev, newId]);
  }, [data]);

  const handleDeleteRow = useCallback((id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
    setAddedRowIds((prev) => prev.filter((rowId) => rowId !== id));
  }, []);

  // ✅ Mutation fixed here
  const addUserMutation = useMutation({
    mutationFn: (users) => addUsers(users),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setData([
        {
          id: 1,
          companyId: "",
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
          baseSalaryKHR: "",
          cash: "",
          cashKHR: "",
          ibanking: "",
          ibankingKHR: "",
          currencyType: "",
          bankProvider: "",
          bankAccount: "",
          spoused: "",
          numberOfChildren: "",
          otherName: "",
          nssfId: "",
          groups: "",
          geofencing: "",
          regularHourDailyRate: "",
          hourlyRate: "",
        },
      ]);
      setAddedRowIds([]);
      setSuccessOpen(true);
    },
    onError: (error) => {
      console.error("Failed to add users:", error);
    },
  });

  const countryCodes = [
    { code: "+855", flag: "https://flagcdn.com/w40/kh.png", name: "Cambodia" },
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
      if (!row.companyId?.trim()) rowErrors.companyId = true;
      if (!row.fullName?.trim()) rowErrors.fullName = true;
      if (!row.phone?.trim() || !/^\d{8,15}$/.test(row.phone.trim()))
        rowErrors.phone = true;
      if (!row.gender?.trim()) rowErrors.gender = true;
      if (!row.dateOfBirth?.trim()) rowErrors.dateOfBirth = true;
      if (!row.branch?.trim()) rowErrors.branch = true;
      if (!row.department?.trim()) rowErrors.department = true;
      if (!row.shiftType || row.shiftType.length === 0) rowErrors.shiftType = true;
      if (!row.geofencing?.trim()) rowErrors.geofencing = true;
      if (!row.isRequiredToCheckIn?.trim())
        rowErrors.isRequiredToCheckIn = true;
      if (!row.baseSalary || isNaN(Number(row.baseSalary)))
        rowErrors.baseSalary = true;
      if (!row.regularHourDailyRate || isNaN(Number(row.regularHourDailyRate)))
        rowErrors.regularHourDailyRate = true;
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

  const handleAddUsers = () => {
    if (!validateRows(data)) {
      return;
    }

    const formattedUsers = data.map((row) => ({
      companyId: row.companyId,
      name: row.fullName,
      phoneNumber: row.phone.startsWith("855")
        ? row.phone
        : `855${row.phone.replace(/^0+/, "")}`,
      branch: row.branch || null,
      department: row.department || null,
      position: row.position || null,
      job: row.job || null,
      shiftType: row.shiftType,
      groups: row.groups || null,
      geofencing: row.geofencing,
      spoused: row.spoused === "true",
      numberOfChildren: Number(row.numberOfChildren) || 0,
      otherName: row.otherName || null,
      dateOfBirth: row.dateOfBirth || null,
      gender: row.gender || null,
      idCardNumber: row.idCardNumber || null,
      isRequiredToCheckIn: row.isRequiredToCheckIn,
      nssfId: row.nssfId,
      paymentMethod: {
        cashPercentage: Number(row.cash) || 0,
        cashKHR: Number(row.cashKHR) || 0,
        ibankingPercentage: Number(row.ibanking) || 0,
        ibankingKHR: Number(row.ibankingKHR) || 0,
      },
      salaryInfo: {
        baseSalary: Number(row.baseSalary),
        baseSalaryKHR: Number(row.baseSalaryKHR) || 0,
        currencyType: row.currencyType,
        salaryType: row.salaryType,
        regularHourDailyRate: Number(row.regularHourDailyRate),
        hourlyRate: Number(row.hourlyRate),
      },
      bankDetails: {
        bankProvider: row.bankProvider,
        accountNumber: row.bankAccount,
      },
    }));
    addUserMutation.mutate(formattedUsers, {
      onSuccess: () => {
        setIsPending(false);
        setSuccessOpen(true);
      },

      onError: (error) => {
        setIsPending(false);
        const apiErrors = {};

        const msg = error?.response?.data?.error;
        if (msg) {
          // Detect if it’s a phone number error
          if (msg.toLowerCase().includes("phone")) {
            // Highlight the phone field in the matching row
            const phoneMatch = msg.match(/\d{8,15}/); // extract the number
            if (phoneMatch) {
              const phoneNumber = phoneMatch[0];
              const row = data.find((r) => {
                const formattedPhone = r.phone.startsWith("855")
                  ? r.phone
                  : `855${r.phone.replace(/^0+/, "")}`;
                return formattedPhone === phoneNumber;
              });

              if (row) {
                apiErrors[row.id] = {
                  phone: true,
                  message: msg,
                };
              }
            }
          } else {
          }
        }
        setErrorsMap(apiErrors);
      },
    });
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
        accessorKey: "companyId",
        header: "Company ID*",
        cell: ({ row }) => (
          <Input
            value={row.original.companyId}
            onChange={(e) =>
              handleInputChange(row.original.id, "companyId", e.target.value)
            }
            placeholder="Company ID"
            className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md border-gray-300 ${
              errorsMap[row.original.id]?.companyId ? "border-red-500" : ""
            }`}
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
              className={`w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 ${
                errorsMap[row.original.id]?.branch ? "border-red-500" : ""
              }`}
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
        accessorKey: "Shift Type",
        header: "Shift Type*",
        cell: ({ row }) => {
          const selectedShiftIds = row.original.shiftType || [];

          const handleToggleShift = (shiftId) => {
            let updatedShifts;
            if (selectedShiftIds.includes(shiftId)) {
              updatedShifts = selectedShiftIds.filter((id) => id !== shiftId);
            } else {
              updatedShifts = [...selectedShiftIds, shiftId];
            }
            handleInputChange(row.original.id, "shiftType", updatedShifts);
          };

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full h-9 justify-between font-custom text-black border-gray-300 ${
                    errorsMap[row.original.id]?.shiftType
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  {selectedShiftIds.length > 0 ? (
                    `${selectedShiftIds.length} Selected`
                  ) : workshiftLoading ? (
                    <FaSpinner className="animate-spin text-blue text-lg items-center text-center" />
                  ) : (
                    "Select Shift Type"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] max-h-[200px] overflow-y-auto p-2">
                {workshiftLoading ? (
                  <FaSpinner className="animate-spin text-white text-lg" />
                ) : (
                  workshift?.results?.results?.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center space-x-2 p-1 cursor-pointer hover:bg-gray-100 rounded-md bg-white"
                      onClick={() => handleToggleShift(shift.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedShiftIds.includes(shift.id)}
                        readOnly
                      />
                      <label className="text-sm font-custom">
                        {shift.name}
                      </label>
                    </div>
                  ))
                )}
              </PopoverContent>
            </Popover>
          );
        },
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
        accessorKey: "geofencing",
        header: "Geofencing*",
        cell: ({ row }) => (
          <Input
            type="text"
            value={row.original.geofencing}
            onChange={(e) =>
              handleInputChange(row.original.id, "geofencing", e.target.value)
            }
            placeholder="Geofencing"
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md ${
              errorsMap[row.original.id]?.geofencing ? "border-red-500" : ""
            }`}
          />
        ),
      },
      {
        accessorKey: "Base Salary",
        header: "Base Salary USD*",
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
        accessorKey: "baseSalaryKHR",
        header: "Base Salary KHR",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.baseSalaryKHR ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "baseSalaryKHR", value);
              }
            }}
            placeholder="Base Salary KHR"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <SelectTrigger className={`w-full font-custom h-9 text-black placeholder:text-gray-400 ${
                errorsMap[row.original.id]?.department
                  ? "border-red-500"
                  : "border-gray-300"
              }`}>
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
                  <SelectItem value="no-dept">No departments</SelectItem>
                )}
              </SelectContent>
            </Select>
          );
        },
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
        header: "Cash USD",
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
            placeholder="Cash USD"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ),
      },
      {
        accessorKey: "ibanking",
        header: "IBanking USD",
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
        accessorKey: "ibankingKHR",
        header: "IBanking KHR",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.ibankingKHR ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "ibankingKHR", value);
              }
            }}
            placeholder="iBanking KHR"
            className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ),
      },
      {
        accessorKey: "regularHourDailyRate",
        header: "Regular Hour Daily Rate USD*",
        cell: ({ row }) => (
          <Input
            type="number"
            inputMode="numeric"
            min="0"
            step="any"
            value={row.original.regularHourDailyRate ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                handleInputChange(row.original.id, "regularHourDailyRate", value);
              }
            }}
            placeholder="Regular Hour Daily Rate USD"
            className={`font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                   errorsMap[row.original.id]?.regularHourDailyRate
                     ? "border-red-500"
                     : ""
                 }`}
          />
        ),
      },
      {
        accessorKey: "hourlyRate",
        header: "Hourly Rate USD*",
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
            placeholder="Hourly Rate USD"
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
              <SelectTrigger className={`w-full font-custom h-9 text-black placeholder:text-gray-400 ${
                errorsMap[row.original.id]?.bankProvider
                  ? "border-red-500"
                  : "border-gray-300"
              }`}>
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
        // Required fields - visible by default
        companyId: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        branch: true,
        department: true,
        shiftType: true,
        geofencing: true,
        baseSalary: true,
        regularHourDailyRate: true,
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
        baseSalaryKHR: false,
        currencyType: false,
        cash: false,
        ibanking: false,
        ibankingKHR: false,
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
                isPending || (errorsMap && Object.keys(errorsMap).length > 0)
              }
              className={`rounded-full font-custom py-6 px-9 text-white transition-colors
                  ${
                    isPending
                      ? "bg-gray-400 cursor-wait"
                      : errorsMap && Object.keys(errorsMap).length > 0
                      ? "bg-red-500 hover:bg-red-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
            >
              {isPending ? (
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
