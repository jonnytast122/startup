"use client";

import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, XCircle, Pencil } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyRequests,
  acceptAssignedOvertime,
  rejectAssignedOvertime,
} from "@/lib/api/userOvertime";
import { formatWorkHours } from "@/lib/helper/dateTimeConveter";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingRequest() {
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [confirmNote, setConfirmNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["user-overtime-requests"],
    queryFn: () => getMyRequests(),
  });

  console.log("Overtime requests data:", data);

  const pendingRequests = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const currentUserId = user?._id || user?.id;
    return data.filter((r) => {
      const status = (r.status || "").toLowerCase();
      const requesterId =
        r?.createdBy?._id || r?.createdBy?.id || r?.createdBy;
      const employeeId =
        r?.employee?._id || r?.employee?.id || r?.employee;
      const isAssigned =
        requesterId && employeeId && String(requesterId) !== String(employeeId);
      const isMine =
        employeeId && currentUserId
          ? String(employeeId) === String(currentUserId)
          : false;
      return status === "pending" && isAssigned && isMine;
    });
  }, [data, user]);

  const confirmMutation = useMutation({
    mutationFn: acceptAssignedOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-overtime-requests"] });
      setConfirmDialog(false);
      setActiveRequest(null);
      setConfirmNote("");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAssignedOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-overtime-requests"] });
      setRejectDialog(false);
      setActiveRequest(null);
      setRejectNote("");
    },
  });

  const calculateOverTimeHour = (req) => {
    const [sh, sm] = req.startTime.split(":").map(Number);
    const [eh, em] = req.endTime.split(":").map(Number);

    let diffMinutes = eh * 60 + em - (sh * 60 + sm);
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    const hoursDecimal = diffMinutes / 60;

    return formatWorkHours(hoursDecimal);
  };

  return (
    <div className="p-1 font-custom">
      {/* Trigger */}
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="text-orange font-custom w-42 h-10 border border-gray-400 bg-transparent rounded-full flex items-center pl-2 pr-4"
            disabled={pendingRequests.length === 0}
          >
            <span className="bg-orange-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {pendingRequests.length}
            </span>
            <span>Pending Request</span>
          </Button>
        </DrawerTrigger>

        {/* Drawer */}
        <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-full lg:w-[420px] md:w-[480px] bg-transparent p-0 border-none outline-none h-screen max-h-screen min-h-screen">
          <DialogTitle></DialogTitle>
          <div className="h-full min-h-screen max-h-screen w-full bg-gray-100 font-custom flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4">
              <DrawerClose asChild>
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </DrawerClose>
              <h2 className="text-xl">Overtime details</h2>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
              {isLoading ? (
                <FaSpinner className="animate-spin text-blue text-lg" />
              ) : pendingRequests.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No pending overtime requests
                </div>
              ) : (
                pendingRequests.map((req) => {
                  const overtimeDate = `${req.date.split("T")[0]} | ${
                    req.startTime
                  }-${req.endTime}`;
                  const overtimeType = req.overtimeType.name;
                  const workingHoursTotal = calculateOverTimeHour(req);
                  const statusText = (req.status || "pending").toString();
                  const statusLower = statusText.toLowerCase();
                  const statusColor =
                    statusLower === "approved"
                      ? "text-blue-500"
                      : statusLower === "declined"
                        ? "text-red-500"
                        : "text-gray-500";

                  return (
                    <div key={req.id} className="bg-white rounded-md p-4">
                      <div className="space-y-3">
                        <Info label="Overtime date:" value={overtimeDate} />
                        <Info label="Overtime type:" value={overtimeType} />
                        <Info
                          label="Working hours:"
                          value={workingHoursTotal}
                        />
                        <Info label="Note:" value={req.reason || "-"} />
                        <Info label="Attachments:" value={req.reason || "-"} />
                        <Info
                          label="Status"
                          value={
                            <span className={`${statusColor} capitalize`}>
                              {statusText}
                            </span>
                          }
                        />
                      </div>

                      <div className="h-px bg-gray-200 my-4" />

                      <div className="flex items-center gap-3">
                        <img
                          src={user?.avatar}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="font-semibold text-blue-400">
                          {req.createdBy.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Button
                          variant="destructive"
                          className="rounded-full"
                          onClick={() => {
                            setActiveRequest(req);
                            setRejectDialog(true);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          className="rounded-full"
                          onClick={() => {
                            setActiveRequest(req);
                            setConfirmDialog(true);
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="bg-gray-100 w-[400px] text-center">
          <CheckCircle className="w-14 h-14 text-blue-500 mx-auto" />
          <DialogTitle>Confirm overtime?</DialogTitle>
          <Input
            placeholder="Add note"
            className="mt-4"
            value={confirmNote}
            onChange={(e) => setConfirmNote(e.target.value)}
          />
          <Button
            className="mt-4"
            onClick={() => {
              if (!activeRequest?.id) return;
              confirmMutation.mutate({
                id: activeRequest.id,
                message: confirmNote,
              });
            }}
            disabled={confirmMutation.isPending}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="bg-gray-100 w-[400px] text-center">
          <XCircle className="w-14 h-14 text-red-500 mx-auto" />
          <DialogTitle>Reject request?</DialogTitle>
          <Input
            placeholder="Add note"
            className="mt-4"
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => {
              if (!activeRequest?.id) return;
              rejectMutation.mutate({
                id: activeRequest.id,
                message: rejectNote,
              });
            }}
            disabled={rejectMutation.isPending}
          >
            Reject
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Small helper */
function Info({ label, value }) {
  return (
    <div className="grid grid-cols-12 text-sm">
      <div className="col-span-4">{label}</div>
      <div className="col-span-8 font-semibold">{value}</div>
    </div>
  );
}
