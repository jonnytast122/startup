// components/add-group-dialog.jsx
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
import { Filter } from "lucide-react";
import { useState } from "react";

export default function AddGroupDialog({ open, setOpen, newGroup, setNewGroup, members, onConfirm }) {
  const [error, setError] = useState("");

  const handleFinish = () => {
    if (!newGroup.name.trim()) {
      setError("Group name is required.");
      return;
    }
    setError("");
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold mb-4">Group settings</DialogTitle>
        </DialogHeader>

        <div className="w-full flex flex-wrap sm:flex-nowrap sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium whitespace-nowrap">Group's name:</label>
            <Input
              placeholder="Group's name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2 h-10">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <span className="text-sm text-gray-500 whitespace-nowrap">{newGroup.admins.length} selected</span>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm -mt-3 mb-2">{error}</p>}

        <div className="overflow-x-auto">
          <div className="min-w-[600px] rounded-md overflow-hidden border border-gray-200">
            <div className="grid grid-cols-4 bg-gray-100 text-sm font-semibold text-gray-700 px-4 py-2">
              <div className="col-span-1">First name</div>
              <div className="col-span-1">Last name</div>
              <div className="col-span-1">Department</div>
              <div className="col-span-1">Job</div>
            </div>
            {[
              { first: "Lucy", last: "Trevo", dept: "Marketing", job: "Accountant" },
              { first: "John", last: "Mark", dept: "Marketing", job: "Marketing" },
              { first: "Doe", last: "Ibrahim", dept: "Officer", job: "HR" },
              { first: "Luke", last: "Kai", dept: "Officer", job: "General" },
              { first: "Bob", last: "Mako", dept: "Marketing", job: "Accountant" },
            ].map((member, i) => (
              <div key={i} className="grid grid-cols-4 items-center px-4 py-2 border-t text-sm">
                <div className="col-span-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={newGroup.admins.includes(member.first)}
                    onChange={() => {
                      const exists = newGroup.admins.includes(member.first);
                      setNewGroup({
                        ...newGroup,
                        admins: exists
                          ? newGroup.admins.filter((a) => a !== member.first)
                          : [...newGroup.admins, member.first],
                      });
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/28"
                      alt="avatar"
                      className="w-7 h-7 rounded-full"
                    />
                    <span>{member.first}</span>
                  </div>
                </div>
                <div className="col-span-1">{member.last}</div>
                <div className="col-span-1">{member.dept}</div>
                <div className="col-span-1">
                  <span className="text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                    {member.job}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="justify-end mt-6">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
            onClick={handleFinish}
          >
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
