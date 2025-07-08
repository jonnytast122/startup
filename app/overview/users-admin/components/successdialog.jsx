"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SuccessDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="text-center w-auto h-auto p-10 font-custom border border-gray-300 rounded-xl flex flex-col items-center justify-center"
      >
        <DialogHeader className="flex flex-col items-center justify-center space-y-4 p-32">
          <img
            src="/images/account_create.png"
            alt="Account Created"
            className="w-56 h-56 rounded-md"
          />
          <DialogTitle className="font-custom text-2xl">
            Successfully
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
