"use client";

import dynamic from "next/dynamic";

// Dynamically import your UserProfile component without SSR
const UserProfile = dynamic(() => import("./UserProfile"), { ssr: false });

export default function Page() {
  return <UserProfile />;
}
