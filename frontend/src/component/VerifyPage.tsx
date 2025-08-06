"use client";
import axios from "axios";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";

const VerifyPage = ({ email }: any) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<any[]>([]);
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUser,
  } = useAppData();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    setLoading(true);
    try {
      const res = await axios.post(`${user_service}/api/v1/verify-otp`, {
        email,
        otp: finalOtp,
      });
      if (res.status === 200) {
        console.log(res.data);
        Cookies.set("token", res.data.token, {
          expires: 15,
          secure: false,
          path: "/",
        });
        setOtp(["", "", "", "", "", "", ""]);
        inputRefs.current[0]?.focus;
        setUser(res.data.user);
        setIsAuth(true);
        fetchChats();
        fetchUser();
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  if (userLoading) return <Loading />;
  if (isAuth) redirect("/chat");
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-gray-600 border">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Lock size={40} color="white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-300 text-lg">
              We have sent a 6 digit code to your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
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
                  className="w-12 h-14 text-center text-white text-xl border border-gray-600 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} color="white" />
              ) : (
                <>
                  Verify <ArrowRight size={20} color="white" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
