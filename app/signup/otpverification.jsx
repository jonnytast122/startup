"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaCheck, FaAngleLeft, FaSpinner } from "react-icons/fa";
import axios from "axios";
import apiRoutes from "@/constants/ApiRoutes";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function OTPVerification({
  onBackStep,
  currentStep,
  formData,
  setFormData,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const otpRefs = useRef(otp.map(() => React.createRef()));
  const { login } = useAuth();
  const router = useRouter();

  // Handle OTP input
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && !isNaN(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1].current.focus();
      }
    }
  };

  // Handle backspace navigation
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  // Handle paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, otp.length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      newOtp.forEach((digit, idx) => {
        if (otpRefs.current[idx]) otpRefs.current[idx].current.value = digit;
      });
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Resend OTP
  const handleResend = async () => {
    try {
      setErrorMsg("");
      setIsLoading(true);

      await axios.post(
        apiRoutes.auth.sendPhoneVerification,
        {},
        { headers: { Authorization: `Bearer ${formData.registerToken}` } }
      );

      setTimeLeft(120); // reset countdown
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current.forEach((ref) => {
        if (ref.current) ref.current.value = "";
      });

      otpRefs.current[0]?.current?.focus();
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to resend OTP. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setErrorMsg("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        apiRoutes.auth.verifyPhone,
        {
          id: formData.userId,
          otp: otpCode,
        },
        {
          headers: {
            Authorization: `Bearer ${formData.registerToken}`,
          },
        }
      );

      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          verifiedUser: res.data.user,
          tokens: res.data.tokens,
        }));

        document.cookie = `token=${res.data.tokens.access.token}; path=/;`;

        // Save user info client-side
        login(res.data);

        // ✅ Redirect immediately after success
        router.push("/admin/overview");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, ""); // remove non-digits
    if (clean.startsWith("855")) clean = "+" + clean;
    if (!clean.startsWith("+")) clean = "+" + clean;

    // Format Cambodia (+855)
    if (clean.startsWith("+855")) {
      const local = clean.slice(4);
      return `+855 ${local.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3")}`;
    }

    // Fallback for others
    return clean;
  };

  // Render step circles
  const renderStepCircles = () => {
    const steps = 4;
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
            {isCompleted && <FaCheck className="text-white text-[10px]" />}
          </div>
          {index < steps - 1 && (
            <div className="border-t-2 border-gray-300 mx-2 w-6 sm:w-8 md:w-10" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="font-custom bg-white flex h-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl flex justify-center">
        <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px] w-full">
          <CardContent className="p-14 md:p-16 flex flex-col justify-center relative">
            {/* Back button */}
            <button
              type="button"
              onClick={onBackStep}
              className="flex items-center absolute top-4 left-4 p-2 rounded-full text-dark-gray hover:bg-gray-200"
            >
              <FaAngleLeft size={20} />
              <p className="text-xs font-medium text-dark-gray ml-2">Back</p>
            </button>

            {/* Step Circles */}
            <div className="flex justify-center gap-2 mb-6 mt-2">
              {renderStepCircles()}
            </div>

            {/* OTP Form */}
            <form
              className="p-6 md:p-16 flex flex-col justify-center items-center"
              onSubmit={handleVerify}
            >
              <h1 className="text-lg font-medium text-dark-gray text-center">
                OTP Verification
              </h1>
              <p className="text-sm text-gray-500 text-center">
                Enter the OTP sent to{" "}
                <span className="text-blue-500">
                  {formatPhoneNumber(formData.phoneNumber)}
                </span>
              </p>

              {/* OTP Inputs */}
              <div
                className="flex gap-2 justify-center mt-4"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs.current[index]}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    maxLength="1"
                    className="w-10 h-10 text-center text-xl border-b-2 border-gray-300 focus:outline-none"
                  />
                ))}
              </div>

              {/* Countdown */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Code expires in{" "}
                <span className="text-black font-bold">
                  {`${Math.floor(timeLeft / 60)}:${
                    timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60
                  }`}
                </span>
              </p>

              {/* Error Message */}
              {errorMsg && (
                <p className="text-sm text-red-500 text-center mt-1">
                  {errorMsg}
                </p>
              )}

              {/* Verify Button with Spinner */}
              <Button
                type="submit"
                className="w-full sm:w-56 rounded-full text-base mt-5 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-white text-lg" />
                ) : (
                  "Verify"
                )}
              </Button>

              {/* Resend Link */}
              <p className="text-xs text-center text-gray-500 mt-2">
                Didn’t receive the OTP?{" "}
                <button
                  type="button"
                  className="text-blue-500"
                  onClick={handleResend}
                  disabled={isLoading || timeLeft > 100} // optional: prevent spam
                >
                  Resend
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
