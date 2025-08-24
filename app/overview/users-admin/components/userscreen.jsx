import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { List, Download, PanelTopOpen, Plus } from "lucide-react";
import {
  Crown,
  Star,
  Trash2,
  Archive,
  UserPlus,
  UserMinus,
} from "lucide-react";
import PromoteDemoteDialog from "./promotedemotedialog";
import UploadDialog from "./uploaddialog";
import AddUserManuallyDialog from "./addmanuallydialog";
import DeleteDialog from "./deletedialog";

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

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
];

const statusFilter = ["Active", "Inactive", "Pending"];

// Component to handle profile rendering safely
const ProfileCell = ({ profileImg, employeeName }) => {
  const [imageError, setImageError] = useState(false);
  const nameParts = employeeName.split(" ");
  const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() ?? "";
  const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() ?? "";

  return (
    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
      {profileImg && !imageError ? (
        <img
          src={profileImg}
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
};

const UsersScreen = ({ users = [], setUsersCount, onAddUser }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const router = useRouter();

  const columns = [
    {
      id: "role",
      header: "",
      cell: ({ row }) => {
        const role = row.original.employee?.role;
        let icon = null;
        if (role === "owner")
          icon = <Crown className="text-yellow-500 w-4 h-4" title="Owner" />;
        else if (role === "admin")
          icon = <Star className="text-blue-500 w-4 h-4" title="Admin" />;
        return <div className="flex justify-center items-center">{icon}</div>;
      },
    },
    {
      accessorKey: "profile",
      header: "",
      cell: ({ row }) => (
        <ProfileCell
          profileImg={row.original.profileImg}
          employeeName={row.original.employee?.name || ""}
        />
      ),
    },
    {
      accessorFn: (row) => row.employee?.name || "",
      id: "name",
      header: "Fullname",
    },
    {
      accessorKey: "nameInKhmer",
      header: "Name in Khmer",
    },

    {
      accessorFn: (row) => row.employee?.phoneNumber || "",
      id: "phone",
      header: "Phone",
    },
    {
      accessorFn: (row) => row.branch?.name || "",
      id: "branch",
      header: "Branch",
    },
    {
      accessorFn: (row) => row.department?.name || "",
      id: "department",
      header: "Department",
    },
    {
      accessorKey: "job",
      header: "Job",
    },
    {
      accessorFn: (row) => row.position?.title || "",
      id: "position",
      header: "Position",
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) =>
        row.original.groups?.map((g) => g.name).join(", ") || "-",
    },
    {
      accessorKey: "leavePolicies",
      header: "Leave Policies",
      cell: ({ row }) =>
        row.original.leavePolicies?.map((lp) => lp.name).join(", ") || "-",
    },
    {
      accessorFn: (row) => row.shiftType?.name || "",
      id: "shiftType",
      header: "Shift Type",
    },

    {
      accessorKey: "startDate",
      header: "Employment Date",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "-";
        return format(new Date(value), "dd/MM/yyyy");
      },
    },

    {
      accessorKey: "status",
      filterFn: (row, columnId, filterValue) =>
        row.getValue(columnId)?.toLowerCase() === filterValue?.toLowerCase(),
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Status</span>
          <Select
            onValueChange={(value) => {
              column.setFilterValue(value === "All" ? "" : value.toLowerCase());
            }}
          >
            <SelectTrigger className="border-none p-0 w-6" />
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
          row.original.isActive === true
            ? "Active"
            : row.original.isActive === false
            ? "Inactive"
            : "Pending";

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
            className={`px-1.5 py-0.5 text-sm font-semibold rounded-md border inline-flex items-center gap-1 ${
              statusStyles[status] ||
              "bg-gray-200 text-gray-700 border-gray-400"
            }`}
            style={{
              borderWidth: "1px",
              minWidth: "80px",
              justifyContent: "center",
            }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: dotColor[status] || "#999" }}
            />
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell user={row.original} />,
    },
    {
      id: "filter",
      header: ({ table }) => <ColumnVisibilityDropdown table={table} />,
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
      columnVisibility: {
        profile: true,
        Name: true,
        nameInKhmer: true,
        phone: true,
        branch: true,
        department: true,
        job: true,
        position: true,
        shiftType: true,
        startDate: true,
        status: true,
        filter: true,
      },
    },
  });

  useEffect(() => {
    setUsersCount(users.length);
  }, [users]);

  return (
    <div className="p-4">
      <TopControls
        onAddUser={onAddUser}
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
      />

      <UsersTable table={table} router={router} />

      {/* dialogs */}
      <UploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
      <AddUserManuallyDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

// Sub-components for better readability
const ActionsCell = ({ user }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const role = user.employee?.role;

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
          setDeleteDialogOpen(true);
        }}
      />
      <Archive
        className="w-4 h-4 text-gray-500 cursor-pointer"
        title="Archive"
        onClick={(e) => {
          e.stopPropagation();
          console.log("Archive", user);
        }}
      />
      <PromoteDemoteDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        type={actionType}
        user={user}
        onConfirm={(newRole, branch, features) => {
          setDialogOpen(false);
        }}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        user={user}
        onConfirm={() => {
          setDeleteDialogOpen(false);
        }}
      />
    </div>
  );
};

const ColumnVisibilityDropdown = ({ table }) => (
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
);

const TopControls = ({ onAddUser, setShowUploadDialog, setShowAddDialog }) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
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

      <div className="flex w-full sm:w-auto gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full font-custom px-4 py-2 flex items-center gap-2"
              onClick={onAddUser}
            >
              Add User
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="font-custom bg-white shadow-md border p-2">
            <DropdownMenuItem
              onClick={() => setShowAddDialog(true)}
              className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Manually
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowUploadDialog(true)}
              className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Import
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => alert("Importing...")}
              className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
            >
              <PanelTopOpen className="w-4 h-4 mr-2" /> Download Template
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
  );
};

const UsersTable = ({ table, router }) => (
  <div className="rounded-md border mt-6">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-gray-200 text-dark-blue">
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
          <TableRow key={row.id} className="hover:bg-gray-100">
            {row.getVisibleCells().map((cell) => {
              const isActions = cell.column.id === "actions";
              return (
                <TableCell
                  key={cell.id}
                  className="whitespace-nowrap overflow-hidden text-ellipsis"
                  onClick={() => {
                    if (!isActions) {
                      const { status, ...rest } = row.original;
                      const query = new URLSearchParams(rest).toString();
                      router.push(`/overview/users-admin/profile?${query}`);
                    }
                  }}
                  style={{ cursor: isActions ? "default" : "pointer" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>

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
  </div>
);

export default UsersScreen;
