"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignupFormFeature from "@/features/signup/SignupForm";

const queryClient = new QueryClient();

export default function SignupFeaturePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <SignupFormFeature />
    </QueryClientProvider>
  );
}