"use client";

import { useState } from "react";
import Company from "./company";
import Employee from "./employees";
import MobileNumber from "./mobilenumber";
import OTPVerification from "./otpverification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";
export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    company: { logo: "", name: "", numberOfEmployees: "", industries: [] },
  });
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handleBackStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const stepComponents = [
    <SignupForm
      key="signup-form"
      formData={formData}
      setFormData={setFormData}
      handleNextStep={handleNextStep}
    />,
    <Company
      key="company"
      formData={formData}
      setFormData={setFormData}
      currentStep={currentStep}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />,
    <Employee
      key="employee"
      formData={formData}
      setFormData={setFormData}
      currentStep={currentStep}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />,
    <MobileNumber
      key="mobile-number"
      formData={formData}
      setFormData={setFormData}
      currentStep={currentStep}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />,
    <OTPVerification
      key="otp-verification"
      formData={formData}
      setFormData={setFormData}
      currentStep={currentStep}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />,
  ];

  return (
    <div className="bg-white flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {stepComponents[currentStep - 1]}
      </div>
    </div>
  );
}

function SignupForm({
  handleNextStep,
  formData,
  setFormData,
  className,
  ...props
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "firstName") setFirstName(value);
    if (id === "lastName") setLastName(value);
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormData((prev) => ({
      ...prev,
      name: `${lastName} ${firstName}`.trim(),
    }));

    handleNextStep();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px] font-custom">
        <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px]">
          <form
            className="p-14 md:p-16 flex flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <h1 className="font-medium text-dark-gray text-2xl">
                A small step for you, <br /> a giant leap for your business.
              </h1>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2 text-dark-gray">
                <div>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleChange}
                    className={cn(
                      "font-custom placeholder:text-gray-400",
                      errors.firstName && "border-red-500"
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleChange}
                    className={cn(
                      "font-custom placeholder:text-gray-400",
                      errors.lastName && "border-red-500"
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-56 rounded-full mt-4 text-sm"
                >
                  LET'S GO
                </Button>
              </div>

              <div className="text-center text-sm text-light-gray">
                Already had an account?{" "}
                <a href="/signin" className="text-blue">
                  Sign in
                </a>
              </div>
            </div>
          </form>

          {/* Right side logo */}
          <div className="hidden md:flex items-center justify-center bg-blue-100">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={240}
              height={240}
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
