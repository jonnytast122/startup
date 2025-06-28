import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { List, Download, PanelTopOpen } from "lucide-react";
import { Crown, Star, Trash2, Archive, UserPlus, UserMinus } from "lucide-react";
import PromoteDemoteDialog from "./promotedemotedialog";
import UploadDialog from "./uploaddialog";

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

const users = [
  {
    accessLevel: "owner",
    profile: "/avatars/alex.png",
    firstname: "Alex",
    lastname: "Thorne",
    title: "Marketing Manager",
    banktransfer: "800.00",
    cash: "150.00",
    dateadded: "03-15-2025",
    lastlogin: "04-10-2025",
    bankname: "alexthorne",
    banknumber: "9876543210",
    email: "alex.thorne@example.com",
    phone: "093456789",
    department: "Marketing",
    birthday: "1990-05-12",
    branch: "BKK1",
    status: "active",
    shiftType: "Scheduled",
  },
  {
    accessLevel: "admin",
    profile: "/avatars/sara.png",
    firstname: "Sara",
    lastname: "Lim",
    title: "Product Designer",
    banktransfer: "450.00",
    cash: "230.00",
    dateadded: "02-28-2025",
    lastlogin: "04-01-2025",
    bankname: "saralim",
    banknumber: "7766554433",
    email: "sara.lim@example.com",
    phone: "087123456",
    department: "Design",
    birthday: "1992-11-03",
    branch: "BKK2",
    status: "inactive",
    shiftType: "Scheduled",
  },
  {
    accessLevel: "admin",
    profile: "/avatars/kevin.png",
    firstname: "Kevin",
    lastname: "Nguyen",
    title: "CTO",
    banktransfer: "1200.00",
    cash: "500.00",
    dateadded: "01-20-2025",
    lastlogin: "04-12-2025",
    bankname: "kevinng",
    banknumber: "1122334455",
    email: "kevin.nguyen@example.com",
    phone: "092345678",
    department: "Engineering",
    birthday: "1987-08-22",
    branch: "BKK3",
    status: "pending",
    shiftType: "Scheduled",
  },
  {
    accessLevel: "user",
    profile: "/avatars/emily.png",
    firstname: "Emily",
    lastname: "Stone",
    title: "HR Specialist",
    banktransfer: "670.00",
    cash: "310.00",
    dateadded: "03-01-2025",
    lastlogin: "04-08-2025",
    bankname: "emilystone",
    banknumber: "3344556677",
    email: "emily.stone@example.com",
    phone: "098765432",
    department: "HR",
    birthday: "1991-01-15",
    branch: "BKK1",
    status: "active",
    shiftType: "Scheduled",
  },
  {
    accessLevel: "user",
    profile: "/avatars/omar.png",
    firstname: "Omar",
    lastname: "Khan",
    title: "Software Engineer",
    banktransfer: "950.00",
    cash: "420.00",
    dateadded: "03-18-2025",
    lastlogin: "04-10-2025",
    bankname: "omarkhan",
    banknumber: "2233445566",
    email: "omar.khan@example.com",
    phone: "096654321",
    department: "Engineering",
    birthday: "1993-06-30",
    branch: "BKK2",
    status: "inactive",
    shiftType: "Scheduled",
  },
  {
    accessLevel: "user",
    profile: "/avatars/luna.png",
    firstname: "Luna",
    lastname: "Park",
    title: "Data Analyst",
    banktransfer: "390.00",
    cash: "180.00",
    dateadded: "02-10-2025",
    lastlogin: "04-09-2025",
    bankname: "lunapark",
    banknumber: "6655443322",
    email: "luna.park@example.com",
    phone: "097998877",
    department: "Analytics",
    birthday: "1995-04-18",
    branch: "BKK3",
    status: "pending",
    shiftType: "Scheduled",
  },
];

const Dot = ({ color }) => (
  <span
    className="w-2 h-2 rounded-full inline-block mr-2"
    style={{ backgroundColor: color }}
  />
);

const statusFilter = ["Active", "Inactive", "Pending"];

