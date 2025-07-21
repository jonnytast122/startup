import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Smile, CircleX, Circle } from "lucide-react";
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
import { CalendarPlus2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  ColumnDef,
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

const ALL = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const statusOptions = [
  "Marketing",
  "Administration",
  "Finance",
  "HR",
  "IT",
  "Operations",
  "Sales",
  "Support",
  "Others",
].map((dept) => ({ value: dept, label: dept }));

const data = [
  {
    profile: "/avatars/ralph.png",
    employee: "Lucy Trevo",
    attachment: "/images/attachment.png",
    jobType: "Accountant",
    startdate: "10-09-2024",
    enddate: "12-02-2024",
    starttime: "--",
    endtime: "--",
    totalhours: "01:30",
    leavetype: "Sick Leave",
    paidtype: "Paid",
    note: "blah blah",
    date: "2025-03-20",
  },
  {
    profile: "/avatars/ralph.png",
    employee: "Lucy Trevo",
    attachment: "/images/attachment.png",
    jobType: "Accountant",
    startdate: "10-09-2024",
    enddate: "12-02-2024",
    starttime: "--",
    endtime: "--",
    totalhours: "01:30",
    leavetype: "Sick Leave",
    paidtype: "Paid",
    note: "Hi boss, today is my graduation day. i would like to ask for a permission.",
    date: "2025-03-20",
  },
];

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
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
        <span className="font-medium">{row.original.employee}</span>
        <span className="text-[#5494DA] font-custom text-sm border border-[#5494DA] px-2.5 py-1 rounded-lg w-fit mt-2">
          {row.original.jobType}
        </span>
      </div>
    ),
  },
  { accessorKey: "startdate", header: "Start date" },
  { accessorKey: "enddate", header: "End date" },
  { accessorKey: "starttime", header: "Start time" },
  { accessorKey: "endtime", header: "End time" },
  { accessorKey: "totalhours", header: "Total hours" },
  { accessorKey: "leavetype", header: "Leave type" },
  {
    accessorKey: "paidtype",
    header: "Paid type",
    cell: ({ row }) => (
      <div className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 bg-[#5494DA33] text-blue">
        {row.original.paidtype}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      const words = row.original.note.split(" "); // Split the sentence into words
      const chunkSize = 5; // Define the number of words per row
      const rows = [];

      // Break words into rows of 4-5 words each
      for (let i = 0; i < words.length; i += chunkSize) {
        rows.push(words.slice(i, i + chunkSize).join(" "));
      }

      return (
        <div key={row.id} className="py-2 max-w-[300px] break-words">
          {rows.map((rowText, index) => (
            <p key={index} className="whitespace-normal">{rowText}</p> // Each row will be a new <p> tag
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
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <div className="flex gap-4">
          {/* Decline Button */}
          <DeclineDialog
            employee={row.original.employee}
            startdate={row.original.startdate}
          />
          <ApproveDialog
            employee={row.original.employee}
            startdate={row.original.startdate}
          />
        </div>
      </div>
    ),
  },
];

const PendingDialog = ({ onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 30),
    key: "selection",
  });

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
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-orange font-custom w-42 h-10 border border-gray-400 bg-transparent rounded-full flex items-center pl-2 pr-4 hover:bg-orange-500 hover:text-white transition-colors duration-200">
          <span className="bg-orange-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
            3
          </span>
          <span>Pending Request</span>
        </Button>
      </DialogTrigger>

      {/* This is the missing part: DialogContent */}
      <DialogContent className="max-w-5xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Leave requests
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

        {filteredData.length === 0 ? (
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
                      <TableCell
                        key={cell.id}
                        className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                      >
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

const ApproveDialog = ({ employee, startdate }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <span className="text-[#5494DA] font-custom">{employee}</span>'s leave
          on <span className="font-custom">{startdate}</span>?
        </p>
        <input
          id="note_request"
          type="text"
          placeholder="✏️ Add note to the request"
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
              alert(`Approved ${employee}'s request!\nComment: ${comment}`);
              setComment("");
              // Run your API call here
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

const DeclineDialog = ({ employee, startdate }) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <CircleX className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">{employee}</span>'s leave
          on <span className="font-custom">{startdate}</span>?
        </p>
        <input
          id="note_request"
          type="text"
          placeholder="✏️ Add note to the request"
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
              alert(`Declined ${employee}'s request!\nComment: ${comment}`);
              setComment("");
              // Run your API call here
            }}
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <span className="text-[#5494DA] font-custom">All</span> leave requests?
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
              alert(`Approved all requests!\nComment: ${comment}`);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <CircleX className="h-12 w-12 text-[#FB5F59]" />
          <DialogTitle />
        </DialogHeader>
        <p className="text-gray text-2xl font-custom mb-6">
          Do you want to decline{" "}
          <span className="text-[#5494DA] font-custom">All</span> leave requests?
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
              alert(`Declined all requests!\nComment: ${comment}`);
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
