"use client";

import { useState } from "react";
import { Lightbulb, Plus, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import PolicyLeave from "./components/add-policyleave-dialog";
import PolicyOvertime from "./components/add-policyovertime-dialog"; // You’ll create this next

const Members = ["Admin"];

const initialPolicies = {
  leave: [
    {
      id: 1,
      name: "Sick Leave",
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile1.jpg",
    },
    {
      id: 2,
      name: "Annual Leave",
      status: "Unactive",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile2.jpg",
    },
  ],
  overtime: [
    {
      id: 3,
      name: "Normal OT",
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile1.jpg",
    },
    {
      id: 4,
      name: "Weekend OT",
      status: "Unactive",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile3.jpg",
    },
  ],
};

export default function PolicyPage() {
  const [policyData, setPolicyData] = useState(initialPolicies);
  const [openDialogType, setOpenDialogType] = useState(null); // 'leave' or 'overtime'

  const openModal = (category) => {
    setOpenDialogType(category);
  };

  const closeModal = () => {
    setOpenDialogType(null);
  };

  const renderPolicySection = (title, data, category, colorClass) => (
    <div key={category} className="mb-7 overflow-hidden">
      <div className={`${colorClass.bg} py-3 px-4 flex justify-between items-center`}>
        <div>
          <h2 className={`font-semibold text-xl ${colorClass.text}`}>{title}</h2>
          <span className="text-gray-600">{data.length} policies</span>
        </div>
      </div>

      <div className="bg-white mt-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[250px]">Policy Name</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Created By</TableHead>
              <TableHead className="w-[100px]">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${policy.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {policy.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={policy.createdByProfilePic}
                      alt={policy.createdBy}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{policy.createdBy}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-red-500"
                      >
                        Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-left">
                <Button
                  className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
                  onClick={() => openModal(category)}
                >
                  <Plus size={12} className="mr-2" /> Add Policy
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-3">
            <Lightbulb className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Policy</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Label with line break */}
            <p className="text-right text-sm font-medium text-gray-600 leading-tight">
              Asset<br />Admins
            </p>

            {/* Profile bubbles with colors */}
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                W
              </div>
              <div className="w-8 h-8 rounded-full bg-lime-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                L
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                S
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 text-sm font-bold flex items-center justify-center border-2 border-white">
                2+
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4">
        {renderPolicySection("Leave Policy", policyData.leave, "leave", {
          bg: "bg-green-200",
          text: "text-green-600",
        })}
        {renderPolicySection("Overtime Policy", policyData.overtime, "overtime", {
          bg: "bg-red-200",
          text: "text-red-600",
        })}
      </div>

      {/* Dialogs */}
      <PolicyLeave
        open={openDialogType === "leave"}
        onClose={closeModal}
        onSubmit={(newPolicy) => {
          setPolicyData((prev) => ({
            ...prev,
            leave: [...prev.leave, newPolicy],
          }));
        }}
      />
      <PolicyOvertime
        open={openDialogType === "overtime"}
        onClose={closeModal}
        onSubmit={(newPolicy) => {
          setPolicyData((prev) => ({
            ...prev,
            overtime: [...prev.overtime, newPolicy],
          }));
        }}
      />

    </div>
  );
}
