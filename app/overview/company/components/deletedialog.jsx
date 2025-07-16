"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
        style={{ minHeight: "280px", display: "flex" }}
      >
        <CircleX
          className="w-12 h-12"
          style={{ color: "#fb5f59" }}
          strokeWidth={1.5}
        />
        <h2 className="text-xl text-gray-900 font-custom">
          Do you want to delete?
        </h2>
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="rounded-full px-7 font-custom border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="rounded-full px-7 font-custom bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
