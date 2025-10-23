"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
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

  console.log("User data fetched:", user);

  if (isLoading) return <p>Loading user...</p>;
  if (error) return <p>Failed to load user</p>;

  return <UserProfile user={user} />;
}
