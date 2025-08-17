"use client";

import { useState } from "react";
import { UserRound, Search } from "lucide-react";
import UsersScreen from "./components/userscreen";
import AdminsScreen from "./components/adminscreen";
import ArchivedScreen from "./components/archievedscreen";
import AddUserDialog from "./components/adduserdialog";
import AddAdminDialog from "./components/addadmindialog";

import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/user";

export default function UserAdminPage() {
  const [activeTab, setActiveTab] = useState("Users");
  const [usersCount, setUsersCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogType, setDialogType] = useState(null);

  // ✅ Fetch users (paginated response)
  const { data, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => fetchUsers(searchQuery),
    onSuccess: (data) => {
      setUsersCount(data?.results?.length || 0);

      // derive admins count from same response
      const admins = data?.results?.filter(
        (u) => u.employee?.role === "admin" || u.employee?.role === "owner"
      );
      setAdminsCount(admins?.length || 0);
    },
  });

  const users = data?.results || [];

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
                setSearchQuery("");
              }}
              className={`flex-1 py-3 font-custom sm:text-md md:text-md lg:text-2xl transition-all ${
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

        {/* Search Bar */}
        <div className="flex items-center p-4 bg-white border-b">
          <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "Users"
                  ? "Search users..."
                  : activeTab === "Admins"
                  ? "Search admins..."
                  : "Search users..."
              }
              className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 font-custom">
          {activeTab === "Users" && (
            <UsersScreen
              users={users}
              setUsersCount={setUsersCount}
              searchQuery={searchQuery}
              onAddUser={() => setDialogType("user")}
              isLoading={isLoading}
            />
          )}
          {activeTab === "Admins" && (
            <AdminsScreen
              admins={users.filter(
                (u) =>
                  u.employee?.role === "admin" || u.employee?.role === "owner"
              )}
              setAdminsCount={setAdminsCount}
              searchQuery={searchQuery}
              onAddAdmin={() => setDialogType("admin")}
              isLoading={isLoading}
            />
          )}
          {activeTab === "Archived" && (
            <ArchivedScreen searchQuery={searchQuery} />
          )}
        </div>
      </div>

      {/* Dialogs */}
      {dialogType === "user" && (
        <AddUserDialog open={true} onClose={() => setDialogType(null)} />
      )}
      {dialogType === "admin" && (
        <AddAdminDialog open={true} onClose={() => setDialogType(null)} />
      )}
    </div>
  );
}
