"use client";

import { useState } from "react";
import { Users, Plus, MoreHorizontal, CircleX } from "lucide-react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchSections } from "@/lib/api/group";

const Members = [
  {
    first: "Lucy",
    last: "Trevo",
    dept: "Marketing",
    job: "Accountant",
    avatar: "https://via.placeholder.com/28",
  },
  {
    first: "John",
    last: "Mark",
    dept: "Marketing",
    job: "Marketing",
    avatar: "https://via.placeholder.com/28",
  },
  {
    first: "Doe",
    last: "Ibrahim",
    dept: "Officer",
    job: "HR",
    avatar: "https://via.placeholder.com/28",
  },
  {
    first: "Luke",
    last: "Kai",
    dept: "Officer",
    job: "General",
    avatar: "https://via.placeholder.com/28",
  },
  {
    first: "Bob",
    last: "Mako",
    dept: "Marketing",
    job: "Accountant",
    avatar: "https://via.placeholder.com/28",
  },
];

export default function GroupPage() {
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    admins: [],
    category: "", // This will hold section ID
  });
  const [newSection, setNewSection] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const openAddModal = (sectionId) => {
    setNewGroup({ name: "", admins: [], category: sectionId });
    setIsAddOpen(true);
  };

  const openEditModal = (sectionId, group, view = false) => {
    setEditingGroup({ ...group, category: sectionId });
    setIsViewOnly(view);
    setEditDialogOpen(true);
  };

  const handleConfirmSection = () => {
    // Will be implemented when creating new sections via API
    setIsSectionOpen(false);
    setNewSection("");
  };

  const renderGroupSection = (section, index) => {
    const colorStyle = {
      backgroundColor: section.color || "#f3f4f6", // fallback
    };

    return (
      <div key={section._id} className="mb-7 overflow-hidden">
        <div
          className="py-3 px-4 flex justify-between items-center"
          style={colorStyle}
        >
          <div>
            <h2 className={`font-semibold text-xl text-white`}>
              {section.name}
            </h2>
            <span className="text-white">
              {section.groups?.length || 0} groups
            </span>
          </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.groups?.map((group) => (
                <TableRow
                  key={group._id}
                  className="cursor-pointer"
                  onClick={() => openEditModal(section._id, group, true)}
                >
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.admins?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        src={group.createdByProfilePic || "/default.jpg"}
                        alt={group.createdBy || "Unknown"}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{group.createdBy || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {group.admins?.slice(0, 3).map((admin, i) => (
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
                      {group.admins?.length > 3 && (
                        <div className="-ml-2 w-8 h-8 rounded-full bg-gray-300 text-sm text-center leading-8 text-gray-700 border-2 border-white">
                          +{group.admins.length - 3}
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
                            setConfirmDelete({
                              sectionId: section._id,
                              groupId: group._id,
                            })
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

      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4">
        {isLoading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          sections.map((section, index) => renderGroupSection(section, index))
        )}
        <Button className="w-fit mt-4" onClick={() => setIsSectionOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Section
        </Button>
      </div>

      <AddGroupDialog
        open={isAddOpen}
        setOpen={setIsAddOpen}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        members={Members}
        onConfirm={() => setIsAddOpen(false)} // Hook this to your add group API
      />

      <EditGroupDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        group={editingGroup}
        onSave={() => setEditDialogOpen(false)} // Hook this to your edit API
        members={Members}
        isViewMode={isViewOnly}
      />

      <AddSectionDialog
        open={isSectionOpen}
        setOpen={setIsSectionOpen}
        newSection={newSection}
        setNewSection={setNewSection}
        onConfirm={handleConfirmSection}
      />

      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete this group?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                className="rounded-full px-7 font-custom"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-7 font-custom bg-red-500 text-white"
                onClick={() => {
                  // Hook this to your delete group API
                  setConfirmDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
