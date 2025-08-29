"use client";

import AddGroupDialog from "./add-group-dialog";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroup, updateGroup } from "@/lib/api/group";

export default function EditGroupDialog({
  // isOpen,
  // onClose,
  // group,
  // onSave,
  // members,
  // isViewMode = false,
  isOpen,
  onClose,
  group,
  setNewGroup,
  isViewMode = false,
}) {
  const queryClient = useQueryClient();

  // const [editableGroup, setEditableGroup] = useState({
  //   name: "",
  //   members: [],
  //   section: "",
  // });

  const { data } = useQuery({
    queryKey: ["group", group?._id],
    queryFn: () => fetchGroup(group?._id),
    enabled: !!group?._id,
  });

  const editGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
      setNewGroup({ name: "", section: "", members: [] });
      setError("");
      onClose();
    },
    onError: (error) => {
      console.log("Error editing group:", error);
      setError("Something went wrong. Please try again.");
    },
  });

  // useEffect(() => {
  //   if (group) {
  //     setEditableGroup({
  //       name: group.name || "",
  //       members: group.members || [],
  //       section: group.section || "",
  //     });
  //   }
  // }, [group]);

  const handleSave = () => {
    if (!group.name.trim()) return;
    editGroupMutation.mutate({
      id: group?._id,
      data: { name: group.name },
    });
    onClose();
  };

  return (
    <AddGroupDialog
      isOpen={isOpen}
      onClose={onClose}
      newGroup={{
        ...group,
        members: data?.members?.map((e) => e._id) || [],
      }}
      setNewGroup={setNewGroup}
      isViewMode={isViewMode} // ✅ Pass down view mode
      isEdit={true} // ✅ Indicate this is an edit dialog
      onUpdate={handleSave}
    />
  );
}
