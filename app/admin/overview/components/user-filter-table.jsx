"use client";

import React, { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchBranches } from "@/lib/api/branch";
import { fetchCompanyDepartments } from "@/lib/api/department";
import { fetchCompany } from "@/lib/api/company";
import { fetchMembers } from "@/lib/api/group";
import UsersScreen from "./user-screen-filter";

export default function UserFilterTable({
	selectedUsers,
	setSelectedUsers,
	isViewMode = false,
}) {
	const [selectedFilter, setSelectedFilter] = useState("Filter");
	const [selectedBranches, setSelectedBranches] = useState([]);
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);

	const { data: company } = useQuery({
		queryKey: ["company"],
		queryFn: fetchCompany,
	});
	const { data: branchesData } = useQuery({
		queryKey: ["branches"],
		queryFn: fetchBranches,
	});
	const { data: departmentsData = [] } = useQuery({
		queryKey: ["departments", company?.id],
		queryFn: () => fetchCompanyDepartments(company?.id),
		enabled: !!company?.id,
	});
	const { data: allMembers } = useQuery({
		queryKey: ["members"],
		queryFn: fetchMembers,
	});

	const fetchFilteredUsers = async (branches, departments) =>
		fetchMembers({ branches, departments });

	useEffect(() => {
		const load = async () => {
			if (!selectedBranches.length && !selectedDepartments.length) {
				setFilteredUsers([]);
				setIsFiltering(false);
				return;
			}

			try {
				const data = await fetchFilteredUsers(
					selectedBranches,
					selectedDepartments
				);
				const results = Array.isArray(data) ? data : data.results || [];
				setFilteredUsers(results);
			} catch (err) {
				console.error(err);
				setFilteredUsers([]);
			}
		};
		load();
	}, [selectedBranches, selectedDepartments]);

	const toggleSelect = (list, setList, value) => {
		setList((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
		);
	};

	const filteredOrAllUsers =
		selectedBranches.length || selectedDepartments.length
			? filteredUsers
			: allMembers?.results || [];

	return (
		<div>
			{!isViewMode && (
				<div className="flex flex-wrap items-center gap-4 mb-4">
					{/* Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-2 h-10 text-blue"
							>
								<Filter className="w-4 h-4" />
								{selectedFilter}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="bg-white text-blue">
							{["User", "Group", "Department", "Branch"].map((option) => (
								<DropdownMenuItem
									key={option}
									onClick={() => setSelectedFilter(option)}
								>
									{option}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Branches */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="w-48 justify-between text-black"
							>
								{selectedBranches.length
									? branchesData?.results
											?.filter((b) => selectedBranches.includes(b.id))
											.map((b) => b.name)
											.join(", ")
									: "Select Branches"}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48">
							{branchesData?.results?.map((branch) => (
								<DropdownMenuItem
									key={branch.id}
									onClick={() =>
										toggleSelect(
											selectedBranches,
											setSelectedBranches,
											branch.id
										)
									}
								>
									<input
										type="checkbox"
										checked={selectedBranches.includes(branch.id)}
										readOnly
										className="mr-2 accent-blue-500"
									/>
									{branch.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Departments */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="w-48 justify-between text-black"
							>
								{selectedDepartments.length
									? departmentsData?.results
											?.filter((d) => selectedDepartments.includes(d.id))
											.map((d) => d.name)
											.join(", ")
									: "Select Departments"}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-48">
							{departmentsData?.results?.map((department) => (
								<DropdownMenuItem
									key={department.id}
									onClick={() =>
										toggleSelect(
											selectedDepartments,
											setSelectedDepartments,
											department.id
										)
									}
								>
									<input
										type="checkbox"
										checked={selectedDepartments.includes(department.id)}
										readOnly
										className="mr-2 accent-blue-500"
									/>
									{department.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
			<UsersScreen
				users={filteredOrAllUsers}
				selectedUsers={selectedUsers}
				setSelectedUsers={(updatedUsers) => {
					setSelectedUsers(updatedUsers);
				}}
				isViewMode={isViewMode}
			/>
		</div>
	);
}