const columns = [
  {
    id: "role",
    header: "",
    cell: ({ row }) => {
      const role = row.original.accessLevel;

      let icon = null;
      if (role === "owner") {
        icon = <Crown className="text-yellow-500 w-4 h-4" title="Owner" />;
      } else if (role === "admin") {
        icon = <Star className="text-blue-500 w-4 h-4" title="Admin" />;
      }

      return (
        <div className="flex justify-center items-center w-full h-full">
          {icon}
        </div>
      );
    },
  },
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const [imageError, setImageError] = React.useState(false);
      const profile = row.original.profile;
      const firstNameInitial =
        row.original.firstname?.charAt(0).toUpperCase() || "";
      const lastNameInitial =
        row.original.lastname?.charAt(0).toUpperCase() || "";

      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {profile && !imageError ? (
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs text-gray-600 font-medium">
              {firstNameInitial}
              {lastNameInitial}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    id: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.firstname + " " + row.original.lastname;
      return <span className="text-sm font-custom">{name}</span>;
    },
  },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "branch", header: "Branch" },
  { accessorKey: "shiftType", header: "Shift Type" },
  {
    accessorKey: "cash",
    header: "Cash",
    cell: ({ cell }) => {
      const value = cell.getValue();
      return (
        <span className="text-sm font-custom">
          {value ? `$${parseFloat(value).toFixed(2)}` : "$0.00"}
        </span>
      );
    },
  },
  { accessorKey: "dateadded", header: "Date Added" },
  { accessorKey: "lastlogin", header: "Last Login" },
  { accessorKey: "bankname", header: "Bank Name" },
  { accessorKey: "banknumber", header: "Bank Account" },
  {
    accessorKey: "status",
    filterFn: (row, columnId, filterValue) => {
      return (
        row.getValue(columnId)?.toLowerCase() === filterValue?.toLowerCase()
      );
    },
    header: ({ column }) => (
      <div className="flex items-center gap-1">
        <span>Status</span>
        <Select
          onValueChange={(value) => {
            column.setFilterValue(value === "All" ? "" : value.toLowerCase());
          }}
        >
          <SelectTrigger className="border-none p-0 w-6"></SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="font-custom">
              All
            </SelectItem>
            {statusFilter.map((status) => (
              <SelectItem
                key={status}
                value={status}
                className="font-custom text-light-gray"
              >
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    cell: ({ row }) => {
      const status =
        row.original.status.charAt(0).toUpperCase() +
        row.original.status.slice(1).toLowerCase();

      const statusStyles = {
        Active: "bg-[#05C16833] text-[#14CA74] border-[#14CA74]",
        Inactive: "bg-[#AEB9E133] text-[#AEB9E1] border-[#AEB9E1]",
        Pending: "bg-[#FFF6C4] text-[#F7D000] border-[#F7D000]",
      };

      const dotColor = {
        Active: "#14CA74",
        Inactive: "#AEB9E1",
        Pending: "#F7D000",
      };

      return (
        <span
          className={`px-1.5 py-0.5 text-sm font-semibold rounded-md border inline-flex items-center gap-1 ${statusStyles[status] || "bg-gray-200 text-gray-700 border-gray-400"
            }`}
          style={{
            borderWidth: "1px",
            minWidth: "80px",
            justifyContent: "center",
          }}
        >
          <Dot color={dotColor[status] || "#999"} />
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [dialogOpen, setDialogOpen] = useState(false);
      const [actionType, setActionType] = useState(null); // "promote" or "demote"

      const role = row.original.accessLevel;

      const handleOpen = (type) => {
        setActionType(type);
        setDialogOpen(true);
      };

      return (
        <div className="flex items-center justify-end gap-2">
          {role === "admin" || role === "owner" ? (
            <UserMinus
              className="w-4 h-4 text-orange-500 cursor-pointer"
              title="Demote"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen("demote");
              }}
            />
          ) : (
            <UserPlus
              className="w-4 h-4 text-green-600 cursor-pointer"
              title="Promote"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen("promote");
              }}
            />
          )}
          <Trash2
            className="w-4 h-4 text-red-500 cursor-pointer"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete", row.original);
            }}
          />
          <Archive
            className="w-4 h-4 text-gray-500 cursor-pointer"
            title="Archive"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Archive", row.original);
            }}
          />
          <PromoteDemoteDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            type={actionType}
            user={row.original}
            onConfirm={(newRole, branch, features) => {
              console.log("Update role to:", newRole, branch, features);
              setDialogOpen(false);
            }}
          />
        </div>
      );
    },
  },
  {
    id: "filter",
    header: ({ table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-1 h-auto">
            <List size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white shadow-md border p-2 font-custom z-10"
        >
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== "filter")
            .map((column) => (
              <div
                key={column.id}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                onClick={() => column.toggleVisibility()}
              >
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={() => column.toggleVisibility()}
                  className="accent-blue-400 w-4 h-4 rounded border-gray-300"
                />
                <span className="capitalize">{column.id}</span>
              </div>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const AdminsScreen = ({ setAdminsCount, onAddAdmin }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const table = useReactTable({
    data: users.filter((a) =>
      ["owner", "admin"].includes((a.accessLevel || "admin").toLowerCase())
    ),

    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
      columnVisibility: {
        profile: true,
        fullName: true,
        phone: true,
        title: false,
        banktransfer: false,
        branch: true,
        shiftType: true,
        accessLevel: true,
        cash: false,
        dateadded: true,
        lastlogin: true,
        bankname: false,
        banknumber: false,
        status: true,
        filter: true,
      },
    },
  });

  useEffect(() => {
    const count = users.filter(
      (user) =>
        ["owner", "admin"].includes((user.accessLevel || "").toLowerCase())
    ).length;

    setAdminsCount(count);
  }, []);


  return (
    <div className="p-4">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
        {/* Left Side Dropdowns */}
        <div className="flex w-full sm:w-auto gap-4">
          <Select>
            <SelectTrigger className="w-48 font-custom rounded-full">
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
            <SelectTrigger className="w-48 font-custom rounded-full">
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
          <div className="flex w-full sm:w-auto gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full font-custom px-4 py-2 flex items-center gap-2">
                  Add Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-custom bg-white shadow-md border p-2">
                <DropdownMenuItem
                  onClick={() => setShowUploadDialog(true)}
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => alert("Importing...")}
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  <PanelTopOpen className="w-4 h-4 mr-2" />
                  Download Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      </div>
      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-200 text-dark-blue"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap px-2 min-w-[50px] w-[50px]"
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
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="font-custom text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <UploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </div>
  );
};

export default AdminsScreen;
