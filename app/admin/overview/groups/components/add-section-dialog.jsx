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
import { Separator } from "@/components/ui/separator";

export default function AddSectionDialog({
  open,
  setOpen,
  newSection,
  setNewSection,
  newSectionColor,
  setNewSectionColor,
  onConfirm,
  isLoading,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Section Setting</DialogTitle>
        </DialogHeader>

        <Separator orientation="horizontal" className="my-2 w-full mb-4 mt-2" />

        {/* Section Name */}
        <Input
          placeholder="Section name"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          className="mb-4"
        />

        {/* Section Color Picker */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="section-color" className="text-sm font-medium">
            Section Color:
          </label>
          <input
            id="section-color"
            type="color"
            value={newSectionColor}
            onChange={(e) => setNewSectionColor(e.target.value)}
            className="w-12 h-8 p-0 border-none"
          />
          <span>{newSectionColor}</span>
        </div>

        <DialogFooter>
          <Button onClick={onConfirm}>
            {isLoading ? "Confirming..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
