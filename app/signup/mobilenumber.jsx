"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheck, FaAngleLeft } from "react-icons/fa";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Styles for PhoneInput

export default function MobileNumber({ onNextStep, onBackStep, currentStep }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      onNextStep();
    }
  };

  // Render progress circles
  const renderStepCircles = () => {
    const steps = 5;
    return Array.from({ length: steps }, (_, index) => {
      const stepNumber = index + 2;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <div className="flex items-center" key={stepNumber}>
          <div
            className={`rounded-full flex items-center justify-center border-2 
      ${isCompleted ? "bg-blue-500" : "bg-transparent"} 
      ${isCompleted || isActive ? "border-blue-500" : "border-gray-300"} 
      w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10`}
          >
            {isCompleted && (
              <FaCheck
                className="text-white text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]"
              />
            )}
          </div>

          {/* Connecting Line */}
          {index < steps - 1 && (
            <div
              className="border-t-2 border-gray-300 mx-2 w-6 sm:w-8 md:w-10 lg:w-12 xl:w-14"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white flex h-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl flex justify-center">
        <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px] w-full">
          <CardContent className="p-14 md:p-16 flex flex-col justify-center relative">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBackStep}
              className="flex items-center absolute top-4 left-4 p-2 rounded-full text-dark-gray hover:bg-gray-200"
            >
              <FaAngleLeft size={20} />
              <p className="font-vietname text-xs font-medium text-dark-gray ml-2">
                Back
              </p>
            </button>

            {/* Step Circles */}
            <div className="flex justify-center gap-2 mb-6 mt-2">
              {renderStepCircles()}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 items-center">
                <h1 className="font-vietname text-sm font-medium text-dark-gray mt-5">
                  What's your mobile phone?
                </h1>
                <p className="font-vietname-thin text-xs text-center font-medium text-dark-gray mt-4 text-gray-500 items-center justify-center">
                  Sign up to your app easily and securely with your mobile<br />
                  phone number
                </p>
                {/* Phone Number with Country Flag Selection */}
                <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                  <PhoneInput
                    international
                    defaultCountry={selectedCountry}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="w-full px-2 py-1 font-custom text-sm sm:text-base md:text-lg text-gray-700 focus:outline-none"
                    placeholder="Mobile Phone"
                  />
                </div>
                {/* Get OTP Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-56 rounded-full mt-4 font-vietname text-2sm"
                    disabled={!phoneNumber}
                  >
                    GET OTP
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
