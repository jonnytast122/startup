import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, fetchUser } from "@/lib/api/user";

const exportOptions = [
  { value: "as CSV", label: "as CSV" },
  { value: "as XLS", label: "as XLS" },
  { value: "as PDF", label: "as PDF" },
];

// const statusFilter = ["Active", "Inactive", "Pending"];

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

const UsersScreen = ({
  users = [],
  setUsersCount,
  onAddUser,
  page,
  setPage,
  totalPages,
}) => {
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
      accessorFn: (row) => row.employee?.name || "--",
      id: "name",
      header: "Fullname",
    },
    {
      accessorFn: (row) => row.otherName || "--",
      accessorKey: "otherName",
      header: "Other Name",
    },

    {
      accessorFn: (row) => row.employee?.phoneNumber || "--",
      id: "phone",
      header: "Phone",
    },

    {
      accessorFn: (row) => row.idCardNumber || "--",
      id: "idCardNumber",
      header: "ID Card Number",
    },
    {
      accessorFn: (row) => row.gender || "--",
      id: "gender",
      header: "Gender",
    },

    {
      accessorFn: (row) => row.branch?.name || "--",
      id: "branch",
      header: "Branch",
    },
    {
      accessorFn: (row) => row.department?.name || "--",
      id: "department",
      header: "Department",
    },
    {
      accessorKey: "job",
      header: "Job",
      cell: ({ row }) => (
        <span className="px-5 py-1 font-custom rounded-lg border border-[#5494DA] text-blue-600 ml-3 inline-flex items-center gap-1">
          <span className="text-blue">{row.original.job || "--"}</span>
        </span>
      ),
    },
    {
      accessorFn: (row) => row.position?.title || "--",
      id: "position",
      header: "Position",
    },
    {
      accessorKey: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const groups = row.original.groups || [];
        if (groups.length === 0) return "--";
        if (groups.length === 1) return groups[0].name;
        return `${groups.length} Groups`;
      },
    },

    {
      accessorKey: "shiftType",
      header: "Shift Type",
      cell: ({ row }) => {
        const shiftType = row.original.shiftType || [];
        if (shiftType.length === 0) return "--";
        if (shiftType.length === 1) return shiftType[0].name;
        return `${shiftType.length} Shifts`;
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "--";
        return format(new Date(value), "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "startDate",
      header: "Employment Date",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "--";
        return format(new Date(value), "dd/MM/yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell user={row.original} />,
    },
    {
      id: "filter",
      header: ({ table }) => <ColumnVisibilityDropdown table={table} />,
    },
  ];

  // table header initialization
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
        otherName: true,
        phone: true,
        branch: true,
        department: true,
        job: true,
        position: true,
        shiftType: true,
        startDate: true,
        status: true,
        actions: true,
        role: true,

        idCardNumber: false,
        gender: false,
        groups: false,
        dateOfBirth: false,
        filter: true,
      },
    },
  });

  // export users
  const [exportType, setExportType] = useState(null);
  useEffect(() => {
    if (!exportType) return;

    if (exportType === "as CSV") {
      exportTableToCSV(table, users, "users.csv");
    }
    if (exportType === "as XLS") {
      exportTableToExcel(table, users, "users.xlsx");
    } else if (exportType === "as PDF") {
      exportTableToPDF(table, users, "users.pdf");
    }

    setExportType(null);
  }, [exportType]);

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
        setExportType={setExportType}
      />

      <UsersTable
        table={table}
        router={router}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

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
  const [deleteItem, setDeleteItem] = useState(null);

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteUserMutation.mutate(deleteItem.id);
      setDeleteDialogOpen(false);
      setDeleteItem(null);
    }
  };

  // const handleOpen = (type) => {
  //   setActionType(type);
  //   setDialogOpen(true);
  // };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* {role === "admin" || role === "owner" ? (
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
      )} */}
      <Trash2
        className="w-4 h-4 text-red-500 cursor-pointer"
        title="Delete"
        onClick={() => {
          // e.stopPropagation();
          openDeleteDialog({
            id: user.employee?.id,
            name: user.employee?.name,
          });
        }}
      />
      {/* <Archive
        className="w-4 h-4 text-gray-500 cursor-pointer"
        title="Archive"
        onClick={(e) => {
          e.stopPropagation();
        }}
      /> */}
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
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        name={deleteItem?.name}
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

