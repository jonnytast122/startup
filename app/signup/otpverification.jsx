"use client";

import React, { useState, useEffect } from "react"; // Explicitly import React
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheck, FaAngleLeft } from "react-icons/fa";
import Account_Created from "./account_created"; // Import Account_Created component

export default function OTPVerication({ onNextStep, onBackStep, currentStep }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // New state for verification

  // Handle OTP input change
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && !isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  // Format the time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Start the countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Handle OTP verification
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate OTP verification success
    setIsVerified(true);
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
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2
              ${isCompleted ? "bg-blue-500" : "bg-transparent"} 
              ${isCompleted || isActive ? "border-blue-500" : "border-gray-300"}`}
          >
            {isCompleted && <FaCheck className="text-white" size={16} />}
          </div>
          {index < steps - 1 && (
            <div className="w-8 h-0 border-t-2 border-gray-300 mx-2"></div>
          )}
        </div>
      );
    });
  };

  // If OTP is verified, show Account Created component
  if (isVerified) {
    return <Account_Created onNextStep={onNextStep} />;
  }

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
            <div className="flex justify-center gap-2 mb-6">
              {renderStepCircles()}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 items-center">
                <h1 className="font-vietname text-lg font-medium text-dark-gray mt-5">
                  OTP Verification
                </h1>
                <h1 className="font-vietname-thin text-xs font-medium text-dark-gray mt-5 text-gray-500">
                  Enter the OTP sent to <span className="text-blue-500">+855 123 456</span>
                </h1>

                {/* OTP Input */}
                <div className="flex gap-2 justify-center mt-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      maxLength="1"
                      className="w-12 h-12 text-center text-2xl border-b-2 border-gray-300 focus:outline-none text-blue"
                    />
                  ))}
                </div>

                {/* OTP Expiration Text */}
                <p className="text-xs text-gray-500 mt-3">
                  Code expires in {formatTime(timeLeft)}
                </p>

                {/* Verify Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-56 rounded-full mt-2 font-vietname text-2sm"
                    disabled={otp.join("").length !== 6 || isResending}
                  >
                    Verify
                  </Button>
                </div>

                {/* Resend OTP Text */}
                <p className="text-xs text-center text-gray-500 mt-2">
                  Don't receive the OTP?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsResending(true);
                      setTimeout(() => setIsResending(false), 2000); // simulate resend delay
                    }}
                    className="text-blue-500"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
