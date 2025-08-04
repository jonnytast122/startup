"use client";

import AddGroupDialog from "./add-group-dialog";
import { useState, useEffect } from "react";

export default function EditGroupDialog({ open, setOpen, group, onSave, members, isViewMode = false }) {
  const [editableGroup, setEditableGroup] = useState({
    name: "",
    admins: [],
    category: "general",
  });

  useEffect(() => {
    if (group) {
      setEditableGroup({
        name: group.groupName || "",
        admins: group.admins || [],
        category: group.category || "general",
        id: group.id,
      });
    }
  }, [group]);

  const handleSave = () => {
    if (!editableGroup.name.trim()) return;
    onSave({
      id: editableGroup.id,
      groupName: editableGroup.name,
      admins: editableGroup.admins,
      category: editableGroup.category,
    });
    setOpen(false);
  };

  return (
    <AddGroupDialog
      open={open}
      setOpen={setOpen}
      newGroup={editableGroup}
      setNewGroup={setEditableGroup}
      members={members}
      onConfirm={handleSave}
      isViewMode={isViewMode} // ✅ Pass down view mode
    />
  );
}
