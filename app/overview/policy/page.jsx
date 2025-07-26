"use client";

import { useState } from "react";
import { Lightbulb, Plus, MoreHorizontal, CircleX } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PolicyLeave from "./components/add-policyleave-dialog";
import PolicyOvertime from "./components/add-policyovertime-dialog";
import {
  fetchCompanyOverTimeSetting,
  fetchCompanyLeavePolicy,
  deleteOvertimeSetting,
  deleteLeavePolicy,
} from "@/lib/api/policy";
import { fetchCompany } from "@/lib/api/company";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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
  const [openDialogType, setOpenDialogType] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const queryClient = useQueryClient();
  // Fetch company data
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: overtimeSettings, isLoading: overtimeLoading } = useQuery({
    queryKey: ["overtimeSettings", company?.id], // include company ID in the key
    queryFn: () => fetchCompanyOverTimeSetting(company?.id),
    enabled: !!company?.id, // only run when company.id is available
  });

  const { data: leaveSettings, isLoading: leaveLoading } = useQuery({
    queryKey: ["leaveSettings", company?.id], // include company ID in the key
    queryFn: () => fetchCompanyLeavePolicy(company?.id),
    enabled: !!company?.id, // only run when company.id is available
  });

  const deleteOvertimeMutation = useMutation({
    mutationFn: deleteOvertimeSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(["overtimeSettings"]);
    },
    onError: (error) => {
      console.error("Failed to delete policy:", error);
    },
  });

  const deleteLeaveMutation = useMutation({
    mutationFn: deleteLeavePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["leaveSettings"]);
    },
    onError: (error) => {
      console.error("Failed to delete policy:", error);
    },
  });

  const openModal = (category, policy = null, viewOnly = false) => {
    setSelectedPolicy(policy);
    setOpenDialogType(category);
    setIsViewOnly(viewOnly);
  };

  const closeModal = () => {
    setOpenDialogType(null);
    setSelectedPolicy(null);
    setIsViewOnly(false);
  };

  const handleRowClick = (category, policy) => {
    openModal(category, policy, true); // view mode
  };

  const handleDelete = () => {
    if (confirmDelete) {
      // const { category, policy } = confirmDelete;
      // setPolicyData((prev) => ({
      //   ...prev,
      //   [category]: prev[category].filter((p) => p.id !== policy.id),
      // }));
      // setConfirmDelete(null);
      if (confirmDelete.category === "overtime") {
        deleteOvertimeMutation.mutate(confirmDelete.data.id);
      } else {
        deleteLeaveMutation.mutate(confirmDelete.data.id);
      }
    }
  };

  const renderPolicySection = (title, data, category, colorClass) => (
    <div key={category} className="mb-7 overflow-hidden">
      <div
        className={`${colorClass.bg} py-3 px-4 flex justify-between items-center`}
      >
        <div>
          <h2 className={`font-semibold text-xl ${colorClass.text}`}>
            {title}
          </h2>
          <span className="text-gray-600">{data?.length} policies</span>
        </div>
      </div>

      <div className="bg-white mt-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[250px]">Policy Name</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Created By</TableHead>
              <TableHead className="w-[100px] text-center align-middle">
                Edit
              </TableHead>
              <TableHead className="w-[100px] text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((data) => (
              <TableRow
                key={data.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(category, data)}
              >
                <TableCell>{data?.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium capitalize ${
                      data.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {data.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={data?.createdBy?.profilePic}
                      alt={data?.createdBy?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{data?.createdBy?.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-center align-middle"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="mx-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="right"
                      className="bg-white border px-4 border-gray-200 shadow-lg rounded-md"
                    >
                      <DropdownMenuItem
                        onClick={() => openModal(category, data, false)}
                      >
                        Edit {category === "leave" ? "Leave" : "Overtime"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setConfirmDelete({ category, data })}
                        className="text-red-500"
                      >
                        Delete {category === "leave" ? "Leave" : "Overtime"}
                      </DropdownMenuItem>
                      π
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-left">
                <Button
                  className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
                  onClick={() => openModal(category, {})}
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
        </div>
      </div>

      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4">
        {renderPolicySection("Leave Policy", leaveSettings, "leave", {
          bg: "bg-green-200",
          text: "text-green-600",
        })}
        {renderPolicySection("Overtime Policy", overtimeSettings, "overtime", {
          bg: "bg-red-200",
          text: "text-red-600",
        })}
      </div>

      {/* Dialogs */}
      <PolicyLeave
        open={openDialogType === "leave"}
        policy={selectedPolicy}
        onClose={closeModal}
        isViewMode={isViewOnly}
        onSubmit={(newPolicy) => {
          setPolicyData((prev) => {
            if (selectedPolicy) {
              return {
                ...prev,
                leave: prev.leave.map((p) =>
                  p.id === newPolicy.id ? newPolicy : p
                ),
              };
            } else {
              return {
                ...prev,
                leave: [...prev.leave, newPolicy],
              };
            }
          });
          closeModal();
        }}
      />

      <PolicyOvertime
        open={openDialogType === "overtime"}
        policy={selectedPolicy}
        onClose={closeModal}
        isViewMode={isViewOnly}
        onSubmit={(newPolicy) => {
          setPolicyData((prev) => {
            if (selectedPolicy) {
              return {
                ...prev,
                overtime: prev.overtime.map((p) =>
                  p.id === newPolicy.id ? newPolicy : p
                ),
              };
            } else {
              return {
                ...prev,
                overtime: [...prev.overtime, newPolicy],
              };
            }
          });
          closeModal();
        }}
      />

      {/* Delete Dialog */}
      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete this policy?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                className="rounded-full px-10 font-custom"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-14 font-custom"
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
