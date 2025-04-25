import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ListFilter } from "lucide-react";

const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
];

const users = [
    { id: 1, lastName: "Doe", bankName: "ABA", bankAccount: "12345678", cash: 500, bankTransfer: 2000, tax: 30, nssf: 120, total: 2500, status: "Processing" },
    { id: 2, lastName: "Smith", bankName: "ABA", bankAccount: "87654321", cash: 300, bankTransfer: 2000, tax: 40, nssf: 150, total: 2300, status: "Processing" },
    { id: 3, lastName: "Johnson", bankName: "ABA", bankAccount: "11223344", cash: 400, bankTransfer: 1800, tax: 20, nssf: 100, total: 2200, status: "Processing" },
    { id: 4, lastName: "Brown", bankName: "ABA", bankAccount: "44332211", cash: 350, bankTransfer: 1750, tax: 35, nssf: 130, total: 2100, status: "Processing" },
    { id: 5, lastName: "Davis", bankName: "ABA", bankAccount: "99887766", cash: 450, bankTransfer: 1950, tax: 25, nssf: 140, total: 2400, status: "Processing" },
    { id: 6, lastName: "Wilson", bankName: "ABA", bankAccount: "66554433", cash: 500, bankTransfer: 2200, tax: 50, nssf: 160, total: 2700, status: "Processing" },
    { id: 7, lastName: "Evans", bankName: "ABA", bankAccount: "33221100", cash: 300, bankTransfer: 1700, tax: 15, nssf: 90, total: 2000, status: "Processing" },
    { id: 8, lastName: "Taylor", bankName: "ABA", bankAccount: "77889900", cash: 350, bankTransfer: 1900, tax: 30, nssf: 110, total: 2250, status: "Processing" },
    { id: 9, lastName: "Martinez", bankName: "ABA", bankAccount: "55667788", cash: 400, bankTransfer: 2200, tax: 20, nssf: 125, total: 2600, status: "Processing" },
];

const usersPerPage = 8;

export default function PayrollTable() {
    const [page, setPage] = useState(0);

    const paginatedUsers = users.slice(page * usersPerPage, (page + 1) * usersPerPage);

    return (
        <div className="bg-white">
            {/* Header Controls */}
            <div className="flex justify-between items-center my-4">
                {/* Left: Groups Select */}
                <Select>
                    <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative">
                        <ListFilter className="text-blue-500" size={20} />
                        <SelectValue className="text-blue-500" placeholder="Filter" />
                        {/* Hides default icon */}
                    </SelectTrigger>
                    <SelectContent className="font-custom">
                        {Filter.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Right: Search, Team, Export */}
                <div className="flex items-center space-x-2">
                    <Input placeholder="Search..." className="w-[180px]" />
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
                    <Select>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Export" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">Export as CSV</SelectItem>
                            <SelectItem value="pdf">Export as PDF</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Export Button */}
                    <Select>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Report" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="csv">Report as CSV</SelectItem>
                            <SelectItem value="pdf">Report as PDF</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator orientation="horizontal" className="w-full mb-5 bg-black" />
            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead>
                            <div className="w-5 h-5 bg-gray-200 border border-gray-400 rounded-full"></div>
                        </TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Bank Name</TableHead>
                        <TableHead>Bank Account Number</TableHead>
                        <TableHead>Cash</TableHead>
                        <TableHead>Bank Transfer</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>NSSF</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <img src={user.profile} alt="Profile" className="w-8 h-8 rounded-full" />
                            </TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.bankName}</TableCell>
                            <TableCell>
                                <span className="text-green-50">{user.bankAccount}</span>
                            </TableCell>
                            <TableCell>${user.cash}</TableCell>
                            <TableCell>${user.bankTransfer}</TableCell>
                            <TableCell>${user.tax}</TableCell>
                            <TableCell>${user.nssf}</TableCell>
                            <TableCell>${user.total.toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center bg-yellow-200 px-3 border border-yellow-500 py-1 w-fit rounded-md space-x-1 mr-5">
                                    <span className="h-2 w-2 bg-yellow-500 rounded-full"></span> {/* yellow Status Dot */}
                                    <span className=" text-yellow-500 text-xs">{user.status}</span>
                                </div>
                            </TableCell>
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
