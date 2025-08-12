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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const mockUsers = [
  { _id: "u1", name: "Alice Johnson" },
  { _id: "u2", name: "Bob Smith" },
  { _id: "u3", name: "Charlie Brown" },
  { _id: "u4", name: "Diana Prince" },
];

export default function AddGroupDialog({
  isOpen,
  onClose,
  newGroup,
  setNewGroup,
}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const addGroupMutation = useMutation({
    mutationFn: () =>
      addGroup({
        name: newGroup.name,
        section: newGroup.section,
        members: newGroup.admins.length > 0 ? [newGroup.admins[0].id] : [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
      setNewGroup({ name: "", section: "", members: [] });
      setError("");
      onClose();
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    },
  });

  const handleFinish = () => {
    if (!newGroup.name.trim()) {
      setError("Group name is required.");
      return;
    }

    console.log("Adding group with data:", {
      name: newGroup.name,
      section: newGroup.section,
      members: newGroup.admins.map((a) => a._id),
    });

    setError("");
    addGroupMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Input
            placeholder="Group name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                <span>
                  {newGroup.admins?.length > 0
                    ? `Admin: ${newGroup.admins[0].name}`
                    : "Select Admin (optional)"}
                </span>
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {mockUsers.map((user) => (
                <DropdownMenuItem
                  key={user._id}
                  onClick={() => setNewGroup({ ...newGroup, admins: [user] })}
                >
                  {user.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleFinish} disabled={addGroupMutation.isLoading}>
            {addGroupMutation.isLoading ? "Creating..." : "Finish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
