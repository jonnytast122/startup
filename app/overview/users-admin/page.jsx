"use client";

import { useState } from "react";
import { UserRound, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import UsersScreen from "./components/userscreen";
import AdminsScreen from "./components/adminscreen";
import ArchivedScreen from "./components/archievedscreen";
import AddUserDialog from "./components/adduserdialog"; // Import the dialog
import AddAdminDialog from "./components/addadmindialog";

export default function UserAdminPage() {
  const [activeTab, setActiveTab] = useState("Users");
  const [usersCount, setUsersCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogType, setDialogType] = useState(null); // 'user' or 'admin'

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center space-x-3 p-5">
          <UserRound className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">
            Users & Admins
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white rounded-xl shadow-md">
        <div className="flex">
          {["Users", "Admins", "Archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery(""); // Reset search when switching tabs
              }}
              className={`flex-1 py-3 font-custom text-2xl transition-all ${
                activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab} {tab === "Users" && `(${usersCount})`}
              {tab === "Admins" && `(${adminsCount})`}
            </button>
          ))}
        </div>

        {/* Search Bar & Add Button */}
        <div className="flex items-center p-4 bg-white border-b">
          <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "Users" ? "Search users..." : "Search admins..."
              }
              className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hide "Add" button for Archived */}
          {activeTab !== "Archived" && (
            <Button
              className="rounded-full px-6 sm:px-10 ml-4"
              onClick={() =>
                setDialogType(activeTab === "Users" ? "user" : "admin")
              }
            >
              Add {activeTab}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 font-custom">
          {activeTab === "Users" && (
            <UsersScreen
              setUsersCount={setUsersCount}
              searchQuery={searchQuery}
            />
          )}
          {activeTab === "Admins" && (
            <AdminsScreen
              setAdminsCount={setAdminsCount}
              searchQuery={searchQuery}
            />
          )}
          {activeTab === "Archived" && (
            <ArchivedScreen searchQuery={searchQuery} />
          )}
        </div>
      </div>

      {/* Add User Dialog */}
      {dialogType === "user" && (
        <AddUserDialog open={true} onClose={() => setDialogType(null)} />
      )}
      {dialogType === "admin" && (
        <AddAdminDialog open={true} onClose={() => setDialogType(null)} />
      )}
    </div>
  );
}
