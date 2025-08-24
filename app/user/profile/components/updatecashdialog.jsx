"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UpdateCashDialog({ open, onOpenChange, oldCash }) {
  const [amount, setAmount] = useState("");

  // initialize from oldCash
  useEffect(() => {
    setAmount(oldCash?.toString() || "");
  }, [oldCash]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={() => onOpenChange(false)}  // ✅ close on outside click
        onEscapeKeyDown={() => onOpenChange(false)}       // ✅ close on ESC
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Update Cash
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div>
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              disabled      // ✅ view-only
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4 bg-gray-100 text-black"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
