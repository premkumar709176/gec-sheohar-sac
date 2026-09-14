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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1746a2]/20 border-t-[#1746a2]" />
          </div>

          <h1 className="text-lg font-bold text-[#172033]">
            Checking login...
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Please wait
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="college-pattern flex min-h-screen items-center justify-center bg-[#f8f6f0] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-[#f47b20]/20 blur-xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1746a2] text-3xl text-white shadow-xl">
              🔐
            </div>
          </div>

          <h1 className="text-3xl font-black text-[#1746a2]">
            SAC Admin Login
          </h1>

          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#f47b20]" />

          <p className="mt-3 font-medium text-[#667085]">
            Government Engineering College Sheohar
          </p>
        </div>

        <div className="college-card blue-glow p-7 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-1.5 text-xs font-bold text-[#1746a2]">
              <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
              Secure Access
            </div>

            <h2 className="text-xl font-black text-[#172033]">
              Administrator Access
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              Login to manage the SAC website.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex gap-3">
                <span className="text-lg">⚠️</span>

                <p className="text-sm leading-5 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-[#172033]"
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
                className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-[#172033]"
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
                className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1746a2] px-5 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Login to Admin Panel"
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-4 w-full rounded-xl border border-[#e4e7ec] bg-white px-5 py-3.5 font-bold text-[#1746a2] transition hover:border-[#1746a2]/30 hover:bg-[#eaf1ff]"
          >
            ← Back to Website
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-[#667085]">
            Authorized administrators only.
          </p>

          <p className="mt-1 text-xs text-[#98a2b3]">
            SAC • GEC Sheohar
          </p>
        </div>
      </div>
    </main>
  );
}