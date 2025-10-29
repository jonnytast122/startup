"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SelectShiftDialog({ open, onOpenChange, shifts = [], onConfirm }) {
  // keep selectedId as string to avoid number/string mismatch
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedId("");
    }
  }, [open]);

  const handleConfirm = () => {
    console.log("selectedId", selectedId);
    const index = parseInt(selectedId.split('-')[1])
    const chosen = shifts[index];
    console.log("chosen", chosen);
    if (chosen) onConfirm(chosen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="font-custom text-xl">Select a shift</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {shifts.length === 0 && (
            <div className="text-sm text-gray-500 font-custom">No shifts available.</div>
          )}
          {shifts.map((shift, idx) => {
            // create stable unique ids/keys even if shift.id is falsy
            const shiftIdStr = String(shift?.id ?? `idx-${idx}`);
            const inputId = `shift-radio-${shiftIdStr}`;

            return (
              <div
                key={shift?.id ?? `shift-${idx}`} // stable key
                className="p-0"
              >
                {/* use htmlFor so label click targets the right input */}
                <label
                  htmlFor={inputId}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    id={inputId}
                    type="radio"
                    name="shift"
                    value={shiftIdStr}
                    className="mt-1"
                    checked={selectedId === shiftIdStr}
                    onChange={() => setSelectedId(shiftIdStr)}
                  />
                  <div className="flex-1">
                    <div className="font-custom text-sm font-medium">
                      {shift?.name || "Unnamed shift"}
                    </div>
                    {(shift?.startTime || shift?.endTime || shift?.break) && (
                      <div className="text-xs text-gray-600 font-custom">
                        {shift?.startTime && shift?.endTime ? (
                          <span>
                            {shift.startTime} - {shift.endTime}
                          </span>
                        ) : null}
                        {shift?.break ? (
                          <span className="ml-2 text-gray-500">
                            Break: {shift?.break?.start} - {shift?.break?.end}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full font-custom"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full font-custom"
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
