import { useState, useEffect } from "react";
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

const admins = [
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
];

export default function AdminsScreen({ setAdminsCount }) {
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

  const filteredAdmins =
    statusFilter && statusFilter !== "all"
      ? admins.filter((admin) => admin.status === statusFilter)
      : admins;

  useEffect(() => {
    setAdminsCount(admins.length); // Set the admin count when the component is loaded
  }, [setAdminsCount]);

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
      <div className="mt-6 overflow-x-auto">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ScrollArea
            className="max-h-[890px] overflow-y-auto scrollbar-hidden"
            style={{
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For Internet Explorer
            }}
          >
            <style jsx>{`
              /* Hide scrollbar for webkit browsers */
              .max-h-[400px] ::-webkit-scrollbar {
                width: 0;
                height: 0;
              }
            `}</style>
            <Table className="w-full">
              {/* Sticky Table Header */}
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
                  <TableHead>Status</TableHead>
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

              {/* Table Body */}
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="h-12">
                    <TableCell>
                      {admin.profile ? (
                        <a
                          href={admin.profile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={admin.profile}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                          />
                        </a>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          {admin.firstname.charAt(0)}
                          {admin.lastname.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{admin.firstname}</TableCell>
                    <TableCell>{admin.lastname}</TableCell>
                    <TableCell>{admin.title}</TableCell>
                    <TableCell>{admin.banktransfer}</TableCell>
                    <TableCell>{admin.cash}</TableCell>
                    <TableCell>{admin.dateAdded}</TableCell>
                    <TableCell>{admin.lastLogin}</TableCell>
                    <TableCell>{admin.bankName}</TableCell>
                    <TableCell>{admin.bankAccount}</TableCell>
                    <TableCell className="text-start">
                      <span
                        className={`px-2.5 py-1.5 text-md font-semibold rounded-md border 
                    ${
                      admin.status === "Active"
                        ? "bg-[#05C16833] text-[#14CA74] border-[#14CA74]"
                        : ""
                    }
                    ${
                      admin.status === "Inactive"
                        ? "bg-[#AEB9E133] text-[#AEB9E1] border-[#AEB9E1]"
                        : ""
                    }
                    ${
                      admin.status === "Pending"
                        ? "bg-[#FFF6C4] text-[#F7D000] border-[#F7D000]"
                        : ""
                    }`}
                      >
                        <Dot
                          color={
                            admin.status === "Active"
                              ? "#14CA74"
                              : admin.status === "Inactive"
                              ? "#AEB9E1"
                              : "#F7D000"
                          }
                        />
                        {admin.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
