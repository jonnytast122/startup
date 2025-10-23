"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { addGroup, fetchMembers } from "@/lib/api/group";
import { fetchBranches } from "@/lib/api/branch";
import { fetchCompanyDepartments } from "@/lib/api/department";
import { fetchCompany } from "@/lib/api/company";
import UserFilterTable from "../../components/user-filter-table";
import { cn } from "@/lib/utils.ts";

export default function AddGroupDialog({
	isOpen,
	onClose,
	newGroup,
	setNewGroup,
	isViewMode = false,
	isEdit = false,
	onUpdate,
}) {
	const queryClient = useQueryClient();
	const [error, setError] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("Filter");
	const [selectedBranches, setSelectedBranches] = useState([]);
	const [selectedDepartments, setSelectedDepartments] = useState([]);
	const [filteredMembers, setFilteredMembers] = useState([]);
	const [isFiltering, setIsFiltering] = useState(false);

	const { data: company } = useQuery({
		queryKey: ["company"],
		queryFn: fetchCompany,
	});

	const { data: allMembers } = useQuery({
		queryKey: ["members"],
		queryFn: fetchMembers,
	});

	const { data: departmentsData = [] } = useQuery({
		queryKey: ["departments", company?.id],
		queryFn: () => fetchCompanyDepartments(company?.id),
		enabled: !!company?.id,
	});

	const { data: branchesData } = useQuery({
		queryKey: ["branches"],
		queryFn: fetchBranches,
	});

	const addGroupMutation = useMutation({
		mutationFn: addGroup,
		onSuccess: () => {
			queryClient.invalidateQueries(["sections"]);
			setNewGroup({ name: "", section: "", members: [] });
			setError("");
			onClose();
		},
		onError: (error) => {
			console.error("Error adding group:", error);
			setError("Something went wrong. Please try again.");
		},
	});

	const fetchFilteredUsers = async (branches, departments) => {
		return await fetchMembers({ branches, departments });
	};

	useEffect(() => {
		const load = async () => {
			if (!selectedBranches.length && !selectedDepartments.length) {
				setFilteredMembers([]);
				setIsFiltering(false);
				return;
			}

			setIsFiltering(true);
			try {
				const data = await fetchFilteredUsers(
					selectedBranches,
					selectedDepartments
				);
				const results = Array.isArray(data) ? data : data.results || [];
				setFilteredMembers(results);
			} catch (err) {
				console.error("Error fetching filtered users:", err);
				setFilteredMembers([]);
			} finally {
				setIsFiltering(false);
			}
		};
		load();
	}, [selectedBranches, selectedDepartments]);

	const handleFinish = () => {
		if (!newGroup.name?.trim()) {
			setError("Group name is required.");
			return;
		}

		setError("");

		// Use newGroup.members which is updated via UsersScreen
		const membersToSend = Array.isArray(newGroup.members)
			? newGroup.members
			: [];

		addGroupMutation.mutate({
			name: newGroup.name,
			section: newGroup.section,
			members: membersToSend,
		});
	};

	const displayMembers =
		selectedBranches.length || selectedDepartments.length
			? filteredMembers
			: allMembers?.results || [];

	const toggleSelect = (list, setList, value) => {
		setList((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl font-custom">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-semibold mb-4">
						{isViewMode ? "View Group" : "Group Settings"}
					</DialogTitle>
				</DialogHeader>

				<div className="w-full flex flex-wrap sm:flex-nowrap sm:items-center gap-4 mb-4">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<label className="text-sm font-medium whitespace-nowrap">
							Group's name:
						</label>
						<Input
							placeholder="Group's name"
							value={newGroup.name}
							onChange={(e) =>
								setNewGroup({ ...newGroup, name: e.target.value })
							}
							className={cn("font-custom placeholder:text-gray-400")}
							disabled={isViewMode}
						/>
					</div>
					<div
						className={`flex items-center gap-2 ${
							isViewMode ? "pointer-events-none opacity-60" : ""
						}`}
					>
						<span className="text-sm text-gray-500 whitespace-nowrap">
							{Array.isArray(newGroup.members) ? newGroup.members.length : 0}{" "}
							selected
						</span>
					</div>
				</div>

				{error && <p className="text-red-500 text-sm -mt-3 mb-2">{error}</p>}

				{/* ✅ Reusable Filter + User Table */}
				<UserFilterTable
					selectedUsers={newGroup.members.map((m) => m.id)}
					setSelectedUsers={(ids) =>
						setNewGroup({
							...newGroup,
							members: ids
								.map(
									(id) =>
										(allMembers?.results || []).find(
											(u) => u.id === id || u.employee?.id === id
										) || null
								)
								.filter(Boolean),
						})
					}
					isViewMode={isViewMode}
				/>

				{!isViewMode && (
					<DialogFooter className="justify-end mt-6">
						{isEdit ? (
							<Button
								className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
								onClick={onUpdate}
							>
								Update
							</Button>
						) : (
							<Button
								className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
								onClick={handleFinish}
							>
								{addGroupMutation.isPending ? "Creating..." : "Finish"}
							</Button>
						)}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
