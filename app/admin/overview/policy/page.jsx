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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PolicyLeave from "./components/add-policyleave-dialog";
import PolicyOvertime from "./components/add-policyovertime-dialog";
import {
  fetchCompanyOverTimeSetting,
  fetchCompanyLeavePolicy,
  deleteOvertimeSetting,
  deleteLeavePolicy,
} from "@/lib/api/policy";
import { fetchCompany } from "@/lib/api/company";
import { getMyDetails } from "@/lib/api/user";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function PolicyPage() {
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

  const { data: myDetails } = useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  const role = (myDetails?.role || myDetails?.employee?.role || "").toLowerCase();
  const permissions = Array.isArray(myDetails?.permissions)
    ? myDetails.permissions
    : Array.isArray(myDetails?.employee?.permissions)
      ? myDetails.employee.permissions
      : [];
  const canManageLeavePolicies =
    role === "owner" || permissions.includes("manageLeavePolicies");

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
        className={`${colorClass.bg} py-3 px-4 flex justify-between items-center font-custom rounded-t-xl`}
      >
        <div>
          <h2 className={`font-semibold text-xl ${colorClass.text}`}>
            {title}
          </h2>
          <span className="text-gray-600">{data?.length} policies</span>
        </div>
      </div>

      <div className="bg-white mt-1 overflow-x-auto font-custom">
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
                    <span>{data.createdBy?.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-center align-middle font-custom"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span className="relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`mx-auto ${
                            canManageLeavePolicies
                              ? ""
                              : "opacity-60 cursor-not-allowed"
                          }`}
                          onClick={(e) => {
                            if (!canManageLeavePolicies) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          onPointerDown={(e) => {
                            if (!canManageLeavePolicies) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {!canManageLeavePolicies && (
                          <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                            You have no permission
                          </span>
                        )}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      side="right"
                      className="bg-white border px-4 border-gray-200 shadow-lg rounded-md font-custom"
                    >
                      {canManageLeavePolicies ? (
                        <>
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
                        </>
                      ) : (
                        <DropdownMenuItem disabled>No permission</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="px-4 py-3">
          {canManageLeavePolicies ? (
            <Button
              className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
              onClick={() => openModal(category, null)}
            >
              <Plus size={12} className="mr-2" /> Add Policy
            </Button>
          ) : (
            <div className="relative group inline-flex">
              <Button
                className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 opacity-60 cursor-not-allowed"
                disabled
              >
                <Plus size={12} className="mr-2" /> Add Policy
              </Button>
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                You have no permission
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 font-custom">
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
          <DialogContent className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center font-custom">
            <DialogTitle className="hidden">Delete confirmation</DialogTitle>
            <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete{" "}
              <span className="text-red-500 font-semibold">
                {confirmDelete.data.name}
              </span>{" "}
              ?
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
                onClick={() => {
                  handleDelete();
                  setConfirmDelete(null);
                }}
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
