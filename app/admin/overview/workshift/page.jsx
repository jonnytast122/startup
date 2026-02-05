"use client";

import { useState } from "react";
import { BookCheck, Plus, MoreHorizontal, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import WorkShiftDialog from "./components/add-shift-dialog";
import CambodiaCalendar from "./components/calendar-screen";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkShift, deleteWorkShift } from "@/lib/api/work-shift";
import { fetchCompany } from "@/lib/api/company";
import { getMyDetails } from "@/lib/api/user";

export default function WorkShiftPage() {
  const [activeTab, setActiveTab] = useState("Shift");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // For Add/Edit dialog
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState(null);

  // For View dialog
  const [viewingShift, setViewingShift] = useState(null);

  const client = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: myDetails } = useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  const { data: workshift } = useQuery({
    queryKey: ["workShift", company?.id],
    queryFn: () => fetchWorkShift(company?.id),
    enabled: !!company?.id,
  });

  const role = (
    myDetails?.role ||
    myDetails?.employee?.role ||
    ""
  ).toLowerCase();
  const permissions = Array.isArray(myDetails?.permissions)
    ? myDetails.permissions
    : Array.isArray(myDetails?.employee?.permissions)
      ? myDetails.employee.permissions
      : [];
  const canManageShifts =
    role === "owner" || permissions.includes("manageShifts");

  const handleAddShift = (newShift) => {
    setShifts((prev) => [...prev, newShift]);
  };

  const handleUpdateShift = (updatedShift) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)),
    );
  };

  const deleteShift = useMutation({
    mutationFn: deleteWorkShift,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["workShift", company?.id] });
    },
  });

  const onDelete = (id) => {
    deleteShift.mutate(id);
  };

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border font-custom">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-3">
            <BookCheck className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Work shift</span>
          </div>

          {/* <div className="flex items-center gap-4">
            <p className="text-right text-sm font-medium text-gray-600 leading-tight">
              Asset
              <br />
              Admins
            </p>
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
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md font-custom">
        <div className="flex">
          {["Shift", "Calendar"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-custom text-lg transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl text-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Shift" && (
          <div className="m-5">
            <div className="bg-green-100 px-6 py-4 rounded-t-xl">
              <h3 className="text-green-700 font-semibold">Work shift</h3>
              <p className="text-xs text-gray-600">
                {workshift?.results?.results.length ?? 0} shifts
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Shift name</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Created by</TableHead>
                  <TableHead className="text-center align-middle">
                    Edit
                  </TableHead>
                  <TableHead className="text-center align-middle"></TableHead>
                  <TableHead className="text-center align-middle"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshift?.results?.results.map((shift) => (
                  <TableRow
                    key={shift._id || shift.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setViewingShift(shift)}
                  >
                    <TableCell>{shift.name}</TableCell>
                    {/* <TableCell>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          shift.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {shift.status ?? "Inactive"}
                      </span>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{shift.createdBy?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-center align-middle font-custom"
                      //   onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <span className="relative group">
                            <button
                              className={`p-1 rounded items-center text-center ${
                                canManageShifts
                                  ? "hover:bg-gray-100"
                                  : "opacity-60 cursor-not-allowed"
                              }`}
                              onClick={(e) => {
                                if (!canManageShifts) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              onPointerDown={(e) => {
                                if (!canManageShifts) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              type="button"
                              aria-label="Open shift actions"
                            >
                              <MoreHorizontal
                                className={`w-4 h-4 ${canManageShifts ? "" : "text-gray-300"}`}
                              />
                            </button>
                            {!canManageShifts && (
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          {canManageShifts ? (
                            <>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingShift(shift);
                                  setShiftDialogOpen(true);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(shift);
                                }}
                                className="text-red-500"
                              >
                                Delete
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <DropdownMenuItem disabled>
                              No permission
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">&nbsp;</TableCell>
                    <TableCell className="text-right">&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4">
              {canManageShifts ? (
                <Button
                  className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
                  onClick={() => {
                    setEditingShift(null);
                    setShiftDialogOpen(true);
                  }}
                >
                  <Plus size={12} className="mr-2" /> Add new work shift
                </Button>
              ) : (
                <div className="relative group inline-flex">
                  <Button
                    className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <Plus size={12} className="mr-2" /> Add new work shift
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
                    You have no permission
                  </div>
                </div>
              )}
            </div>

            {/* Add/Edit Shift Dialog */}
            <WorkShiftDialog
              open={shiftDialogOpen}
              onClose={() => {
                setShiftDialogOpen(false);
                setEditingShift(null);
              }}
              shift={editingShift}
              viewOnly={false}
              onSubmit={(shiftData) => {
                if (editingShift) {
                  // Update existing shift
                  handleUpdateShift(shiftData);
                } else {
                  // Add new shift
                  handleAddShift(shiftData);
                }
                setShiftDialogOpen(false);
                setEditingShift(null);
              }}
            />

            {/* View Shift Dialog */}
            <WorkShiftDialog
              open={!!viewingShift}
              onClose={() => setViewingShift(null)}
              shift={viewingShift}
              viewOnly={true}
              onSubmit={() => {}}
            />
          </div>
        )}

        {activeTab === "Calendar" && (
          <div className="p-4">
            <CambodiaCalendar />
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogTitle className="hidden">Delete confirmation</DialogTitle>
          <DialogContent
            className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
            style={{ minHeight: "280px", display: "flex" }}
          >
            <CircleX
              className="w-12 h-12"
              style={{ color: "#fb5f59" }}
              strokeWidth={1.5}
            />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete{" "}
              <span className="text-red-500 font-semibold">
                {confirmDelete.name}
              </span>{" "}
              ?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                className="rounded-full px-7 font-custom"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-7 font-custom"
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={() => {
                  onDelete(confirmDelete._id || confirmDelete.id);
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
