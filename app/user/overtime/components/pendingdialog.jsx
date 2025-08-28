"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, XCircle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Provided user data
const user = {
  firstname: "John",
  lastname: "Doe",
  avatar: "/avatars/cameron.png",
  accessLevel: "Admin",
  phone: "012345678",
  birthday: "1990-01-01",
  branch: "Main Branch",
  department: "HR",
  title: "Manager",
  dateadded: "2022-01-01",
  cash: 123,
  profile: "/avatars/cameron.png",
  banknumber: "12345678",
  banktransfer: 100,
  single: 25,
  nochildren: 0.6,
};

export default function PendingRequest() {
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  // Sample values
  const overtimeDate = "Tue, Aug 27";
  const overtimeType = "Weekend";
  const workingHoursTotal = "5:00 hours";
  const workingHoursRange = "13:00 - 17:00";
  const attachmentsText = "Meet new client at Royale Group";

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="text-orange font-custom w-42 h-10 border border-gray-400 bg-transparent rounded-full flex items-center pl-2 pr-4 hover:bg-orange-500 hover:text-white transition-colors duration-200"
            onClick={() => setOpen(true)}
          >
            <span className="bg-orange-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
              1
            </span>
            <span>Pending Request</span>
          </Button>
        </DrawerTrigger>

        {/* Drawer */}
        <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-[420px] md:w-[480px] bg-transparent p-0 border-none outline-none">
          <div className="h-screen w-full bg-gray-100 font-custom flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-1 px-5 py-4">
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </DrawerClose>
              <h2 className="text-xl leading-none text-black">Overtime details</h2>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
              <div className="bg-white rounded-md p-4">
                <div className="h-px bg-gray-200 mb-4" />
                <div className="space-y-3">
                  {/* Overtime date */}
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 text-sm text-black">Overtime date</div>
                    <div className="col-span-8">
                      <div className="grid grid-cols-8 items-center">
                        <div className="col-span-4" />
                        <div className="col-span-4 text-sm font-semibold text-black">
                          {overtimeDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overtime type */}
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 text-sm text-black">Overtime type</div>
                    <div className="col-span-8">
                      <div className="grid grid-cols-8 items-center">
                        <div className="col-span-4" />
                        <div className="col-span-4 text-sm font-semibold text-black">
                          {overtimeType}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Working hours */}
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 text-sm text-black">Working hours</div>
                    <div className="col-span-8">
                      <div className="grid grid-cols-8 items-center">
                        <div className="col-span-4 text-sm text-black">
                          {workingHoursRange}
                        </div>
                        <div className="col-span-4 text-sm font-semibold text-black">
                          {workingHoursTotal}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 text-sm text-black">Attachments</div>
                    <div className="col-span-8">
                      <div className="grid grid-cols-8 items-center">
                        <div className="col-span-8 text-sm text-black break-words">
                          {attachmentsText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-200 my-4" />

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-base font-semibold text-blue-400">
                    {user.firstname} {user.lastname}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <DrawerFooter className="px-5 pb-4 pt-0">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="destructive"
                  className="rounded-full"
                  onClick={() => {
                    setOpen(false);
                    setRejectDialog(true);
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setOpen(false);
                    setConfirmDialog(true);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="bg-gray-100 font-custom w-[400px] text-center flex flex-col items-center gap-4">
          <CheckCircle className="w-14 h-14 text-blue-500" />
          <DialogHeader>
            <DialogTitle className="text-lg font-custom text-black">
              Confirm payment?
            </DialogTitle>
          </DialogHeader>
          <div className="bg-white rounded-lg w-full">
            <div className="w-full p-4">
              <div className="relative">
                <Input
                  placeholder="Add note to your request"
                  className="pl-10 pr-4"
                />
                <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={() => setConfirmDialog(false)} // <-- Close on confirm
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="bg-gray-100 font-custom w-[400px] text-center flex flex-col items-center gap-4">
          <XCircle className="w-14 h-14 text-red-500" />
          <DialogHeader>
            <DialogTitle className="text-lg font-custom text-black">
              Request to reject?
            </DialogTitle>
          </DialogHeader>
          <div className="bg-white rounded-lg w-full">
            <div className="w-full p-4">
              <div className="relative">
                <Input
                  placeholder="Add note to your request"
                  className="pl-10 pr-4"
                />
                <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setRejectDialog(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => setRejectDialog(false)} // <-- Close on reject
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
