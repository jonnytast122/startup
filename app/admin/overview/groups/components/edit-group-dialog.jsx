"use client";

import AddGroupDialog from "./add-group-dialog";
import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGroup, updateGroup } from "@/lib/api/group";

export default function EditGroupDialog({
  isOpen,
  onClose,
  group,
  setNewGroup,
  isViewMode = false,
}) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["group", group?._id],
    queryFn: () => fetchGroup(group?._id),
    enabled: !!group?._id,
  });

  useEffect(() => {
    if (data?.members) {
      setNewGroup({
        ...group,
        name: data.name,
        members: data.members,
        section: group.section,
      });
    }
  }, [data]);

  const editGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
      setNewGroup({ name: "", section: "", members: [] });
      onClose();
    },
    onError: (error) => {
      console.error("Error editing group:", error);
    },
  });

  const handleSave = (updatedGroup) => {
    const body = {
      name: updatedGroup.name,
      members: updatedGroup.members.map((u) => u._id || u.id),
    };

    editGroupMutation.mutate({
      id: group._id,
      data: body,
    });
  };

  const members = data?.members || group?.members || [];

  return (
    <AddGroupDialog
      isOpen={isOpen}
      onClose={onClose}
      newGroup={{
        ...group,
        name: data?.name || group.name,
        members,
        section: group?.section || "",
      }}
      setNewGroup={setNewGroup}
      isViewMode={isViewMode}
      isEdit={true}
      onUpdate={handleSave}
    />
  );
}
