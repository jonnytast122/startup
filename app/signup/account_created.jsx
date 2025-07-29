"use client";

import React, { useState } from "react"; // Explicitly import React
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Account_Created({ onNextStep }) {
    const router = useRouter(); // ✅ initialize router

  const handleStart = () => {
    router.push("/overview"); // ✅ navigate to /dashboard
  };

  return (
    <div className="bg-white flex h-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl flex justify-center">
        <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px] w-full">
          <CardContent className="p-14 md:p-16 flex flex-col justify-center items-center">
            {/* Logo at the top */}
            <div className="mb-20">
              <img src="/images/logo.png" alt="Logo" className="w-16 h-auto mx-auto" />
            </div>

            {/* Account Created Image */}
            <div className="mb-8">
              <img
                src="/images/account_create.png"
                alt="Account Created"
                className="w-32 h-auto mx-auto"
              />
            </div>

            {/* Account Created Message */}
            <h1 className="font-vietname text-xl font-medium text-dark-gray flex text-center">
              Account Created Successfully!
            </h1>

            <p className="font-vietname-thin text-sm font-medium text-gray-500 mt-4 text-center">
              Welcome aboard! Start your success journey with ANAN!
            </p>

            {/* Let's Get Started Button */}
            <div className="flex justify-center mt-6">
              <Button
                type="button"
                className="w-56 rounded-full mt-4 font-vietname text-2sm"
                onClick={handleStart} // Navigate to next step
              >
                Let's Start!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
