"use client";

import { useState } from "react";
import { Users, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddGroupDialog from "./components/add-group-dialog";
import EditGroupDialog from "./components/edit-group-dialog";
import AddSectionDialog from "./components/add-section-dialog";
import ConfirmDeleteDialog from "./components/confirm-delete-dialog";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchSections,
	deleteGroup,
	addSection,
	deleteSection,
	updateSection,
} from "@/lib/api/group";

export default function GroupPage() {
	const queryClient = useQueryClient();

	// Fetch sections (with nested groups)
	const { data: sections = [], isLoading } = useQuery({
		queryKey: ["sections"],
		queryFn: fetchSections,
	});

	// States
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isSectionOpen, setIsSectionOpen] = useState(false);
	const [newGroup, setNewGroup] = useState({
		name: "",
		section: "",
		members: [],
	});
	const [newSection, setNewSection] = useState("");
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [isViewOnly, setIsViewOnly] = useState(false);
	const [newSectionColor, setNewSectionColor] = useState("#000000");

	// Inline section editing
	const [editingSectionId, setEditingSectionId] = useState(null);
	const [editName, setEditName] = useState("");

	// Delete dialogs
	const [deleteTarget, setDeleteTarget] = useState(null); // { type: "section"|"group", id, name }

	// --- Mutations ---
	const addSectionMutation = useMutation({
		mutationFn: addSection,
		onSuccess: () => queryClient.invalidateQueries(["sections"]),
	});

	const deleteGroupMutation = useMutation({
		mutationFn: deleteGroup,
		onSuccess: () => {
			queryClient.invalidateQueries(["sections"]);
			setDeleteTarget(null);
		},
	});

	const deleteSectionMutation = useMutation({
		mutationFn: deleteSection,
		onSuccess: () => {
			queryClient.invalidateQueries(["sections"]);
			setDeleteTarget(null);
		},
	});

	const updateSectionMutation = useMutation({
		mutationFn: ({ id, name }) => updateSection(id, { name }),
		onSuccess: () => queryClient.invalidateQueries(["sections"]),
	});

	// --- Helpers ---
	const openAddModal = (sectionId) => {
		setNewGroup({ name: "", section: sectionId, members: [] });
		setIsAddOpen(true);
	};

	const openEditModal = (sectionId, group, view = false) => {
		setEditDialogOpen(true);
		setNewGroup({ ...group, section: sectionId });
		setIsViewOnly(view);
	};

	const handleSaveEditedGroup = () => setEditDialogOpen(false);

	const handleConfirmSection = () => {
		setIsSectionOpen(false);
		setNewSection("");
		addSectionMutation.mutate({ name: newSection, color: newSectionColor });
	};

	// Inline section edit handlers
	const startEditing = (section) => {
		setEditingSectionId(section._id);
		setEditName(section.name);
	};

	const cancelEditing = () => {
		setEditingSectionId(null);
		setEditName("");
	};

	const saveEdit = (id) => {
		updateSectionMutation.mutate({ id, name: editName });
		setEditingSectionId(null);
	};

	const confirmDelete = () => {
		if (!deleteTarget) return;
		if (deleteTarget.type === "section") {
			deleteSectionMutation.mutate(deleteTarget.id);
		} else {
			deleteGroupMutation.mutate(deleteTarget.id);
		}
	};

	// --- Render Section with groups ---
	const renderGroupSection = (section) => {
		const bgColor = section?.color;

		return (
			<div key={section._id} className="mb-7 overflow-hidden">
				<div
					className="py-3 px-4 flex justify-between items-center rounded-t-xl"
					style={{ backgroundColor: bgColor }}
				>
					<div className="flex items-center gap-6">
						{editingSectionId === section._id ? (
							<div className="flex items-center gap-2">
								<input
									type="text"
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
									className="border rounded px-2 py-1 text-sm"
									autoFocus
									onKeyDown={(e) => {
										if (e.key === "Enter") saveEdit(section._id);
										if (e.key === "Escape") cancelEditing();
									}}
								/>
							</div>
						) : (
							<h2
								className="font-semibold text-xl cursor-pointer"
								onDoubleClick={() => startEditing(section)}
							>
								{section.name}
							</h2>
						)}

						<button
							onClick={() =>
								setDeleteTarget({
									type: "section",
									id: section._id,
									name: section.name,
								})
							}
						>
							<Trash2 className="w-5 h-5 text-black hover:text-red-600" />
						</button>
					</div>

					<span className="text-gray-600">
						{section.groups?.length || 0} groups
					</span>
				</div>

				<div className="bg-white mt-1 font-custom">
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-100 ">
								<TableHead className="w-[200px]">Group Name</TableHead>
								<TableHead className="w-[120px]">Members</TableHead>
								<TableHead className="w-[200px]">Created By</TableHead>
								<TableHead className="w-[80px] text-right">Edit</TableHead>
								<TableHead className="w-[130px] text-right"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{section.groups?.map((group) => (
								<TableRow
									key={group._id}
									className="cursor-pointer"
									onClick={() => openEditModal(section._id, group, true)}
								>
									<TableCell>{group.name}</TableCell>
									<TableCell>
										<div className="flex items-center space-x-2">
											{group.members?.slice(0, 2).map((member) =>
												member.info?.profileImg ? (
													<img
														key={member._id}
														src={member.info.profileImg}
														alt={member.name}
														className="w-6 h-6 rounded-full object-cover"
													/>
												) : (
													<div
														key={member._id}
														className="w-6 h-6 rounded-full bg-gray-300 text-xs font-medium flex items-center justify-center"
													>
														{member.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</div>
												)
											)}

											{group.members?.length > 2 && (
												<div className="w-6 h-6 rounded-full bg-gray-300 text-xs font-medium flex items-center justify-center">
													+{group.members.length - 2}
												</div>
											)}
										</div>
									</TableCell>

									<TableCell>
										<div className="flex items-center space-x-2">
											<span>{group.createdBy?.name}</span>
										</div>
									</TableCell>

									<TableCell className="text-right font-custom">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button className="p-1 rounded hover:bg-gray-100">
													<MoreHorizontal className="h-4 w-4" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="start"
												side="right"
												className="bg-white border px-4 border-gray-200 shadow-lg rounded-md font-custom"
												onClick={(e) => e.stopPropagation()}
											>
												<DropdownMenuItem
													onClick={() =>
														openEditModal(section._id, group, false)
													}
												>
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														setDeleteTarget({
															type: "group",
															id: group._id,
															name: group.name,
														})
													}
													className="text-red-500"
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={4} className="text-left">
									<Button
										className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
										onClick={() => openAddModal(section._id)}
									>
										<Plus size={12} className="mr-2" /> Add Group
									</Button>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
				<div className="flex items-center justify-between p-5">
					<div className="flex items-center space-x-3">
						<Users className="text-[#2998FF]" width={40} height={40} />
						<span className="font-custom text-3xl text-black">Groups</span>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4 font-custom">
				{sections.map((section) => renderGroupSection(section))}
				<Button className="w-fit mt-4" onClick={() => setIsSectionOpen(true)}>
					<Plus size={16} className="mr-2" /> Add Section
				</Button>
			</div>

			{/* Add Group Dialog */}
			<AddGroupDialog
				isOpen={isAddOpen}
				onClose={() => {
					setNewGroup({ members: [] });
					setIsAddOpen(false);
				}}
				newGroup={newGroup}
				setNewGroup={setNewGroup}
				members={[]}
			/>

			{/* Edit Group Dialog */}
			<EditGroupDialog
				isOpen={editDialogOpen}
				onClose={() => {
					setNewGroup({ members: [] });
					setEditDialogOpen(false);
				}}
				group={newGroup}
				setNewGroup={setNewGroup}
				onSave={handleSaveEditedGroup}
				members={[]}
				isViewMode={isViewOnly}
			/>

			{/* Confirm Delete Dialog */}
			<ConfirmDeleteDialog
				open={!!deleteTarget}
				onClose={() => setDeleteTarget(null)}
				onConfirm={confirmDelete}
				name={deleteTarget?.name || ""}
			/>

			{/* Add Section Dialog */}
			<AddSectionDialog
				open={isSectionOpen}
				setOpen={setIsSectionOpen}
				newSection={newSection}
				setNewSection={setNewSection}
				newSectionColor={newSectionColor}
				setNewSectionColor={setNewSectionColor}
				onConfirm={handleConfirmSection}
				isLoading={addSectionMutation.isPending}
			/>
		</div>
	);
}
