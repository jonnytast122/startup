"use client";

import { useState } from "react";
import {
  CreditCard,
  Settings,
  ListFilter,
  ChevronDown,
  Search,
  List,
  Trash2,
  CircleX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import AddPayrollDialog from "./components/add-payroll-dialog";
import CustomizeReportDialog from "./components/customize-report-dialog";
import UserProfileSection from "./components/user-profile-section";

export default function PayrollPage() {
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 6, 31),
    key: "selection",
  });
  const [sections, setSections] = useState([
    { id: 1, name: "Site A Payroll", totalPay: "$1905" },
    { id: 2, name: "Security Payroll", totalPay: "$375" },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleAddSection = (newSection) => {
    setSections((prev) => [...prev, newSection]);
  };

  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  const employeeData = [
    {
      profile: "/avatar.png",
      firstName: "John",
      lastName: "Doe",
      department: "Operations",
      job: "Technician",
      shift: "Day",
      regularHour: 8,
      dailyRate: 25,
      regularPay: 200,
      overtimePay: 50,
      grossSalary: 250,
      tax: 170,
      nssf: 50,
      netSalary: 230,
    },
    {
      profile: "/avatar.png",
      firstName: "Jane",
      lastName: "Smith",
      department: "Security",
      job: "Guard",
      shift: "Night",
      regularHour: 8,
      dailyRate: 20,
      regularPay: 160,
      overtimePay: 40,
      grossSalary: 200,
      tax: 170,
      nssf: 50,
      netSalary: 175,
    },
  ];

  const allColumns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "department", label: "Department" },
    { key: "job", label: "Job" },
    { key: "shift", label: "Shift Type" },
    { key: "regularHour", label: "Regular Hour" },
    { key: "dailyRate", label: "Daily Rate" },
    { key: "regularPay", label: "Regular Pay" },
    { key: "overtimePay", label: "Overtime Pay" },
    { key: "grossSalary", label: "Gross Salary" },
    { key: "tax", label: "Tax " },
    { key: "nssf", label: " NSSf" },
    { key: "netSalary", label: "Net Salary" },
  ];


  const PayrollSection = ({ title, totalPay, onDelete }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [visibleCols, setVisibleCols] = useState(
      Object.fromEntries(allColumns.map((col) => [col.key, true]))
    );

    const toggleCol = (key) => {
      setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="border rounded-xl mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <Select>
            <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative text-[#5494DA]">
              <ListFilter size={20} />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {Filter.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute right-3 top-2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="pl-2 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Select
              onValueChange={() => {
                setShowCustomizeDialog(true);
              }}
            >
              <SelectTrigger className="w-24 font-custom rounded-full text-[#5494DA]">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent className="font-custom text-[#5494DA] bg-white">
                <SelectItem
                  value="as CSV"
                  className="text-[#5494DA] data-[state=checked]:font-semibold"
                >
                  as CSV
                </SelectItem>
                <SelectItem
                  value="as XLS"
                  className="text-[#5494DA] data-[state=checked]:font-semibold"
                >
                  as XLS
                </SelectItem>
              </SelectContent>
            </Select>

          </div>
        </div>
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-8">
            <h2 className="font-semibold text-lg text-[#5494DA]">{title}</h2>
            <button onClick={() => setShowDialog(true)}>
              <Trash2 size={20} className="text-black hover:text-red-600 transition-colors" />
            </button>
          </div>
          <p className="text-sm font-semibold text-right">Total Pay: {totalPay}</p>
        </div>
        {/* Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete this table?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                className="rounded-full px-10 font-custom"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-14 font-custom"
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={() => {
                  onDelete();
                  setShowDialog(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="overflow-auto mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-10" /> {/* <-- Empty header for profile */}
                {allColumns.map(
                  (col) =>
                    visibleCols[col.key] && <TableHead key={col.key}>{col.label}</TableHead>
                )}
                <TableHead className="w-12 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <List size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      {allColumns
                        .map((col) => (
                          <DropdownMenuCheckboxItem
                            key={col.key}
                            checked={visibleCols[col.key]}
                            onCheckedChange={() => toggleCol(col.key)}
                          >
                            {col.label}
                          </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((emp, idx) => (
                <TableRow key={idx}
                  onClick={() => handleRowClick(emp)}
                  className="cursor-pointer hover:bg-gray-100 transition-colors">
                  <TableCell>
                    <img
                      src={emp.profile}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    ></img>
                  </TableCell>
                  {visibleCols.firstName && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{emp.firstName}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleCols.lastName && <TableCell>{emp.lastName}</TableCell>}
                  {visibleCols.department && <TableCell>{emp.department}</TableCell>}
                  {visibleCols.job && (
                    <TableCell>
                      <div className="px-5 py-1 text-md font-custom rounded-xl border inline-flex items-center gap-1 border-[#5494DA] text-blue">
                        {emp.job}
                      </div>
                    </TableCell>
                  )}
                  {visibleCols.shift && <TableCell>{emp.shift}</TableCell>}
                  {visibleCols.regularHour && <TableCell>{emp.regularHour}</TableCell>}
                  {visibleCols.dailyRate && <TableCell>${emp.dailyRate}</TableCell>}
                  {visibleCols.regularPay && <TableCell>${emp.regularPay}</TableCell>}
                  {visibleCols.overtimePay && <TableCell>${emp.overtimePay}</TableCell>}
                  {visibleCols.grossSalary && <TableCell>${emp.grossSalary}</TableCell>}
                  {visibleCols.tax && <TableCell>${emp.tax}</TableCell>}
                  {visibleCols.nssf && <TableCell>${emp.nssf}</TableCell>}
                  {visibleCols.netSalary && <TableCell>${emp.netSalary}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  };

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/payroll" className="block">
            <div className="flex items-center space-x-3 cursor-pointer">
              <CreditCard className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Payroll</span>
            </div>
          </a>

          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset <br /> admins
            </p>
            <div className="flex items-center -space-x-4">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 ${badge.bg} rounded-full flex items-center justify-center border-2 border-white text-xs font-bold ${badge.textColor || "text-white"}`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            <Button className="text-blue font-custom h-12 border border-gray-400 bg-transparent rounded-full flex items-center px-6 hover:bg-blue-500 hover:text-white transition-colors duration-200">
              <Settings />
              <span>Setting</span>
            </Button>
          </div>
        </div>
      </div>

      {!selectedEmployee ? (
        <div className="bg-white rounded-xl shadow-md py-6 px-6">
          <div className="mb-4 relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm"
            >
              {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            {showDatePicker && (
              <div className="absolute z-10 mt-2 bg-white shadow-lg border p-2 rounded-md">
                <DateRangePicker
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

          {sections.map((section) => (
            <PayrollSection
              key={section.id}
              title={section.name}
              totalPay={section.totalPay}
              onRowClick={(emp) => setSelectedEmployee(emp)}
              onDelete={() =>
                setSections((prev) => prev.filter((s) => s.id !== section.id))
              }
            />
          ))}

          <div className="flex justify-center">
            <Button
              onClick={() => setDialogOpen(true)}
              className="mt-4 px-6 py-2 rounded-full bg-[#5494DA] shadow-lg hover:bg-blue-600 text-white"
            >
              + Add Payroll Table
            </Button>
          </div>

          <AddPayrollDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            onAdd={handleAddSection}
          />
        </div>
      ) : (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
      <CustomizeReportDialog
        open={showCustomizeDialog}
        setOpen={setShowCustomizeDialog}
      />
    </div>
  );
}
