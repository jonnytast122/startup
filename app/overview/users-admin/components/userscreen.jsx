"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DropdownCheckbox from "@/components/ui/dropdowncheckbox";
import React, { useEffect } from "react";

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

const users = [
  {
    id: 1,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 2,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 3,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 4,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 5,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 6,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 7,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 8,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 9,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 10,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 11,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 12,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 13,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 14,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 15,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 16,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 17,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 18,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
  {
    id: 19,
    profile: "/avatars/ralph.png",
    firstname: "Jane",
    lastname: "Doe",
    title: "CFO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "WING",
    bankAccount: "123456789",
    status: "Inactive",
  },
  {
    id: 20,
    profile: "",
    firstname: "Alice",
    lastname: "Doe",
    title: "CTO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Pending",
  },
  {
    id: 21,
    profile: "/avatars/ralph.png",
    firstname: "John",
    lastname: "Doe",
    title: "CEO",
    banktransfer: "$300.00",
    cash: "$200.00",
    dateAdded: "2021-10-10",
    lastLogin: "2021-10-10",
    bankName: "ABA",
    bankAccount: "123456789",
    status: "Active",
  },
];

export default function UsersScreen({ setUsersCount }) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Filter state

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((item) => item !== filter)
        : [...prevFilters, filter]
    );
  };

  const Dot = ({ color }) => (
    <span
      className="w-2 h-2 rounded-full inline-block mr-2"
      style={{ backgroundColor: color }}
    />
  );

  const filteredUsers =
    statusFilter && statusFilter !== "all"
      ? users.filter((user) => user.status === statusFilter)
      : users;

  useEffect(() => {
    setUsersCount(users.length); // Call setUsersCount to update the count
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        {/* Left Side Dropdowns */}
        <div className="flex w-full sm:w-auto gap-4">
          <Select>
            <SelectTrigger className="w-48 font-custom">
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
            <SelectTrigger className="w-48 font-custom">
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
            <SelectTrigger className="w-24 font-custom">
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
            <SelectTrigger className="w-24 font-custom">
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

      {/* Table */}
      <div className="mt-6">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {/* 🚀 Scrollable Y-Axis Container */}
          <ScrollArea
            className="max-h-[890px] overflow-y-auto"
            style={{
              scrollbarWidth: "thin", // Firefox
              msOverflowStyle: "auto", // Internet Explorer
            }}
          >
            {/* 🚀 Horizontal Scrollbar Wrapper at the Bottom */}
            <div className="overflow-x-auto">
              {/* Custom Scrollbar Styles */}
              <style jsx>{`
                /* 🚀 Make scrollbars always visible */
                .overflow-x-auto::-webkit-scrollbar {
                  height: 8px; /* Horizontal scrollbar */
                }

                .overflow-x-auto::-webkit-scrollbar-thumb {
                  background-color: #888;
                  border-radius: 10px;
                }

                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                  background-color: #555;
                }

                .overflow-x-auto::-webkit-scrollbar-track {
                  background: #f1f1f1;
                }

                /* 🚀 Vertical Scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                  width: 8px;
                }
              `}</style>

              {/* 🚀 Table with Sticky Header */}
              <Table className="w-full min-w-max">
                <TableHeader className="bg-[#e4e4e4] sticky top-0 z-10">
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>First name</TableHead>
                    <TableHead>Last name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Bank Transfer</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Bank Account</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Status
                        <Select onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-12 border-none shadow-none"></SelectTrigger>
                          <SelectContent className="font-custom text-light-gray">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>

                    <TableHead className="flex justify-end py-3 px-3">
                      <DropdownCheckbox
                        options={[
                          "Title",
                          "Employment Start Date",
                          "Team",
                          "Cash",
                          "Bank Transfer",
                          "Department",
                          "Branch",
                          "Direct manager",
                        ]}
                        selectedOptions={selectedFilters}
                        onChange={handleFilterChange}
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="h-12">
                      <TableCell className="flex justify-center items-center">
                        {user.profile ? (
                          <a
                            href={user.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={user.profile}
                              alt="Profile"
                              className="w-8 h-8 rounded-full"
                            />
                          </a>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                            {user.firstname.charAt(0)}
                            {user.lastname.charAt(0)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.firstname}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.title}</TableCell>
                      <TableCell>{user.banktransfer}</TableCell>
                      <TableCell>{user.cash}</TableCell>
                      <TableCell>{user.dateAdded}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.bankName}</TableCell>
                      <TableCell>{user.bankAccount}</TableCell>
                      <TableCell className="text-start">
                        <span
                          className={`px-2.5 py-1.5 text-md font-semibold rounded-md border ${
                            user.status === "Active"
                              ? "bg-[#05C16833] text-[#14CA74] border-[#14CA74]"
                              : user.status === "Inactive"
                              ? "bg-[#AEB9E133] text-[#AEB9E1] border-[#AEB9E1]"
                              : user.status === "Pending"
                              ? "bg-[#FFF6C4] text-[#F7D000] border-[#F7D000]"
                              : ""
                          }`}
                        >
                          <Dot
                            color={
                              user.status === "Active"
                                ? "#14CA74"
                                : user.status === "Inactive"
                                ? "#AEB9E1"
                                : user.status === "Pending"
                                ? "#F7D000"
                                : "gray"
                            }
                          />
                          {user.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
