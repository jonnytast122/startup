import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Column from "antd/es/table/Column";

const employees = [
  {
    firstname: "John",
    lastname: "Doe",
    job: "Software Engineer",
    status: "On Time",
    clockin: "08:30",
    clockout: "17:30",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    job: "Product Manager",
    status: "Late",
    clockin: "09:15",
    clockout: "--",
  },
  {
    firstname: "David",
    lastname: "Brown",
    job: "UI/UX Designer",
    status: "Early",
    clockin: "07:45",
    clockout: "16:45",
  },
  {
    firstname: "Emily",
    lastname: "Davis",
    job: "Data Analyst",
    status: "On Time",
    clockin: "08:00",
    clockout: "8:30",
  },
  {
    firstname: "Michael",
    lastname: "Johnson",
    job: "DevOps Engineer",
    status: "Late",
    clockin: "09:30",
    clockout: "--",
  },
];

// Function to calculate total hours worked
const calculateTotalHours = (clockIn, clockOut) => {
  if (clockOut === "--") return "--";

  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const diff = parseTime(clockOut) - parseTime(clockIn);
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const columns = [
  { accessorKey: "firstname", header: "First name" },
  { accessorKey: "lastname", header: "Last name" },
  {
    accessorKey: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="px-5 py-1 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5494DA] text-blue">
        {row.original.job}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.trim(); // Remove extra spaces

      const statusClass =
        status === "On Time"
          ? "text-green"
          : status === "Late"
          ? "text-red"
          : status === "Early"
          ? "text-blue"
          : "text-gray";

      return (
        <div className={`text-md font-custom ${statusClass}`}>{status}</div>
      );
    },
  },
  { accessorKey: "clockin", header: "Clock In" },
  { accessorKey: "clockout", header: "Clock Out" },
  {
    accessorKey: "totalhours",
    header: "Total Hours",
    cell: ({ row }) => {
      const { clockin, clockout } = row.original;
      return calculateTotalHours(clockin, clockout);
    },
  },
];

function Dashboard() {
  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    // <-- Add "return" here
    <div>
      <h2 className="text-2xl font-custom font-medium mb-4 text-black">Dashboard</h2>
      <div className="rounded-md border mt-2">
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
                    className="whitespace-nowrap px-4 min-w-[50px] w-[50px] text-md"
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Dashboard;
