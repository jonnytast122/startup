// components/DemoteDialog.jsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DemoteDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <AlertTriangle className="text-yellow-500 w-10 h-10" />
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Demote this user?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 px-4">
          This action will change the user’s access level. Are you sure you want to proceed?
        </p>
        <DialogFooter className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-full bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Confirm Demotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}