const TopControls = ({
  onAddUser,
  setShowAddDialog,
  setShowUploadDialog,
  setExportType,
}) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
      <div className="flex w-full sm:w-auto gap-4">
        {/* <Select>
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
        </Select> */}
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
            {/* <DropdownMenuItem
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
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select onValueChange={(value) => setExportType(value)}>
          <SelectTrigger className="rounded-full font-custom px-4 py-2 flex items-center gap-2">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent className="font-custom">
            {exportOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const UsersTable = ({ table, router, page, setPage, totalPages }) => (
  <div className="rounded-md border mt-6">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="bg-gray-200 text-dark-blue text-center items-center"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="whitespace-nowrap px-2 text-center items-center min-w-[50px] w-[50px]"
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

              // Add hover tooltip for Groups column
              if (cell.column.id === "groups") {
                const groups = row.original.groups || [];
                let cellContent;
                if (groups.length === 0) cellContent = "--";
                else if (groups.length === 1) cellContent = groups[0].name;
                else
                  cellContent = (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-blue-600 cursor-pointer font-custom bg-gray-100 px-2 py-1 rounded-full">
                            {groups.length} Groups
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-1"
                        >
                          <div className="whitespace-pre-wrap font-custom">
                            <p className="text-xl mb-2">Groups</p>
                            {groups.map((g) => (
                              <span
                                key={g.id || g.name}
                                className="block bg-gray-100 px-2 py-1 rounded-full mb-1 font-custom text-center"
                              >
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );

                return (
                  <TableCell
                    key={cell.id}
                    className="whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {cellContent}
                  </TableCell>
                );
              }

              if (cell.column.id === "shiftType") {
                const shiftType = row.original.shiftType || [];
                let cellContent;
                if (shiftType.length === 0) cellContent = "--";
                else if (shiftType.length === 1)
                  cellContent = shiftType[0].name;
                else
                  cellContent = (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-blue-600 cursor-pointer font-custom bg-gray-100 px-2 py-1 rounded-full">
                            {shiftType.length} Shift Type
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-1"
                        >
                          <div className="whitespace-pre-wrap font-custom">
                            <p className="text-xl mb-2">Shift Type</p>
                            {shiftType.map((g) => (
                              <span
                                key={g.id || g.name}
                                className="block bg-gray-100 px-2 py-1 rounded-full mb-1 font-custom text-center"
                              >
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );

                return (
                  <TableCell
                    key={cell.id}
                    className="whitespace-nowrap overflow-hidden text-ellipsis text-center items-center"
                  >
                    {cellContent}
                  </TableCell>
                );
              }

              if (cell.column.id === "leavePolicies") {
                const leaves = row.original.leavePolicies || [];
                let cellContent;
                if (leaves.length === 0) cellContent = "--";
                else if (leaves.length === 1) cellContent = leaves[0].name;
                else
                  cellContent = (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-blue-600 cursor-pointer font-custom bg-gray-100 px-2 py-1 rounded-full">
                            {leaves.length} Policies
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-1"
                        >
                          <p className="whitespace-pre-wrap font-custom font-custom">
                            <h1 className="font-bold text-xl">Policies</h1>
                            <br />
                            {leaves.map((g) => (
                              <span
                                key={g.id || g.name}
                                className="block bg-gray-100 px-2 py-1 rounded-full mb-1 font-custom text-center"
                              >
                                {g.name}
                              </span>
                            ))}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );

                return (
                  <TableCell
                    key={cell.id}
                    className="whitespace-nowrap overflow-hidden text-ellipsis text-center items-center"
                  >
                    {cellContent}
                  </TableCell>
                );
              }

              return (
                <TableCell
                  key={cell.id}
                  className="whitespace-nowrap overflow-hidden text-ellipsis text-center items-center"
                  onClick={() => {
                    if (!isActions) {
                      const user = row.original;
                      const employeeId = user.employee?.id || user.id;

                      if (!employeeId) return;
                      router.push(
                        `/admin/overview/users-admin/profile/${employeeId}`
                      );
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
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>

      <span className="font-custom text-gray-400">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  </div>
);

// XLSX Export
export const exportTableToExcel = (table, data, fileName = "users.xlsx") => {
  const visibleColumns = table
    .getAllColumns()
    .filter(
      (col) =>
        col.getIsVisible() &&
        !["actions", "filter", "profile", "role"].includes(col.id)
    );

  const headers = visibleColumns.map((col) =>
    typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
  );

  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      const accessorFn = col.columnDef.accessorFn;
      let value = accessorFn ? accessorFn(row) : row[col.id];

      // 🕓 Format date fields
      if (
        value &&
        (col.id.toLowerCase().includes("date") || value instanceof Date)
      ) {
        try {
          value = format(new Date(value), "dd/MM/yyyy");
        } catch {
          // skip formatting invalid dates
        }
      }

      // 🧩 Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return "--";
        if (value[0]?.name) return value.map((v) => v.name).join(", ");
        return value.join(", ");
      }

      // Default
      return value ?? "--";
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = headers.map(() => ({ wch: 20 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  XLSX.writeFile(workbook, fileName);
};

// CSV Export
export const exportTableToCSV = (table, data, fileName = "users.csv") => {
  const visibleColumns = table
    .getAllColumns()
    .filter(
      (col) =>
        col.getIsVisible() &&
        !["actions", "filter", "profile", "role"].includes(col.id)
    );

  const headers = visibleColumns.map((col) =>
    typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
  );

  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      const accessorFn = col.columnDef.accessorFn;
      const value = accessorFn ? accessorFn(row) : row[col.id];
      if (Array.isArray(value)) return value.map((v) => v.name ?? v).join("; ");
      return value ?? "";
    })
  );

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
};

export const exportTableToPDF = (table, data, fileName = "users.pdf") => {
  const doc = new jsPDF("l", "pt", "a4"); // landscape, points, A4

  const visibleColumns = table
    .getAllColumns()
    .filter(
      (col) =>
        col.getIsVisible() &&
        !["actions", "filter", "profile", "role"].includes(col.id)
    );

  const headers = visibleColumns.map((col) =>
    typeof col.columnDef.header === "string" ? col.columnDef.header : col.id
  );

  const rows = data.map((row) =>
    visibleColumns.map((col) => {
      const accessorFn = col.columnDef.accessorFn;
      let value = accessorFn ? accessorFn(row) : row[col.id];

      // 🕓 Format date fields
      if (
        value &&
        (col.id.toLowerCase().includes("date") || value instanceof Date)
      ) {
        try {
          value = format(new Date(value), "dd/MM/yyyy");
        } catch {
          /* ignore invalid date */
        }
      }

      // 🧩 Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return "--";
        if (value[0]?.name) return value.map((v) => v.name).join(", ");
        return value.join(", ");
      }

      return value ?? "--";
    })
  );

  // 🧾 Add title
  doc.setFontSize(16);
  doc.text("User List", 40, 40);

  // ✅ Use the imported autoTable helper
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 60,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [66, 133, 244] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // 💾 Save
  doc.save(fileName);
};

export default UsersScreen;
