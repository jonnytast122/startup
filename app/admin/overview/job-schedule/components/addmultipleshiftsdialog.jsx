import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const AddMultipleShiftsDialog = ({ open, onOpenChange }) => {
  const [shifts, setShifts] = useState([
    { date: new Date(), start: "08:00 am", end: "06:00 pm", title: "", employee: "Doe Ibrahim", location: "" },
  ]);

  const addShift = () => {
    setShifts([
      ...shifts,
      { date: new Date(), start: "08:00 am", end: "06:00 pm", title: "", employee: "Doe Ibrahim", location: "" },
    ]);
  };

  const updateShift = (index, field, value) => {
    const updated = [...shifts];
    updated[index][field] = value;
    setShifts(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Add multiple shifts</DialogTitle>
        </DialogHeader>
        <Separator orientation="horizontal" className="mr-2 w-full bg-black" />

        <div className="space-y-4">
          {shifts.map((shift, index) => (
            <div key={index} className="flex items-center space-x-2 border-b pb-3">
              <Input
                type="date"
                value={format(shift.date, 'yyyy-MM-dd')}
                onChange={(e) => updateShift(index, "date", new Date(e.target.value))}
                className="w-36 h-9"
              />
              <div className="flex items-center space-x-1">
                <span className="text-sm">Start:</span>
                <Input
                  type="time"
                  value={shift.start}
                  onChange={(e) => updateShift(index, "start", e.target.value)}
                  className="w-28 h-9"
                />
                <span className="text-sm">End:</span>
                <Input
                  type="time"
                  value={shift.end}
                  onChange={(e) => updateShift(index, "end", e.target.value)}
                  className="w-28 h-9"
                />
              </div>
              <div className="font-semibold w-9 text-right text-sm ">
                10:00 <span className="text-xs font-normal">hours</span>
              </div>
              <Input
                placeholder="Shift title"
                value={shift.title}
                onChange={(e) => updateShift(index, "title", e.target.value)}
                className="flex-1 w-48 h-9"
              />
              <Select value={shift.employee} onValueChange={(val) => updateShift(index, "employee", val)}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doe Ibrahim">Doe Ibrahim</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Location"
                value={shift.location}
                onChange={(e) => updateShift(index, "location", e.target.value)}
                className="w-48 h-9"
              />
            </div>
          ))}

          <div className="flex items-center justify-center space-x-2 mt-4 cursor-pointer text-blue-500 hover:text-blue-700" onClick={addShift}>
            <Plus size={18} />
            <span className="text-sm">Add shifts</span>
          </div>

          <div className="flex justify-end gap-4 border-t pt-2">
            <Button
              variant="outline"
              className="h-9 w-32 rounded-3xl border-blue-500 text-blue-500 hover:bg-blue-50 font-custom"
              onClick={() => onOpenChange(false)}
            >
              Save Draft
            </Button>
            <Button
              className="h-9 w-32 rounded-3xl hover:bg-blue-700 text-white font-custom"
            >
              Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMultipleShiftsDialog;