"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UserProfileSection from "./user-profile-section";
import { FaSpinner } from "react-icons/fa";
import { fetchUser } from "@/lib/api/user";

export default function Page() {
  const { id } = useParams();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-full py-10">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );

  if (error) return <p>Failed to load user</p>;

  const displayName =
    user?.employee?.name || user?.name || user?.fullName || "Unknown";
  const [firstName, ...lastParts] = displayName.split(" ");
  const employeePayload = {
    employeeId: user?.employee?.id || user?.employee?._id || user?.id || id,
    profile: user?.profileImg || user?.employee?.profileImg || null,
    fullname: displayName,
    firstname: firstName || "",
    lastname: lastParts.join(" ") || "",
    employee: user?.employee || { _id: user?.id || id },
  };

  return <UserProfileSection employee={employeePayload} />;
}
