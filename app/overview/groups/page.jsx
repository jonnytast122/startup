// GroupPage.jsx
"use client";

import { useState } from "react";
import { Users, Plus, MoreHorizontal, CircleX } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddGroupDialog from "./components/add-group-dialog";
import AddSectionDialog from "./components/add-section-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Members = [
  "John Doe", "Jane Smith", "Emily Johnson", "Michael Brown", "Sarah Davis",
  "David Wilson", "Jessica Moore", "James Taylor", "Amanda Anderson", "William Thomas"
];

const initialGroupsData = {
  general: [
    {
      id: 1,
      groupName: "Group A",
      members: 2,
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile1.jpg",
      admins: ["John Doe", "Jane Smith"],
    },
    {
      id: 2,
      groupName: "Group B",
      members: 1,
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile3.jpg",
      admins: ["Emily Johnson"],
    },
  ],
  highPayment: [
    {
      id: 3,
      groupName: "High Paying Group 1",
      members: 3,
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile1.jpg",
      admins: ["David Wilson", "Sarah Davis", "Jessica Moore"],
    },
  ],
  outdoor: [
    {
      id: 4,
      groupName: "Outdoor Group 1",
      members: 5,
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile6.jpg",
      admins: ["Amanda Anderson", "William Thomas", "James Taylor", "Jane Smith", "John Doe"],
    },
  ],
};

const sectionColors = [
  { bg: "bg-green-200", text: "text-green-500" },
  { bg: "bg-red-200", text: "text-red-500" },
  { bg: "bg-blue-200", text: "text-blue-500" },
  { bg: "bg-yellow-200", text: "text-yellow-500" },
  { bg: "bg-purple-200", text: "text-purple-500" },
  { bg: "bg-pink-200", text: "text-pink-500" },
  { bg: "bg-indigo-200", text: "text-indigo-500" },
  { bg: "bg-teal-200", text: "text-teal-500" },
  { bg: "bg-orange-200", text: "text-orange-500" },
  { bg: "bg-gray-200", text: "text-gray-500" },
];

export default function GroupPage() {
  const [groupsData, setGroupsData] = useState(initialGroupsData);
  const [isOpen, setIsOpen] = useState(false);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", admins: [], category: "general" });
  const [newSection, setNewSection] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openModal = (category) => {
    setNewGroup({ name: "", admins: [], category });
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (!newGroup.name || newGroup.admins.length === 0) return;

    setGroupsData((prevData) => ({
      ...prevData,
      [newGroup.category]: [
        ...prevData[newGroup.category],
        {
          id: Date.now(),
          groupName: newGroup.name,
          members: newGroup.admins.length,
          createdBy: "Admin",
          createdByProfilePic: "/path/to/profileNewAdmin.jpg",
          admins: newGroup.admins,
        },
      ],
    }));

    setIsOpen(false);
  };

  const handleConfirmSection = () => {
    if (!newSection.trim()) return;

    setGroupsData((prevData) => ({
      ...prevData,
      [newSection]: [],
    }));

    setIsSectionOpen(false);
    setNewSection("");
  };

  const renderGroupSection = (title, groupData, category, index) => {
    const color = sectionColors[index % sectionColors.length];

    return (
      <div key={category} className="mb-7 overflow-hidden">
        <div className={`${color.bg} py-3 px-4 flex justify-between items-center`}>
          <div>
            <h2 className={`font-semibold text-xl ${color.text}`}>{title}</h2>
            <span className="text-gray-600">{groupData.length} groups</span>
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
                <TableHead className="w-[130px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupData.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.groupName}</TableCell>
                  <TableCell>{group.members}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        src={group.createdByProfilePic}
                        alt={group.createdBy}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{group.createdBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {group.admins.slice(0, 3).map((admin, i) => (
                        <img
                          key={admin}
                          src={`/path/to/profiles/${admin.replace(/\s+/g, "").toLowerCase()}.jpg`}
                          alt={admin}
                          className={`w-8 h-8 rounded-full border-2 border-white -ml-2 ${i === 0 ? "ml-0" : ""}`}
                          title={admin}
                        />
                      ))}
                      {group.admins.length > 3 && (
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
                        side="right" align="start"
                        className="bg-white border border-gray-200 shadow-lg rounded-md"
                      >
                        <DropdownMenuItem onClick={() => console.log("Edit", group)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setConfirmDelete({ category, group })}>
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
                    onClick={() => openModal(category)}
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

          <div className="flex items-center gap-4">
            <p className="text-right text-sm font-medium text-gray-600 leading-tight">
              Asset<br />Admins
            </p>
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                W
              </div>
              <div className="w-8 h-8 rounded-full bg-lime-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                L
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                S
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 text-sm font-bold flex items-center justify-center border-2 border-white">
                2+
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl mb-3 shadow-md py-4 px-4">
        {Object.entries(groupsData).map(([category, groupData], index) =>
          renderGroupSection(
            category.charAt(0).toUpperCase() + category.slice(1) + " Groups",
            groupData,
            category,
            index
          )
        )}
        <Button className="w-fit mt-4" onClick={() => setIsSectionOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Section
        </Button>
      </div>

      <AddGroupDialog
        open={isOpen}
        setOpen={setIsOpen}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        members={Members}
        onConfirm={handleConfirm}
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
          <DialogContent
            className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
            style={{ minHeight: "280px", display: "flex" }}
          >
            <CircleX className="w-12 h-12" style={{ color: "#fb5f59" }} strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete?
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
                className="rounded-full px-7 font-custom"
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={() => {
                  const { category, group } = confirmDelete;
                  setGroupsData((prev) => ({
                    ...prev,
                    [category]: prev[category].filter((g) => g.id !== group.id),
                  }));
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
