"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import { UserMinus, UserPlus, ChevronDown } from "lucide-react";

export default function PromoteDemoteDialog({
  open,
  setOpen,
  type,
  user,
  onConfirm,
}) {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [menuBranchOpen, setMenuBranchOpen] = useState(false);
  const [menuFeatureOpen, setMenuFeatureOpen] = useState(false);

  const allBranches = ["BKK1", "BKK2", "BKK3"];
  const allFeatures = ["Dashboard", "User Management", "Reports"];

  const branchRef = useRef(null);
  const featureRef = useRef(null);

  const toggleSelection = (item, setFn, selected) => {
    setFn((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleConfirm = () => {
    const newRole = type === "promote" ? "admin" : "user";
    onConfirm(newRole, selectedBranches, selectedFeatures);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (branchRef.current && !branchRef.current.contains(event.target)) {
        setMenuBranchOpen(false);
      }
      if (featureRef.current && !featureRef.current.contains(event.target)) {
        setMenuFeatureOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-custom w-[460px]">
        {type === "promote" ? (
          <>
            <div className="flex flex-col items-center space-y-2 pt-4 relative">
              <div className="relative w-20 h-20">
                <div className="w-full h-full rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                  {user.profile && !imageError ? (
                    <img
                      src={user.profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-lg text-gray-700 font-medium">
                      {user.firstname?.charAt(0).toUpperCase()}
                      {user.lastname?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <UserPlus className="absolute -bottom-0 -right-0 w-6 h-6 bg-white rounded-full p-1 text-blue-600 border shadow-sm" />
              </div>

              <p className="text-center text-md font-custom">
                Promote{" "}
                <span className="text-blue-600 font-semibold">
                  {user.firstname} {user.lastname}
                </span>{" "}
                to admin?
              </p>
            </div>

            <Separator className="my-4" />

            {/* Assign Branch */}
            <div className="flex justify-between items-center mb-4 relative" ref={branchRef}>
              <p className="text-sm font-medium">Assign Branch:</p>
              <div className="w-40">
                <button
                  onClick={() => setMenuBranchOpen(!menuBranchOpen)}
                  className="w-full flex justify-between items-center border rounded px-3 py-2 text-sm bg-white hover:bg-gray-100"
                >
                  <span className="truncate">
                    {selectedBranches.length > 0
                      ? `${selectedBranches.length} selected`
                      : "Select branches"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {menuBranchOpen && (
                  <div className="absolute right-0 mt-1 w-46 bg-white border rounded shadow-md z-10">
                    {allBranches.map((branch) => (
                      <label
                        key={branch}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch)}
                          onChange={() =>
                            toggleSelection(branch, setSelectedBranches, selectedBranches)
                          }
                          className="mr-2"
                        />
                        {branch}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Assign Feature */}
            <div className="flex justify-between items-center relative" ref={featureRef}>
              <p className="text-sm font-medium">Assign Features:</p>
              <div className="w-40">
                <button
                  onClick={() => setMenuFeatureOpen(!menuFeatureOpen)}
                  className="w-full flex justify-between items-center border rounded px-3 py-2 text-sm bg-white hover:bg-gray-100"
                >
                  <span className="truncate">
                    {selectedFeatures.length > 0
                      ? `${selectedFeatures.length} selected`
                      : "Select features"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {menuFeatureOpen && (
                  <div className="absolute right-0 mt-1 w-46 bg-white border rounded shadow-md z-10">
                    {allFeatures.map((feature) => (
                      <label
                        key={feature}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() =>
                            toggleSelection(feature, setSelectedFeatures, selectedFeatures)
                          }
                          className="mr-2"
                        />
                        {feature}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="mt-6" />

            <div className="flex justify-end pt-2">
              <Button onClick={handleConfirm} className="font-custom px-6">
                Promote
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 pt-6 pb-2">
              <UserMinus className="w-12 h-12 text-orange-500" />
              <p className="text-2xl font-custom text-center">
                Do you want to demote?
              </p>
            </div>
            <div className="flex justify-center pb-4">
              <Button onClick={handleConfirm} className="font-custom px-14">
                Demote
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
