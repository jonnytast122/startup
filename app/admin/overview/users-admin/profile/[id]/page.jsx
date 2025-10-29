"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { FaSpinner } from "react-icons/fa";
import { fetchUser } from "@/lib/api/user";

const UserProfile = dynamic(() => import("../UserProfile"), { ssr: false });

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

  return <UserProfile user={user} />;
}
