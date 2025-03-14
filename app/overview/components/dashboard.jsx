import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const employees = [
  {
    firstName: "John",
    lastName: "Doe",
    job: "Software Engineer",
    status: "On Time",
    clockIn: "08:30",
    clockOut: "17:30",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    job: "Product Manager",
    status: "Late",
    clockIn: "09:15",
    clockOut: "--",
  },
  {
    firstName: "David",
    lastName: "Brown",
    job: "UI/UX Designer",
    status: "Early",
    clockIn: "07:45",
    clockOut: "16:45",
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    job: "Data Analyst",
    status: "On Time",
    clockIn: "08:00",
    clockOut: "8:30",
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    job: "DevOps Engineer",
    status: "Late",
    clockIn: "09:30",
    clockOut: "--",
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

function Dashboard() {
  return ( // <-- Add "return" here
    <div>
      <h2 className="text-2xl font-medium mb-2 text-black">Dashboard</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-[120px]">First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={index} className="items-center justify-center">
              <TableCell className="font-medium">{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>
                <span className="text-blue-500 bg-white border border-blue-500 px-3 py-1 rounded-lg">
                  {employee.job}
                </span>
              </TableCell>
              <TableCell
                className={
                  employee.status === "On Time"
                    ? "text-green-600"
                    : employee.status === "Late"
                      ? "text-red-600"
                      : "text-blue-600"
                }
              >
                {employee.status}
              </TableCell>
              <TableCell>{employee.clockIn}</TableCell>
              <TableCell>{employee.clockOut}</TableCell>
              <TableCell className="text-right">
                {calculateTotalHours(employee.clockIn, employee.clockOut)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


export default Dashboard;