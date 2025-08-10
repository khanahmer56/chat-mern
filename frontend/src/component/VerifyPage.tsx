"use client";
import axios from "axios";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { redirect } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";

const VerifyPage = ({ email }: any) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef<any[]>([]);

  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUser,
  } = useAppData();

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    setError(""); // Clear error when user types

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      // Add your resend OTP API call here
      await axios.post(`${user_service}/api/v1/resend-otp`, { email });
      setSuccess("OTP resent successfully!");
      setResendTimer(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
    setResendLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${user_service}/api/v1/verify-otp`, {
        email,
        otp: finalOtp,
      });

      if (res.status === 200) {
        setSuccess("Email verified successfully!");
        Cookies.set("token", res.data.token, {
          expires: 15,
          secure: false,
          path: "/",
        });
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setUser(res.data.user);
        setIsAuth(true);
        fetchChats();
        fetchUser();
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
    setLoading(false);
  };

  if (userLoading) return <Loading />;
  if (isAuth) redirect("/chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Main Card */}
        <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Header Section */}
          <div className="relative p-8 pb-6">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

            <div className="text-center relative z-10">
              {/* Icon */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 group">
                <div className="relative">
                  <Shield
                    size={48}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-bounce delay-500">
                    <Mail size={12} className="text-gray-900" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-3">
                Verify Your Email
              </h1>

              {/* Subtitle */}
              <p className="text-gray-300 text-base md:text-lg mb-2">
                We've sent a 6-digit code to
              </p>
              <p className="text-blue-400 font-semibold text-sm md:text-base bg-blue-500/10 px-4 py-2 rounded-full inline-block border border-blue-500/20">
                {email}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 text-center">
                  Enter verification code
                </label>

                <div
                  className="flex justify-center gap-3"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el!) as any}
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-white text-xl md:text-2xl font-bold border-2 border-gray-600 rounded-xl bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-500"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center space-y-3 pt-4 border-t border-gray-700/50">
                <p className="text-gray-400 text-sm">
                  Didn't receive the code?
                </p>

                {resendTimer > 0 ? (
                  <p className="text-blue-400 text-sm font-medium">
                    Resend available in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} />
                        Resend Code
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
