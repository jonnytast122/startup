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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSections, addGroup } from "@/lib/api/group";

export default function GroupPage() {
  const queryClient = useQueryClient();

  // Fetch sections (with nested groups)
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  // States
  const [confirmDeleteSection, setConfirmDeleteSection] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",

    section: "",
    members: [],
  });
  const [newSection, setNewSection] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // Open Add Group dialog - FIXED
  const openAddModal = (sectionId) => {
    const initialGroup = {
      name: "",
      section: sectionId,
      members: [],
    };
    setNewGroup(initialGroup);
    setIsAddOpen(true);

    console.log("Opening Add Group Modal for Section ID:", sectionId);
    console.log("New Group Data:", initialGroup);
  };

  // Create group mutation
  const addGroupMutation = useMutation({
    mutationFn: (groupData) => addGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
      setIsAddOpen(false);
      setNewGroup({ name: "", members: [], section: "" });
    },
  });

  // Confirm add group
  const handleAddConfirm = () => {
    if (!newGroup.name.trim()) return;

    const payload = {
      name: newGroup.name,
      section: newGroup.section, // Section ID

      members: [],
    };

    addGroupMutation.mutate(payload);
  };

  // Open Edit Group dialog
  const openEditModal = (sectionId, group, view = false) => {
    setEditingGroup({ ...group, category: sectionId });
    setIsViewOnly(view);
    setEditDialogOpen(true);
  };

  const handleSaveEditedGroup = () => {
    setEditDialogOpen(false);
  };

  const handleConfirmSection = () => {
    setIsSectionOpen(false);
    setNewSection("");
  };

  // Render Section with nested groups
  const renderGroupSection = (section) => {
    const bgColor = section.color || "#f3f4f6";

    return (
      <div key={section._id} className="mb-7 overflow-hidden">
        <div
          className="py-3 px-4 flex justify-between items-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex items-center gap-6">
            <h2 className="font-semibold text-xl">{section.name}</h2>
            <button onClick={() => setConfirmDeleteSection(section._id)}>
              <Trash2 className="w-5 h-5 text-black hover:text-red-600" />
            </button>
          </div>
          <span className="text-gray-600">
            {section.groups?.length || 0} groups
          </span>
        </div>
        <div className="bg-white mt-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[200px]">Group Name</TableHead>
                <TableHead className="w-[120px]">Members</TableHead>
                <TableHead className="w-[200px]">Created By</TableHead>
                <TableHead className="w-[200px]">Administered By</TableHead>
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
                  <TableCell>{group.memberCount || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        src={group.createdBy?.profilePic || "/default.jpg"}
                        alt={group.createdBy?.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{group.createdBy?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {(group.administeredBy || [])
                        .slice(0, 3)
                        .map((admin, i) => (
                          <img
                            key={admin}
                            src={`/path/to/profiles/${admin
                              .replace(/\s+/g, "")
                              .toLowerCase()}.jpg`}
                            alt={admin}
                            className={`w-8 h-8 rounded-full border-2 border-white -ml-2 ${
                              i === 0 ? "ml-0" : ""
                            }`}
                            title={admin}
                          />
                        ))}
                      {(group.administeredBy?.length || 0) > 3 && (
                        <div className="-ml-2 w-8 h-8 rounded-full bg-gray-300 text-sm text-center leading-8 text-gray-700 border-2 border-white">
                          +{group.administeredBy.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className="bg-white border border-gray-200 shadow-lg rounded-md"
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
                            setConfirmDelete({ category: section._id, group })
                          }
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
                    onClick={() => openAddModal(section._id)} // Only call openAddModal here
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

      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4">
        {sections.map((section) => renderGroupSection(section))}
        <Button className="w-fit mt-4" onClick={() => setIsSectionOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Section
        </Button>
      </div>

      {/* Add Group Dialog */}
      <AddGroupDialog
        isOpen={isAddOpen} // matches dialog's `isOpen`
        onClose={() => setIsAddOpen(false)} // matches dialog's `onClose`
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        members={[]} // your members data here
      />

      {/* Edit Group Dialog */}
      <EditGroupDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        group={editingGroup}
        onSave={handleSaveEditedGroup}
        members={[]}
        isViewMode={isViewOnly}
      />

      {/* Add Section Dialog */}
      <AddSectionDialog
        open={isSectionOpen}
        setOpen={setIsSectionOpen}
        newSection={newSection}
        setNewSection={setNewSection}
        onConfirm={handleConfirmSection}
      />
    </div>
  );
}
