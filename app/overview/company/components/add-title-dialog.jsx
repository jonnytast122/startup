import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPositions, addPosition } from "@/lib/api/position";

export default function AddTitleDialog({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const addPositionMutation = useMutation({
    mutationFn: addPosition,
    onSuccess: () => {
      setOpen(false);
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries(["positions"]);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200"
          onClick={() => setOpen(true)}
        >
          + Add Title
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Title Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>
        <div>
          {/* Form Content */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Title Name:
            </label>
            <input
              id="title-name"
              type="text"
              placeholder="Title Name"
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Description ( Optional ):
            </label>
            <input
              id="description-name"
              type="text"
              placeholder="Description"
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div
            onClick={() => {
              addPositionMutation.mutate({ title, description });
            }}
            className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4"
          >
            <Button className="py-4 px-6 text-md font-custom rounded-full">
              {addPositionMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
