import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Smile, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { CalendarPlus2, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, isWithinInterval, parseISO } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOvertime,
  approveOvertime,
  rejectOvertime,
} from "@/lib/api/adminOvertime";

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
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

const data = [
  {
    profile: "/avatars/ralph.png",
    employee: "Lucy Trevo",
    jobType: "Accountant",
    date: "2025-03-20", // OT Date
    starttime: "09:00 AM",
    endtime: "05:00 PM",
    totalhours: "8",
    note: "Finished month-end reports.",
  },
  {
    profile: "/avatars/ralph.png",
    employee: "John Smith",
    jobType: "Developer",
    date: "2025-03-22",
    starttime: "10:00 AM",
    endtime: "06:00 PM",
    totalhours: "8",
    note: "Helped with urgent release patch.",
  },
];

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const profileExists = row.original.profile;
      return profileExists ? (
        <img
          src={row.original.profile}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
          {row.original.firstname.charAt(0)}
          {row.original.lastname.charAt(0)}
        </div>
      );
    },
  },
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.employee.name}</span>
        <span className="text-[#5494DA] font-custom text-sm border border-[#5494DA] px-2.5 py-1 rounded-lg w-fit mt-2">
          {row.original.jobType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-custom">
        {format(parseISO(row.original.date), "yyyy-MM-dd")}
      </div>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
  },
  {
    accessorKey: "endTime",
    header: "End Time",
  },
  {
    accessorKey: "ottotal",
    header: "Total Hours",
    cell: ({ row }) => (
      <div className="font-custom">{row.original.ottotal}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Attachment",
    cell: ({ row }) => {
      const words = row.original.description.split(" "); // Split the sentence into words
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
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-center gap-6">
        <DeclineDialog
          employee={row.original.employee}
          startdate={format(parseISO(row.original.date), "yyyy-MM-dd")}
          overTime={row.original}
        />

        <ApproveDialog
          employee={row.original.employee}
          startdate={format(parseISO(row.original.date), "yyyy-MM-dd")}
          overTime={row.original}
        />
      </div>
    ),
  },
];

// Helpers
const calculateHours = (start, end) => {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let hours = endH - startH + (endM - startM) / 60;
  if (hours < 0) hours += 24;
  return hours;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const useTransformedOvertimeData = (apiData) => {
  return useMemo(() => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map((item) => {
      const startTime = item.startTime || "";
      const endTime = item.endTime || "";
      const otHours =
        startTime && endTime
          ? `${calculateHours(startTime, endTime)} hours`
          : "";

      return {
        id: item._id,
        employee: item.employee,
        startTime: item.startTime,
        endTime: item.endTime,
        profile: item.employee?.profile || "/avatars/ralph.png",
        firstname: item.employee?.name?.split(" ")[0] || "",
        lastname: item.employee?.name?.split(" ")[1] || "",
        department: item.department || "N/A",
        job: item.overtimeType?.name || "N/A",
        shifttype: item.shifttype || "Schedule",
        otrequest: otHours,
        otassigned: otHours,
        ottotal: otHours,
        description: item.description || "Request for overtime",
        status: item.status || "Pending",
        date: item.date ? formatDate(item.date) : "",
      };
    });
  }, [apiData]);
};

