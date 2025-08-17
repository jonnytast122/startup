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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addGroup, fetchMembers } from "@/lib/api/group";

const members = [
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

  const { data } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
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
      console.log("Error adding group:", error);
      setError("Something went wrong. Please try again.");
    },
  });

  const handleFinish = () => {
    if (!newGroup.name.trim()) {
      setError("Group name is required.");
      return;
    }

    setError("");
    addGroupMutation.mutate({
      name: newGroup.name,
      section: newGroup.section,
      members: newGroup.members,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
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
              className="w-full"
              disabled={isViewMode}
            />
          </div>

          <div
            className={`flex items-center gap-2 ${
              isViewMode ? "pointer-events-none opacity-60" : ""
            }`}
          >
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
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {newGroup.members?.length ?? 0} selected
            </span>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm -mt-3 mb-2">{error}</p>}

        <div className="overflow-x-auto">
          <div className="min-w-[600px] rounded-md overflow-hidden border border-gray-200">
            <div className="grid grid-cols-5 bg-gray-100 text-sm font-semibold text-gray-700 px-5 py-2">
              <div className="col-span-1">First name</div>
              <div className="col-span-1">Last name</div>
              <div className="col-span-1">Branch</div>
              <div className="col-span-1">Department</div>
              <div className="col-span-1">Job</div>
            </div>
            {(data?.results || []).map((member, i) => {
              const lastName = `${member?.employee?.name.split(" ")[0]}`;
              const firstName = `${member?.employee?.name.split(" ")[1]}`;
              const fullName = `${lastName} ${firstName}`;
              const id = member?.employee?.id || member?.id;

              const checked = newGroup.members?.includes(id) ?? false;

              console.log("newGroups", newGroup);
              return (
                <div
                  key={i}
                  className="grid grid-cols-5 items-center px-5 py-2 border-t text-sm"
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={checked}
                      disabled={isViewMode}
                      onChange={() => {
                        if (checked) {
                          setNewGroup({
                            ...newGroup,
                            members: newGroup.members.filter((a) => a !== id),
                          });
                        } else {
                          setNewGroup({
                            ...newGroup,
                            members: [...newGroup.members, id],
                          });
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          "https://res.cloudinary.com/dt89p7jda/image/upload/v1755415319/image_65_kl6s4j.png"
                        }
                        alt={fullName}
                        className="w-7 h-7 rounded-full"
                      />
                      <span>{firstName}</span>
                    </div>
                  </div>
                  <div className="col-span-1">{lastName}</div>
                  <div className="col-span-1">{member?.branch ?? ""}</div>
                  <div className="col-span-1">{member?.department ?? ""}</div>
                  <div className="col-span-1">
                    {member?.job && (
                      <span className="text-blue-500 border border-blue-500 px-3 py-1 rounded-md text-xs">
                        {member?.job ?? ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isViewMode && (
          <DialogFooter className="justify-end mt-6">
            {isEdit ? (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
                onClick={onUpdate}
              >
                {/* {addGroupMutation.isPending ? "Updating..." : "Update"} */}
                {"Update"}
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
