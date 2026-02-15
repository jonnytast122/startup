import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Smile, CircleX, Circle } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, isWithinInterval, parseISO } from "date-fns";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeave, approveLeave, rejectLeave } from "@/lib/api/adminLeave";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

// Lightweight local toast hook (no external deps)
function useLocalToast() {
  const [toast, setToast] = useState(null);

  const show = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(useLocalToast._tid);
    useLocalToast._tid = window.setTimeout(() => setToast(null), 3000);
  };

  const showSuccess = (message) => show("success", message);
  const showError = (message) => show("error", message);

  const ToastPortal = toast
    ? createPortal(
        <div className="fixed bottom-6 right-6 z-[1000]">
          <div
            className={`min-w-[280px] max-w-[380px] rounded-lg shadow-lg px-4 py-3 text-white flex items-start gap-3 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="mt-0.5">
              {toast.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="font-custom text-sm whitespace-pre-line">
              {toast.message}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return { showSuccess, showError, ToastPortal };
}

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile; // Check if profile exists
      const initials = (row.original.employee.name || "")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

      return (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-gray-300">
          {profileExists ? (
            // Replace with an actual image if available
            <img
              src={row.original.profile}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500 font-custom">
              {initials}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "employee",
    header: "Fullname",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.employee.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5494DA] text-blue">
        {row.original.job}
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start date",
    cell: ({ row }) => {
      const startTime = row.original.startDate.split("T")[0];
      return startTime;
    },
  },
  {
    accessorKey: "endDate",
    header: "End date",
    cell: ({ row }) => {
      const startTime = row.original.endDate.split("T")[0];
      return startTime;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = row.original.dateTime?.[0]?.start_time;
      return startTime ? format(new Date(startTime), "hh:mm a") : "—";
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const endTime = row.original.dateTime?.[0]?.end_time;
      return endTime ? format(new Date(endTime), "hh:mm a") : "—";
    },
  },
  {
    accessorKey: "totalLeave",
    header: "Total Leave",
    cell: ({ row }) => {
      const totalLeave = Number(
        row.original.totalLeaveBalance ??
          row.original.totalLeave ??
          row.original.totalLeaveDays,
      );
      if (!Number.isFinite(totalLeave) || totalLeave <= 0) return "—";
      return <span className="text-sm">{`${totalLeave} day(s)`}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "Leave Policy",
    cell: ({ row }) => (
      <div className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-red text-red-500">
        {row.original.type?.name || "--"}
      </div>
    ),
  },
  {
    accessorKey: "paidtype",
    header: "Leave Type",
    cell: ({ row }) => {
      const type = row.original.type?.type || "paid";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold${
            type === "paid"
              ? "text-blue-500 bg-blue-100"
              : type === "unpaid"
                ? "text-red-500 bg-red-100"
                : "text-yellow-500 bg-yellow-100"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      const words = (row.original.note || "").split(" "); // Split the sentence into words
      const chunkSize = 5; // Define the number of words per row
      const rows = [];

      // Break words into rows of 4-5 words each
      for (let i = 0; i < words.length; i += chunkSize) {
        rows.push(words.slice(i, i + chunkSize).join(" "));
      }

      return (
        <div key={row.id} className="py-2 max-w-[300px] break-words">
          {rows.map((rowText, index) => (
            <p key={index} className="whitespace-normal">
              {rowText}
            </p> // Each row will be a new <p> tag
          ))}
          {row.original.attachment && (
            <a
              href={row.original.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              See Attachment
            </a>
          )}
        </div>
      );
    },
  },
  { accessorKey: "attachment", header: "Attachment" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center justify-center">
        <div className="flex gap-4">
          {/* Decline Button */}
          <DeclineDialog
            employee={row.original.employee}
            startdate={row.original.startDate}
            leave={row.original}
          />
          <ApproveDialog
            employee={row.original.employee}
            startdate={row.original.startDate}
            leave={row.original}
          />
        </div>
      </div>
    ),
  },
];

const PendingDialog = ({ onClose }) => {
  const [open, setOpen] = useState(false);

  const {
    data: leaveResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leave-pending", "pending"],
    queryFn: () =>
      getLeave({
        status: "pending",
      }),
    enabled: open,
  });

  // Transform API data to match table format
  const leaveData = useMemo(() => {
    const rows = Array.isArray(leaveResponse?.data)
      ? leaveResponse.data
      : Array.isArray(leaveResponse)
        ? leaveResponse
        : [];

    const pendingRows = rows.filter(
      (leave) => String(leave?.status || "").toLowerCase() === "pending",
    );

    return pendingRows.map((leave) => ({
      ...leave,
      profile: leave.employee?.info?.profileImg || null,
      firstname: leave.employee?.name?.split(" ")?.[0] || "-",
      lastname: leave.employee?.name?.split(" ")?.slice(1).join(" ") || "",
      job: leave.employee?.info?.job || "Employee",
      shifttype: Array.isArray(leave.employee?.info?.shiftType)
        ? leave.employee.info.shiftType.map((s) => s?.name).join(", ")
        : leave.employee?.info?.shiftType?.name || "Schedule",
    }));
  }, [leaveResponse]);

  const filteredData = useMemo(() => leaveData, [leaveData]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button className="text-orange font-custom w-42 h-10 border border-gray-400 bg-transparent rounded-full flex items-center pl-2 pr-4 hover:bg-orange-500 hover:text-white transition-colors duration-200">
          <span className="bg-orange-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {isLoading ? "..." : leaveData.length || 0}
          </span>
          <span>Pending Request</span>
        </Button>
      </DialogTrigger>

      {/* This is the missing part: DialogContent */}
      <DialogContent className="max-w-5xl font-custom text-center">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Leave requests
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            {/* <Select>
              <SelectTrigger className="w-48 font-custom rounded-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="w-48 font-custom">
                {ALL.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>

          {/* Right Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
              <SelectTrigger className="w-24 font-custom rounded-full">
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

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full py-10">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 mt-4 text-xl font-custom">
            Failed to load leave requests.
          </p>
        ) : leaveData.length === 0 ? (
          <p className="text-center text-gray-300 mt-4 text-xl font-custom">
            No pending leave requests
          </p>
        ) : (
          <div className="rounded-t-lg overflow-y-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-[#5494DA33] text-dark-blue"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="whitespace-nowrap px-2 min-w-[50px] w-[50px] py-6 text-center"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                      <TableCell
                        key={cell.id}
                        className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="w-full h-[1px] bg-[#A6A6A6] mt-6"></div>
        <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
          <div className="flex gap-4 items-center">
            {/* Decline Button */}
            <DeclineAllDialog />
            {/* Approve Button */}
            <ApproveAllDialog />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ApproveDialog = ({ employee, startdate, leave }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { showSuccess, showError, ToastPortal } = useLocalToast();

  const queryClient = useQueryClient();
  const approveMutation = useMutation({
    mutationFn: approveLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leave-pending"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["leave"], exact: false });
      showSuccess(
        "Approved successfully for " +
          employee.name +
          " on " +
          startdate.split("T")[0],
      );
    },
    onError: (error) => {
      const message = error?.message || "Unknown error";
      showError(
        "Approve failed for " +
          employee.name +
          " on " +
          startdate.split("T")[0] +
          "\n" +
          message,
      );
    },
  });

  const handleApprove = () => {
    approveMutation.mutate({ id: leave._id, message: comment });
    setOpen(false);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        <Button
          className="bg-[#5494DA] text-white font-custom px-5 rounded-full hover:bg-[#4376B0] transition"
          onClick={() => setOpen(true)}
        >
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <Smile className="h-12 w-12 text-blue-500" />
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to approve{" "}
          <span className="text-[#5494DA] font-custom">{employee.name}</span>'s
          leave on{" "}
          <span className="font-custom">{startdate.split("T")[0]}</span>?
        </p>
        <input
          id="note_request"
          type="text"
          placeholder="Add note to the request"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="font-custom border border-gray-300 rounded-lg p-2 w-full mb-6"
        />

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-400 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-[#5494DA] text-white rounded-full"
          >
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeclineDialog = ({ employee, startdate, leave }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { showSuccess, showError, ToastPortal } = useLocalToast();

  const queryClient = useQueryClient();
  const approveMutation = useMutation({
    mutationFn: rejectLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leave-pending"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["leave"], exact: false });
      showSuccess(
        "Declined successfully for " +
          employee.name +
          " on " +
          startdate.split("T")[0],
      );
    },
    onError: (error) => {
      const message = error?.message || "Unknown error";
      showError(
        "Decline failed for " +
          employee.name +
          " on " +
          startdate.split("T")[0] +
          "\n" +
          message,
      );
    },
  });

  const handleDecline = () => {
    approveMutation.mutate({ id: leave._id, message: comment });
    setOpen(false);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        <Button
          className="border border-[#FB5F59] text-[#FB5F59] font-custom bg-white px-5 rounded-full hover:bg-[#FB5F59] hover:text-white transition "
          onClick={() => setOpen(true)}
        >
          {" "}
          Decline{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <CircleX className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">{employee.name}</span>'s
          leave on{" "}
          <span className="font-custom">{startdate.split("T")[0]}</span>?
        </p>
        <input
          id="note_request"
          type="text"
          placeholder="Add note to the request"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="font-custom border border-gray-300 rounded-lg p-2 w-full mb-6"
        />

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-400 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDecline}
            className="bg-[#FB5F59] hover:bg-[#d9413c] text-white rounded-full transition-colors"
          >
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
const ApproveAllDialog = () => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { showSuccess, ToastPortal } = useLocalToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        {/* <Button
          className="bg-[#5494DA] text-white font-custom px-10 rounded-full hover:bg-[#4376B0] transition"
          onClick={() => setOpen(true)}
        >
          Approve all
        </Button> */}
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <Smile className="h-12 w-12 text-blue-500" />
          <DialogTitle />
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to approve{" "}
          <span className="text-[#5494DA] font-custom">All</span> leave
          requests?
        </p>
        <input
          type="text"
          placeholder="Add note to the request"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="font-custom border border-gray-300 rounded-lg p-2 w-full mb-6"
        />
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-400 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              showSuccess(`Approved all requests!\nComment: ${comment}`);
              setComment("");
            }}
            className="bg-[#5494DA] text-white rounded-full"
          >
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeclineAllDialog = () => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { showSuccess, ToastPortal } = useLocalToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        {/* <Button
          className="border border-[#FB5F59] text-[#FB5F59] font-custom bg-white px-10 rounded-full hover:bg-[#FB5F59] hover:text-white transition"
          onClick={() => setOpen(true)}
        >
          Decline all
        </Button> */}
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <CircleX className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle />
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">All</span> leave
          requests?
        </p>
        <input
          type="text"
          placeholder="✏️ Add note to the request"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="font-custom border border-gray-300 rounded-lg p-2 w-full mb-6"
        />
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-400 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              showSuccess(`Declined all requests!\nComment: ${comment}`);
              setComment("");
            }}
            className="bg-[#FB5F59] hover:bg-[#d9413c] text-white rounded-full"
          >
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingDialog;
