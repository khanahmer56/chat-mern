"use client";
import Loading from "@/component/Loading";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import {
  ArrowRight,
  Loader2,
  Mail,
  MessageCircle,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { isAuth, loading: userLoading } = useAppData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });

      if (res.status === 200) {
        setSuccess("OTP sent successfully! Redirecting...");
        toast.success(res.data.message);
        setTimeout(() => {
          router.push(`/verify?email=${email}`);
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl w-full flex items-center justify-center gap-12 relative z-10">
        {/* Left Side - Welcome Content (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col space-y-8 max-w-lg">
          {/* Logo/Brand */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <MessageCircle size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ChatFlow
              </h1>
              <p className="text-gray-400 text-sm">
                Connect • Chat • Collaborate
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why choose ChatFlow?
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Real-time messaging with instant delivery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Connect Anyone
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Chat with friends, family, and colleagues
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MessageCircle size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Rich Media</h3>
                  <p className="text-gray-400 text-sm">Share images</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="relative p-8 pb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

              <div className="text-center relative z-10">
                {/* Mobile Logo (Visible on mobile only) */}
                <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    ChatFlow
                  </h1>
                </div>

                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 group">
                  <Mail
                    size={48}
                    className="text-white group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-3">
                  Welcome Back
                </h2>

                {/* Subtitle */}
                <p className="text-gray-300 text-base md:text-lg">
                  Enter your email to get started
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm hover:border-gray-500"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                    />
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Email</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="text-center pt-4 border-t border-gray-700/50">
                  <p className="text-gray-400 text-sm">
                    We'll send you a secure verification code
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">Secure • Private • Fast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
