"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import apiRoutes from "@/constants/ApiRoutes";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Refs for OTP inputs
  const otpRefs = useRef([]);
  otpRefs.current = Array.from(
    { length: 6 },
    (_, i) => otpRefs.current[i] || React.createRef()
  );

  // OTP Expiration Countdown
  useEffect(() => {
    if (!showOtpScreen || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showOtpScreen]);

  // Handle Send OTP
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    if (!phoneNumber) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = phoneNumber.replace(/^\+/, "");
      const res = await axios.post(apiRoutes.auth.sendOTP, {
        phoneNumber: formattedPhone,
      });

      if (res.data) {
        setShowOtpScreen(true);
        setTimeLeft(120);
        setTimeout(() => otpRefs.current[0]?.current?.focus(), 100); // focus first digit
      } else {
        setErrorMsg("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP typing
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1].current.focus();
      }
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  // Handle paste full OTP
  const handleOtpPaste = (e) => {
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasteData) {
      const newOtp = pasteData.split("");
      setOtp((prev) => {
        const updated = [...prev];
        newOtp.forEach((digit, idx) => {
          updated[idx] = digit;
        });
        return updated;
      });
      otpRefs.current[Math.min(pasteData.length, 5)].current.focus();
    }
    e.preventDefault();
  };

  // Handle OTP Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const otpCode = otp.join("");

    try {
      setIsLoading(true);
      const formattedPhone = phoneNumber.replace(/^\+/, "");
      const res = await axios.post(
        apiRoutes.auth.login,
        {
          phoneNumber: formattedPhone,
          otp: otpCode,
        },
        { withCredentials: true }
      );

      if (res.data) {
        login(res.data);
        router.push("/overview");
      } else {
        setErrorMsg("Invalid OTP. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
        <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px]">
          {showOtpScreen ? (
            <form
              className="p-6 md:p-16 flex flex-col justify-center items-center"
              onSubmit={handleVerify}
            >
              <div className="flex flex-col gap-6 items-center">
                <button
                  type="button"
                  className="self-start flex items-start text-gray-600"
                  onClick={() => {
                    setShowOtpScreen(false);
                    setOtp(["", "", "", "", "", ""]);
                    setErrorMsg("");
                  }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>

                <h1 className="text-lg font-medium text-dark-gray mt-5 text-center">
                  OTP Verification
                </h1>
                <p className="text-sm text-gray-500 text-center">
                  Enter the OTP sent to{" "}
                  <span className="text-blue-500">{phoneNumber}</span>
                </p>

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

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Code expires in{" "}
                  <span className="text-black font-bold">
                    {`${Math.floor(timeLeft / 60)}:${
                      timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60
                    }`}
                  </span>
                </p>

                {errorMsg && (
                  <p className="text-sm text-red-500 text-center">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  className="w-full sm:w-56 rounded-full text-base mt-5"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-2">
                  Didn’t receive the OTP?{" "}
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form
              className="p-6 md:p-16 flex flex-col justify-center items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-6 items-center">
                <h1 className="text-2xl font-medium text-black text-center">
                  Welcome back!
                </h1>
                <p className="text-sm text-center text-gray-500">
                  We’ll send you a code to verify your number.
                </p>

                <div className="flex items-center border-2 border-gray-300 rounded-xl px-6 py-2 w-full sm:w-3/4">
                  <PhoneInput
                    international
                    defaultCountry="KH"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="w-full px-2 py-1 text-base text-gray-700 focus:outline-none"
                    placeholder="Mobile Phone"
                  />
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-500 text-center">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  className="w-full sm:w-56 rounded-full text-base"
                  disabled={!phoneNumber || isLoading}
                >
                  {isLoading ? "Sending..." : "Get OTP"}
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-500">
                    Create one now
                  </a>
                </div>
              </div>
            </form>
          )}

          {/* Right side logo image */}
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
