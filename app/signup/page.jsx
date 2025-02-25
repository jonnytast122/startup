"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
// Assuming Step1 is located here
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="bg-white flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {/* Step rendering based on currentStep */}
        {currentStep === 1 && (
          <SignupForm handleNextStep={handleNextStep} />
        )}
        {currentStep === 2 && (
          <Step1
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        )}
        {currentStep === 3 && (
          <Step2
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        )}
        {currentStep === 4 && (
          <Step3
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        )}
        {currentStep === 5 && (
          <Step4
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        )}
        {currentStep === 6 && (
          <Step5
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onBackStep={handleBackStep}
          />
        )}
      </div>
    </div>
  );
}

// SignupForm Component
function SignupForm({ handleNextStep, className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
        <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px]">
          <form
            className="p-14 md:p-16 flex flex-col justify-center"
            onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <h1 className="font-vietname text-lg font-medium text-dark-gray">
                  A small step for you, <br /> a giant leap for your business.
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="font-custom"
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                  required
                />
                <Input
                  className="font-custom"
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Input
                  className="font-custom"
                  id="phone-number"
                  type="phone-number"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Select>
                  <SelectTrigger className="w-full text-dark-gray font-custom">
                    <SelectValue placeholder="Where did you first hear about us?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend or family">Friend or Family</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-56 rounded-full mt-4 font-vietname text-2sm"
                >
                  LET'S GO
                </Button>
              </div>
              <div className="text-center text-2sm font-vietname-thin text-light-gray">
                Already had an account?{" "}
                <a href="#" className="text-blue">
                  Sign in
                </a>
              </div>
            </div>
          </form>
          <div className="hidden md:flex items-center justify-center bg-blue-100">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-60 h-60 object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
