"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { useState } from "react";
import AddUserDialog from "./adduserdialog";

export default function UploadDialog({ open, onOpenChange }) {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  const handleNext = () => {
    onOpenChange(false);
    setShowAddUserDialog(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <DialogTitle></DialogTitle>
            <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
              Step 1: Upload File
            </h1>
            <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
            <p className="text-center text-md font-custom">
              Upload the CSV file and select import settings
            </p>
          </DialogHeader>

          <div className="w-full flex justify-center items-center mt-10 px-4">
            <div
              className="
                w-full 
                max-w-md 
                aspect-square 
                lg:aspect-auto lg:w-[1000px] lg:h-[400px]
                border-2 border-dashed border-gray-300 
                rounded-lg 
                flex flex-col justify-center items-center 
                text-center px-6 py-8
              "
            >
              <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-black font-custom">
                Select a file or drag and drop here
              </p>
              <p className="text-gray-500 font-custom">
                JPG, PNG or PDF, file size no more than 10MB
              </p>
              <label
                htmlFor="file-upload"
                className="mt-4 font-custom inline-flex items-center justify-center cursor-pointer text-blue-500 font-medium border border-blue-500 rounded-lg bg-white hover:bg-blue-500 hover:text-white transition-colors duration-200 px-4 py-2 shadow-sm hover:shadow-md"
              >
                Select File
              </label>
              <input id="file-upload" type="file" className="hidden" />
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div className="w-full flex justify-end gap-4 px-4 md:px-6 lg:px-32 mt-4">
            <Button
              variant="outline"
              className="py-4 px-6 text-lg font-custom rounded-full border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="py-4 px-6 text-lg font-custom rounded-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AddUserDialog rendered after UploadDialog */}
      {showAddUserDialog && (
        <AddUserDialog
          open={true}
          onClose={() => setShowAddUserDialog(false)}
        />
      )}
    </>
  );
}
