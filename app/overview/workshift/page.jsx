// WorkShiftPage.jsx
"use client";

import { useState } from "react";
import { BookCheck, Plus, MoreHorizontal, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddWorkShiftDialog from "./components/add-shift-dialog";
import CambodiaCalendar from "./components/calendar-screen";

export default function WorkShiftPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Shift");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shifts, setShifts] = useState([
    {
      id: 1,
      name: "Morning shift",
      status: "Active",
      createdBy: "Vely Sokheng",
      profilePic: "/path/to/vely.jpg",
    },
    {
      id: 2,
      name: "General shift",
      status: "Inactive",
      createdBy: "Vely Sokheng",
      profilePic: "/path/to/vely.jpg",
    },
  ]);

  const handleAddShift = (newShift) => {
    setShifts((prev) => [...prev, newShift]);
  };

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center space-x-3">
            <BookCheck className="text-[#2998FF]" width={40} height={40} />
            <span className="font-custom text-3xl text-black">Work shift</span>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-right text-sm font-medium text-gray-600 leading-tight">
              Asset<br />Admins
            </p>
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-bold flex items-center justify-center border-2 border-white">W</div>
              <div className="w-8 h-8 rounded-full bg-lime-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">L</div>
              <div className="w-8 h-8 rounded-full bg-pink-400 text-white text-sm font-bold flex items-center justify-center border-2 border-white">S</div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 text-sm font-bold flex items-center justify-center border-2 border-white">2+</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="flex">
          {["Shift", "Calendar"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-custom text-lg transition-all ${activeTab === tab ? "bg-white text-blue-500 rounded-t-xl text-xl" : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Shift" && (
          <div className="m-5">
            <div className="bg-green-100 px-6 py-4">
              <h3 className="text-green-700 font-semibold">Work shift</h3>
              <p className="text-xs text-gray-600">{shifts.length} shifts</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created by</TableHead>
                  <TableHead className="text-center align-middle">Edit</TableHead>
                  <TableHead className="text-center align-middle"></TableHead>
                  <TableHead className="text-center align-middle"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${shift.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          }`}
                      >
                        {shift.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img
                          src={shift.profilePic}
                          alt={shift.createdBy}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-blue-600">{shift.createdBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center align-middle">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="p-1 rounded hover:bg-gray-100 inline-flex items-center justify-center">
                            <MoreHorizontal className="w-4 h-4" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent side="right" align="start" className="w-32 p-2 space-y-1 bg-white">
                          <Button variant="ghost" className="w-full text-left text-sm">
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full text-left text-sm text-red-500"
                            onClick={() => setConfirmDelete(shift)}
                          >
                            Delete
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4">
              <Button
                className="border-none shadow-none bg-transparent text-blue-700 py-0 m-0 hover:bg-blue-200"
                onClick={() => setDialogOpen(true)}
              >
                <Plus size={12} className="mr-2" /> Add new work shift
              </Button>
            </div>

            <AddWorkShiftDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onSubmit={handleAddShift}
            />
          </div>
        )}

        {activeTab === "Calendar" && (
          <div className="p-4">
            <CambodiaCalendar />
          </div>
        )}
      </div>

      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent
            className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
            style={{ minHeight: "280px", display: "flex" }}
          >
            <CircleX className="w-12 h-12" style={{ color: "#fb5f59" }} strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5 font-custom">
              Do you want to delete this workshift?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                className="rounded-full px-7 font-custom"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full px-7 font-custom"
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={() => {
                  setShifts((prev) => prev.filter((s) => s.id !== confirmDelete.id));
                  setConfirmDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}