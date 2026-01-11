"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function useLocalToast() {
  const [toast, setToast] = useState(null);

  const show = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(useLocalToast._tid);
    useLocalToast._tid = window.setTimeout(() => setToast(null), 3000);
  };

  const showSuccess = (message) => show("success", message);
  const showError = (message) => show("error", message);

  const ToastPortal = toast
    ? createPortal(
        <div className="fixed bottom-6 right-6 z-[1000]">
          <div
            className={`min-w-[280px] max-w-[380px] rounded-lg shadow-lg px-4 py-3 text-white flex items-start gap-3 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="mt-0.5">{toast.type === "success" ? "✅" : "⚠️"}</div>
            <div className="font-custom text-sm whitespace-pre-line">{toast.message}</div>
          </div>
        </div>,
        document.body
      )
    : null;

  return { showSuccess, showError, ToastPortal };
}

export default function UpdateCashDialog({
  open,
  onOpenChange,
  oldCash,
  onSubmit,
}) {
  const [amount, setAmount] = useState(oldCash?.toString() || "");
  const { showError, ToastPortal } = useLocalToast();

  // Sync amount when dialog opens or oldCash changes
  useEffect(() => {
    if (open) setAmount(oldCash?.toString() || "");
  }, [open, oldCash]);

  const handleUpdate = () => {
    const numeric = parseFloat(amount);
    if (!isNaN(numeric)) {
      onSubmit?.(numeric);
      onOpenChange(false);
    } else {
      showError("Please enter a valid number.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {ToastPortal}
      <DialogContent className="sm:max-w-md font-custom">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Update Cash
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        <div>
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`$${oldCash}`}
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
            />
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10" />
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button
              onClick={handleUpdate}
              className="py-4 px-6 text-lg font-custom rounded-full"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