const PendingDialog = ({ onClose }) => {
  const [open, isOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    return {
      startDate: new Date(year, 0, 1), // Jan 1 of current year
      endDate: new Date(year, 11, 31), // Dec 31 of current year
      key: "selection",
    };
  });

  const {
    data: overtimeRespone,
    isLoading: overtimeLoading,
    error: overtimeError,
  } = useQuery({
    queryKey: [
      "overtime-pending",
      selectedRange.startDate,
      selectedRange.endDate,
    ],
    queryFn: () =>
      getOvertime({
        startDate: selectedRange.startDate.toISOString().split("T")[0],
        endDate: selectedRange.endDate.toISOString().split("T")[0],
        status: "pending",
      }),
    enabled: open,
  });

  const transformedOvertimeData = useTransformedOvertimeData(overtimeRespone);

  const datePickerRef = useRef(null);

  // Close date picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false); // Close the date picker if click is outside
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, {
        start: selectedRange.startDate,
        end: selectedRange.endDate,
      });
    });
  }, [selectedRange]);

  const table = useReactTable({
    data: transformedOvertimeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => isOpen(true)}>
        <Button className="text-orange font-custom w-42 h-10 border border-gray-400 bg-transparent rounded-full flex items-center pl-2 pr-4 hover:bg-orange-500 hover:text-white transition-colors duration-200">
          <span className="bg-orange-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {transformedOvertimeData.length || 0}
          </span>
          <span>Pending Request</span>
        </Button>
      </DialogTrigger>

      {/* This is the missing part: DialogContent */}
      <DialogContent className="max-w-5xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            OT requests
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            <Select>
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
            </Select>

            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom p-3"
            >
              <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
              {format(selectedRange.startDate, "MMM dd")} -{" "}
              {format(selectedRange.endDate, "MMM dd")}
              <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
            </button>

            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute mt-2 bg-white shadow-lg border p-2 rounded-md z-50 font-custom"
              >
                <DateRange
                  ranges={[selectedRange]}
                  onChange={(ranges) => {
                    const newRange = ranges.selection;
                    setSelectedRange(newRange);

                    // ✅ Only close if both dates are selected and not the same
                    const start = newRange.startDate;
                    const end = newRange.endDate;
                    if (start && end && start.getTime() !== end.getTime()) {
                      setShowDatePicker(false);
                    }
                  }}
                  rangeColors={["#3b82f6"]}
                />
              </div>
            )}
          </div>

          {/* Right Side Dropdowns */}
          <div className="flex w-full sm:w-auto gap-4">
            <div className="relative w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full font-custom bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5494DA]"
              />
            </div>
          </div>
        </div>

        {transformedOvertimeData.length === 0 ? (
          <p className="text-center text-gray-300 mt-4 text-xl font-custom">
            No Data Available
          </p>
        ) : (
          <div className="rounded-t-lg overflow-hidden">
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
                        className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-xs py-6"
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
                        className={`font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis ${
                          cell.column.id === "actions" ? "text-right" : ""
                        }`}
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
          <div className="flex gap-4">
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

const DeclineDialog = ({ employee, startdate, overTime }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const { showSuccess, showError, ToastPortal } = useLocalToast();
  const declineMutation = useMutation({
    mutationFn: rejectOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["overtime-pending"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["overtime"], exact: false });
      showSuccess(
        "Declined successfully for " +
          employee.name +
          " on " +
          startdate.split("T")[0],
      );
      setOpen(false);
      setComment("");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to decline request";
      showError(
        "Decline failed for " +
          employee.name +
          " on " +
          startdate.split("T")[0] +
          "\n" +
          msg,
      );
      setOpen(false);
    },
  });

  const handleDecline = () => {
    declineMutation.mutate({ id: overTime.id, message: comment });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        <Button
          className="border border-[#FB5F59] text-[#FB5F59] font-custom bg-white px-5 rounded-full hover:bg-[#FB5F59] hover:text-white transition"
          onClick={() => setOpen(true)}
        >
          {" "}
          Decline{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <X className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">{employee.name}</span>'s
          OT on <span className="font-custom">{startdate.split("T")[0]}</span>?
        </p>
        <input
          id="note_request"
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
const ApproveDialog = ({ employee, startdate, overTime }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const { showSuccess, showError, ToastPortal } = useLocalToast();
  const approveMutation = useMutation({
    mutationFn: approveOvertime,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["overtime-pending"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["overtime"], exact: false });
      showSuccess(
        "Approved successfully for " +
          employee.name +
          " on " +
          startdate.split("T")[0],
      );
      setOpen(false);
      setComment("");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to approve request";
      showError(
        "Approve failed for " +
          employee.name +
          " on " +
          startdate.split("T")[0] +
          "\n" +
          msg,
      );
      setOpen(false);
    },
  });

  const handleApprove = () => {
    approveMutation.mutate({ id: overTime.id, message: comment });
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
          OT request on{" "}
          <span className="font-custom">{startdate.split("T")[0]}</span>?
        </p>
        <input
          id="note_request"
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
const ApproveAllDialog = () => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { showSuccess, ToastPortal } = useLocalToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {ToastPortal}
      <DialogTrigger asChild>
        <Button
          className="bg-[#5494DA] text-white font-custom px-10 rounded-full hover:bg-[#4376B0] transition"
          onClick={() => setOpen(true)}
        >
          Approve all
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <Smile className="h-12 w-12 text-blue-500" />
          <DialogTitle />
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to approve{" "}
          <span className="text-[#5494DA] font-custom">All</span> OT requests?
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
        <Button
          className="border border-[#FB5F59] text-[#FB5F59] font-custom bg-white px-10 rounded-full hover:bg-[#FB5F59] hover:text-white transition"
          onClick={() => setOpen(true)}
        >
          Decline all
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4">
        <DialogHeader className="flex items-center gap-2 justify-center">
          <X className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle />
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">All</span> OT requests?
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
