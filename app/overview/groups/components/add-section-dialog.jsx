// components/add-section-dialog.jsx
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

export default function AddSectionDialog({ open, setOpen, newSection, setNewSection, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Section Setting</DialogTitle>
        </DialogHeader>
        <Separator orientation="horizontal" className="my-2 w-full mb-4 mt-2" />

        <Input
          placeholder="Section name"
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
