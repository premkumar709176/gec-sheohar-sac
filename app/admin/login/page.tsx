
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkExistingSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          window.location.href = "/admin";
          return;
        }
      } catch (err) {
        console.error("Session check error:", err);
      }

      if (mounted) {
        setChecking(false);
      }
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-white text-lg font-semibold">
            Checking login...
          </div>

          <p className="text-slate-400 text-sm mt-2">
            Please wait
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl shadow-lg mb-5">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-white">
            SAC Admin Login
          </h1>

          <p className="text-slate-400 mt-2">
            Government Engineering College Sheohar
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Administrator Access
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Login to manage the SAC website.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Signing in..." : "Login to Admin Panel"}
            </button>

          </form>

          {/* Back to Website */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full mt-4 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition"
          >
            ← Back to Website
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Authorized administrators only.
        </p>

      </div>
    </main>
  );
}
