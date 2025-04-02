import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const users = [
    { id: 1, firstName: "John", lastName: "Doe", job: "Developer", shift: "Scheduled", nssfType: "Type", nssf: 120, tax: 30, timeOff: "10;31", sickLeave: "None", unpaidLeave: "None", netSalary: 2500, profile: "/profile1.jpg" },
    { id: 2, firstName: "Jane", lastName: "Smith", job: "HR", shift: "Scheduled", nssfType: "Type", nssf: 150, tax: 40, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2300, profile: "/profile2.jpg" },
    { id: 3, firstName: "Alice", lastName: "Johnson", job: "Admin", shift: "Scheduled", nssfType: "Type", nssf: 100, tax: 20, timeOff: "11:11", sickLeave: "None", unpaidLeave: "None", netSalary: 2200, profile: "/profile3.jpg" },
    { id: 4, firstName: "Bob", lastName: "Brown", job: "Marketing", shift: "Scheduled", nssfType: "Type", nssf: 130, tax: 35, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2100, profile: "/profile4.jpg" },
    { id: 5, firstName: "Charlie", lastName: "Davis", job: "Developer", shift: "Scheduled", nssfType: "Type", nssf: 140, tax: 25, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2400, profile: "/profile5.jpg" },
    { id: 6, firstName: "Emma", lastName: "Wilson", job: "HR", shift: "Scheduled", nssfType: "Type", nssf: 160, tax: 50, timeOff: "12:12", sickLeave: "None", unpaidLeave: "None", netSalary: 2700, profile: "/profile6.jpg" },
    { id: 7, firstName: "Daniel", lastName: "Evans", job: "Admin", shift: "Scheduled", nssfType: "Type", nssf: 90, tax: 15, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2000, profile: "/profile7.jpg" },
    { id: 8, firstName: "Sophia", lastName: "Taylor", job: "Marketing", shift: "Scheduled", nssfType: "Type", nssf: 110, tax: 30, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2250, profile: "/profile8.jpg" },
    { id: 9, firstName: "Liam", lastName: "Martinez", job: "Developer", shift: "Scheduled", nssfType: "Type", nssf: 125, tax: 20, timeOff: "None", sickLeave: "None", unpaidLeave: "None", netSalary: 2600, profile: "/profile9.jpg" },
];

const usersPerPage = 8;

export default function DetailCard() {
    const [page, setPage] = useState(0);

    const paginatedUsers = users.slice(page * usersPerPage, (page + 1) * usersPerPage);

    return (
        <div className="bg-white p-4 mt-10">
            {/* Title */}
            <h2 className="text-2xl font-custom">Details</h2>

            <Separator orientation="horizontal" className="w-full mt-2" />

            {/* Header Controls */}
            <div className="flex justify-between items-center my-4">
                {/* Left: Groups Select */}
                <Select>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Groups" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="group1">Group 1</SelectItem>
                        <SelectItem value="group2">Group 2</SelectItem>
                        <SelectItem value="group3">Group 3</SelectItem>
                    </SelectContent>
                </Select>

                {/* Right: Search, Team, Export */}
                <div className="flex items-center space-x-2">
                    <Input placeholder="Search..." className="w-[180px]" />
                    <Separator orientation="vertical" className="mr-2 h-10" />

                    <Select>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Team" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="team1">Team 1</SelectItem>
                            <SelectItem value="team2">Team 2</SelectItem>
                            <SelectItem value="team3">Team 3</SelectItem>
                        </SelectContent>
                    </Select>
                    <Separator orientation="vertical" className="mr-2 h-10" />
                    {/* Export Button */}
                    <Select>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Export" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">Export as CSV</SelectItem>
                            <SelectItem value="pdf">Export as PDF</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead>
                            <div className="w-5 h-5 bg-gray-200 border border-gray-400 rounded-full"></div>
                        </TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Job</TableHead>
                        <TableHead>Shift Type</TableHead>
                        <TableHead>NSSF Type</TableHead>
                        <TableHead>NSSF</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Time Off</TableHead>
                        <TableHead>Sick Leave</TableHead>
                        <TableHead>Unpaid Leave</TableHead>
                        <TableHead>Net Salary</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <img src={user.profile} alt="Profile" className="w-8 h-8 rounded-full" />
                            </TableCell>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell><span className="text-blue-500 bg-white border border-blue-500 px-3 py-1 w-auto rounded-lg">
                                {user.job}
                            </span></TableCell>
                            <TableCell>{user.shift}</TableCell>
                            <TableCell>{user.nssfType}</TableCell>
                            <TableCell>${user.nssf}</TableCell>
                            <TableCell>${user.tax}</TableCell>
                            <TableCell>{user.timeOff}</TableCell>
                            <TableCell>{user.sickLeave}</TableCell>
                            <TableCell>{user.unpaidLeave}</TableCell>
                            <TableCell>${user.netSalary.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                >
                    Previous
                </Button>
                <span className="font-custom text-gray-400">
                    Page {page + 1} of {Math.ceil(users.length / usersPerPage)}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={(page + 1) * usersPerPage >= users.length}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
