import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArchiveRestore } from "lucide-react";

export default function RestoreDialog({ open, setOpen, user, onConfirm }) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
        style={{ minHeight: "280px", display: "flex" }}
      >
        <ArchiveRestore
          className="w-12 h-12"
          style={{ color: "#3b82f6" }}
          strokeWidth={1.5}
        />
        <DialogTitle></DialogTitle>
        <h2 className="text-xl text-gray-900 font-custom">
          Do you want to restore?
        </h2>
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="rounded-full px-7 font-custom border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="rounded-full px-7 font-custom bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Restore
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
