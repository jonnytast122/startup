"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutDialog({ open, setOpen }) {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.push("/signin");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[350px] bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center"
        onPointerDownOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <CircleX
          className="w-12 h-12"
          style={{ color: "#fb5f59" }}
          strokeWidth={1.5}
        />
        <DialogTitle className="sr-only">Logout Confirmation</DialogTitle>
        <h2 className="text-xl text-gray-900 font-custom">
          Do you want to logout?
        </h2>
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="rounded-full px-7 font-custom border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="rounded-full px-7 font-custom bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
