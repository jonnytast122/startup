"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
} from "@tanstack/react-table";
import {
	Select,
	SelectValue,
	SelectContent,
	SelectTrigger,
	SelectItem,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { List, Plus, Trash2 } from "lucide-react";
//import SuccessDialog from "./successdialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBranches } from "@/lib/api/branch";
import { fetchPositions } from "@/lib/api/position";
import { fetchCompanyDepartments } from "@/lib/api/department";
import { fetchWorkShift } from "@/lib/api/work-shift";
import { fetchCompany } from "@/lib/api/company";
import { addUsers, fetchUsers } from "@/lib/api/user";

export default function AddUserManuallyDialog({ open, onOpenChange }) {
	const queryClient = useQueryClient();

	const { data: usersData } = useQuery({
		queryKey: ["users"],
		queryFn: fetchUsers,
	});

	const { data: company } = useQuery({
		queryKey: ["company"],
		queryFn: fetchCompany,
	});

	const { data: departments = [] } = useQuery({
		queryKey: ["departments", company?.id],
		queryFn: () => fetchCompanyDepartments(company?.id),
		enabled: !!company?.id,
	});

	const { data: workshift } = useQuery({
		queryKey: ["workShift", company?.id],
		queryFn: () => fetchWorkShift(company?.id),
		enabled: !!company?.id,
	});

	const { data: branches } = useQuery({
		queryKey: ["branches"],
		queryFn: fetchBranches,
	});

	const { data: positions } = useQuery({
		queryKey: ["positions"],
		queryFn: fetchPositions,
	});

	const [data, setData] = useState(
		Array.from({ length: 1 }, (_, i) => ({
			id: i + 1,
			fullName: "",
			phone: "",
			branch: "",
			department: "",
			position: "",
			shiftType: "",
			baseSalary: "",
			cash: "",
			ibanking: "",
			currencyType: "",
			bankProvider: "",
			bankAccount: "",
		}))
	);

	const [addedRowIds, setAddedRowIds] = useState([]);
	const [errorsMap, setErrorsMap] = useState({});
	const [successOpen, setSuccessOpen] = useState(false);

	const handleAddRow = useCallback(() => {
		const newId = Math.max(...data.map((d) => d.id), 0) + 1;
		const newRow = {
			id: newId,
			fullName: "",
			phone: "",
			branch: "",
			department: "",
			position: "",
			shiftType: "",
			baseSalary: "",
			cash: "",
			ibanking: "",
			currencyType: "",
			bankProvider: "",
			bankAccount: "",
		};
		setData((prev) => [...prev, newRow]);
		setAddedRowIds((prev) => [...prev, newId]);
	}, [data]);

	const handleDeleteRow = useCallback((id) => {
		setData((prev) => prev.filter((row) => row.id !== id));
		setAddedRowIds((prev) => prev.filter((rowId) => rowId !== id));
	}, []);

	const handleInputChange = useCallback((id, field, value) => {
		setData((prevData) =>
			prevData.map((row) => (row.id === id ? { ...row, [field]: value } : row))
		);
	}, []);

	// ✅ Mutation fixed here
	const addUserMutation = useMutation({
		mutationFn: (users) => addUsers(users),
		onSuccess: () => {
			queryClient.invalidateQueries(["users"]);
			setData([
				{
					id: 1,
					fullName: "",
					phone: "",
					branch: "",
					department: "",
					position: "",
					shiftType: "",
					baseSalary: "",
					cash: "",
					ibanking: "",
					currencyType: "",
					bankProvider: "",
					bankAccount: "",
				},
			]);
			setAddedRowIds([]);
			setSuccessOpen(true);
		},
		onError: (error) => {
			console.error("Failed to add users:", error);
		},
	});

	const isRowComplete = (row) => {
		return (
			row.fullName.trim() &&
			row.phone.trim() &&
			row.branch.trim() &&
			row.department.trim() &&
			row.position.trim() &&
			row.shiftType.trim() &&
			row.baseSalary.trim() &&
			row.cash.trim() &&
			row.ibanking.trim()
		);
	};

	const handleAddUsers = () => {
		const isValid = validateRows();
		if (!isValid) {
			console.warn("Validation failed. Please fill all required fields.");
			return;
		}

		const formattedUsers = data.map((row) => ({
			name: row.fullName,
			phoneNumber: row.phone.startsWith("855")
				? row.phone
				: `855${row.phone.replace(/^0+/, "")}`,
			branch: row.branch,
			department: row.department,
			position: row.position,
			shiftType: row.shiftType,
			paymentMethod: {
				cashPercentage: Number(row.cash),
				ibankingPercentage: Number(row.ibanking),
			},
			salaryInfo: {
				baseSalary: Number(row.baseSalary),
				currencyType: row.currencyType,
			},
			bankDetails: {
				bankProvider: row.bankProvider,
				accountNumber: row.bankAccount,
			},
		}));

		addUserMutation.mutate(formattedUsers);
	};

	useEffect(() => {
		if (successOpen) {
			const timer = setTimeout(() => {
				setSuccessOpen(false);
				onOpenChange();
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [successOpen, onOpenChange]);

	const existingPhones = useMemo(() => {
		if (!usersData?.results) return new Set();
		return new Set(usersData.results.map((u) => u.phoneNumber));
	}, [usersData]);

	const getDuplicateCount = () => {
		const completeRows = data.filter(isRowComplete);
		const seen = new Map();
		let count = 0;

		for (const row of completeRows) {
			const phone = row.phone.startsWith("855")
				? row.phone
				: `855${row.phone.replace(/^0+/, "")}`;

			// Check against previously entered rows
			if (seen.has(phone)) {
				count++;
				continue;
			}

			// Check against existing users from backend
			if (existingPhones.has(phone)) {
				count++;
				continue;
			}

			seen.set(phone, true);
		}

		return count;
	};

	const validateRows = useCallback(() => {
		const newErrors = {};
		let hasError = false;

		data.forEach((row) => {
			const rowErrors = {};

			// Full name validation
			if (!row.fullName?.trim()) {
				rowErrors.fullName = "Full name is required";
			}

			// Phone validation
			if (!row.phone?.trim()) {
				rowErrors.phone = "Phone number is required";
			} else if (!/^\d+$/.test(row.phone.trim())) {
				rowErrors.phone = "Phone number must contain only digits";
			}

			if (Object.keys(rowErrors).length > 0) {
				newErrors[row.id] = rowErrors;
				hasError = true;
			}
		});

		setErrorsMap(newErrors);
		return !hasError;
	}, [data]);

	const countryCodes = [
		{ code: "+855", flag: "https://flagcdn.com/w40/kh.png", name: "Cambodia" },
	];

	const columns = useMemo(
		() => [
			{
				accessorKey: "Name",
				header: "Name",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<Input
							value={row.original.fullName}
							onChange={(e) =>
								handleInputChange(row.original.id, "fullName", e.target.value)
							}
							placeholder="Full Name"
							className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md border-gray-300 ${
								errorsMap[row.original.id]?.fullName ? "border-red-500" : ""
							}`}
						/>
						{errorsMap[row.original.id]?.fullName && (
							<p className="text-xs text-red-500 mt-1">
								{errorsMap[row.original.id]?.fullName}
							</p>
						)}
					</div>
				),
			},

			{
				accessorKey: "Phone Number",
				header: "Phone Number",
				cell: ({ row }) => (
					<div className="flex gap-2 items-center">
						<Select
							value={row.original.countryCode || "+855"}
							onValueChange={(code) =>
								handleInputChange(row.original.id, "countryCode", code)
							}
						>
							<SelectTrigger className="w-[115px] h-9 border-gray-300 font-custom text-black placeholder:text-gray-400 rounded-md">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="max-h-60 overflow-y-auto">
								{countryCodes.map((country) => (
									<SelectItem key={country.code} value={country.code}>
										<div className="flex items-center gap-2">
											<img
												src={country.flag}
												alt={country.name}
												className="w-4 h-4"
											/>
											{country.code}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="flex-1">
							<Input
								value={row.original.phone}
								onChange={(e) =>
									handleInputChange(row.original.id, "phone", e.target.value)
								}
								placeholder="Phone Number"
								className={`font-custom h-9 text-black placeholder:text-gray-400 rounded-md border-gray-300 ${
									errorsMap[row.original.id]?.phone ? "border-red-500" : ""
								}`}
							/>
							{errorsMap[row.original.id]?.fullName && (
								<p className="text-xs text-red-500 mt-1">
									{errorsMap[row.original.id]?.phone}
								</p>
							)}
						</div>
					</div>
				),
			},
			{
				accessorKey: "branch",
				header: "Branch",
				cell: ({ row }) => (
					<Select
						value={row.original.branch}
						onValueChange={(value) =>
							handleInputChange(row.original.id, "branch", value)
						}
					>
						<SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
							<SelectValue placeholder="Select Branch" />
						</SelectTrigger>
						<SelectContent className="font-custom">
							{branches?.results?.map((branch) => (
								<SelectItem key={branch.id} value={branch.id}>
									{branch.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				),
			},
			{
				accessorKey: "department",
				header: "Department",
				cell: ({ row }) => {
					return (
						<Select
							value={row.original.department}
							onValueChange={(value) =>
								handleInputChange(row.original.id, "department", value)
							}
						>
							<SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
								<SelectValue placeholder="Select Department" />
							</SelectTrigger>
							<SelectContent className="font-custom">
								{departments.results?.map((dept) => (
									<SelectItem key={dept.id} value={dept.id}>
										{dept.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					);
				},
			},
			{
				accessorKey: "position",
				header: "Position",
				cell: ({ row }) => (
					<Select
						value={row.original.position}
						onValueChange={(value) =>
							handleInputChange(row.original.id, "position", value)
						}
					>
						<SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
							<SelectValue placeholder="Select Position" />
						</SelectTrigger>
						<SelectContent className="font-custom">
							{positions?.results?.map((position) => (
								<SelectItem key={position.id} value={position.id}>
									{position.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				),
			},
			{
				accessorKey: "Shift Type",
				header: "Shift Type",
				cell: ({ row }) => (
					<Select
						value={row.original.shiftType}
						onValueChange={(value) =>
							handleInputChange(row.original.id, "shiftType", value)
						}
					>
						<SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
							<SelectValue placeholder="Select Shift Type" />
						</SelectTrigger>
						<SelectContent className="font-custom">
							{workshift?.results?.results?.map((shift) => (
								<SelectItem key={shift.id} value={shift.id}>
									{shift.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				),
			},

			{
				accessorKey: "Base Salary",
				header: "Base Salary",
				cell: ({ row }) => (
					<Input
						type="number"
						value={row.original.baseSalary}
						onChange={(e) =>
							handleInputChange(row.original.id, "baseSalary", e.target.value)
						}
						placeholder="Base Salary"
						className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
					/>
				),
			},
			{
				accessorKey: "cash",
				header: "Cash",
				cell: ({ row }) => (
					<Input
						type="number"
						value={row.original.cash ?? ""}
						onChange={(e) =>
							handleInputChange(row.original.id, "cash", e.target.value)
						}
						placeholder="Cash"
						className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
					/>
				),
			},
			{
				accessorKey: "ibanking",
				header: "iBanking",
				cell: ({ row }) => (
					<Input
						type="number"
						value={row.original.ibanking ?? ""}
						onChange={(e) =>
							handleInputChange(row.original.id, "ibanking", e.target.value)
						}
						placeholder="iBanking"
						className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
					/>
				),
			},
			{
				accessorKey: "Currency Type",
				header: "Currency",
				cell: ({ row }) => (
					<Select
						value={row.original.currencyType}
						onValueChange={(value) =>
							handleInputChange(row.original.id, "currencyType", value)
						}
					>
						<SelectTrigger className="h-9 w-28 font-custom">
							<SelectValue placeholder="Currency" />
						</SelectTrigger>
						<SelectContent className="font-custom">
							<SelectItem value="USD">USD</SelectItem>
							<SelectItem value="KHR">KHR</SelectItem>
						</SelectContent>
					</Select>
				),
			},
			{
				accessorKey: "Bank Provider",
				header: "Bank Provider",
				cell: ({ row }) => (
					<Select
						value={row.original.bankProvider}
						onValueChange={(value) =>
							handleInputChange(row.original.id, "bankProvider", value)
						}
					>
						<SelectTrigger className="w-full font-custom h-9 text-black border-gray-300 placeholder:text-gray-400">
							<SelectValue placeholder="Select Bank Provider" />
						</SelectTrigger>
						<SelectContent className="font-custom">
							<SelectItem value="schedule">ABA</SelectItem>
							<SelectItem value="flexible">Wings</SelectItem>
							<SelectItem value="part-time">Aceleda</SelectItem>
						</SelectContent>
					</Select>
				),
			},
			{
				accessorKey: "Bank Account ",
				header: "Bank Account",
				cell: ({ row }) => (
					<Input
						value={row.original.bankAccount}
						onChange={(e) =>
							handleInputChange(row.original.id, "bankAccount", e.target.value)
						}
						placeholder="Bank Account"
						className="font-custom h-9 text-black border-gray-300 placeholder:text-gray-400 rounded-md"
					/>
				),
			},
			{
				id: "actions",
				header: ({ table }) => (
					<div className="flex justify-end pr-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-auto bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
								>
									<List size={16} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-white shadow-md border p-2 font-custom">
								{table
									.getAllColumns()
									.filter(
										(column) => column.getCanHide() && column.id !== "actions"
									)
									.map((column) => (
										<div
											key={column.id}
											className="flex items-center gap-2 py-1 cursor-pointer rounded-md text-md"
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
					</div>
				),
				cell: ({ row }) => (
					<div className="flex justify-end gap-1 pr-2">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleDeleteRow(row.original.id)}
							className="text-black hover:text-red-500 bg-transparent hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
						>
							<Trash2 className="w-3 h-3" />
						</Button>
					</div>
				),
			},
		],
		[handleInputChange, handleDeleteRow]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			handleInputChange,
			data,
		},
		initialState: {
			pagination: { pageSize: 25 },
			columnVisibility: {
				fullName: true,
				phone: true,
				branch: true,
				shiftType: true,
				filter: true,
				baseSalary: true,
			},
		},
	});

	const duplicateCount = getDuplicateCount();
	const addedCount = addedRowIds.length;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-6xl">
					<DialogHeader className="text-center">
						<DialogTitle className="sr-only">Add New User</DialogTitle>
						<div className="flex items-center justify-center space-x-3">
							<h1 className="text-2xl font-custom text-light-gray">Review</h1>
						</div>
						{(addedCount > 0 || duplicateCount > 0) && (
							<div className="flex justify-start gap-6 pt-2 pl-2">
								{addedCount > 0 && (
									<p className="text-red-500 font-medium text-sm">
										{addedCount} Added
									</p>
								)}
								{duplicateCount > 0 && (
									<p className="text-blue-500 font-medium text-sm">
										{duplicateCount} Duplicated
									</p>
								)}
							</div>
						)}
					</DialogHeader>

					<div className="mt-6 overflow-x-auto">
						<Table className="w-full min-w-max rounded-lg overflow-hidden">
							<TableHeader className="bg-[#e4e4e4] rounded-lg font-custom text-md">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												className={
													header.id === "actions" ? "w-[60px]" : "min-w-[100px]"
												}
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
											<TableCell key={cell.id}>
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

					<div className="flex justify-center mt-4">
						<Button
							onClick={handleAddRow}
							className="bg-white border rounded-full text-blue-500 hover:bg-blue-100 flex items-center space-x-2 font-custom py-2 px-4"
						>
							<Plus className="w-4 h-4" />
							<span>Add Row</span>
						</Button>
					</div>

					<DialogFooter className="flex justify-end gap-2 mt-6">
						<Button
							variant="outline"
							onClick={() => onOpenChange()}
							className="rounded-full border border-gray-300 text-blue-500 hover:bg-gray-100 font-custom py-6 px-9"
						>
							Cancel
						</Button>

						<Button
							onClick={() => {
								handleAddUsers();
							}}
							className="rounded-full bg-blue-500 text-white hover:bg-blue-600 font-custom py-6 px-9"
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* <SuccessDialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          onOpenChange();
        }}
      /> */}
		</>
	);
}
