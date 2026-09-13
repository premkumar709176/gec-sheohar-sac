"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          window.location.href = "/admin/login";
          return;
        }

        if (mounted) {
          setEmail(user.email || "");
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin authentication error:", err);

        if (mounted) {
          setError(
            "Unable to verify admin login. Please refresh the page or login again."
          );
          setLoading(false);
        }
      }
    }

    checkUser();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  function goTo(path: string) {
    window.location.href = path;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-lg font-semibold">
            Loading Admin Dashboard...
          </div>

          <p className="text-slate-400 text-sm mt-2">
            Checking administrator access
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="text-5xl mb-5">⚠️</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Admin Access Error
          </h1>

          <p className="text-slate-600 mt-3 leading-6">
            {error}
          </p>

          <button
            onClick={() => goTo("/admin/login")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Go to Admin Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              SAC Admin Dashboard
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Government Engineering College Sheohar
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
          <p className="text-sm text-slate-500">
            Logged in as
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1 break-all">
            {email}
          </h2>

          <p className="text-slate-600 mt-2">
            Welcome to the SAC website administration panel.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Website Management
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Members"
            description="Add, edit and manage SAC members, positions, clubs and profile information."
            icon="👥"
            buttonText="Manage Members"
            onClick={() => goTo("/admin/members")}
          />

          <AdminCard
            title="Events"
            description="Create and manage upcoming events, workshops, seminars and activities."
            icon="📅"
            buttonText="Manage Events"
            onClick={() => goTo("/admin/events")}
          />

          <AdminCard
            title="Gallery"
            description="Upload and manage SAC and club activity photographs using cloud storage."
            icon="🖼️"
            buttonText="Manage Gallery"
            onClick={() => goTo("/admin/gallery")}
          />

          <AdminCard
            title="Registrations"
            description="View students who have submitted the SAC membership registration form."
            icon="📝"
            buttonText="View Registrations"
            onClick={() => goTo("/admin/registrations")}
          />

          <AdminCard
            title="Suggestions"
            description="Review suggestions submitted by students through the SAC website."
            icon="💡"
            buttonText="View Suggestions"
            onClick={() => goTo("/admin/suggestions")}
          />

          <AdminCard
            title="Complaints"
            description="Review and manage complaints submitted through the SAC website."
            icon="⚠️"
            buttonText="View Complaints"
            onClick={() => goTo("/admin/complaints")}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
          <h2 className="text-xl font-bold text-slate-900">
            Quick Links
          </h2>

          <div className="flex flex-wrap gap-4 mt-5">
            <button
              onClick={() => goTo("/")}
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
            >
              View Website
            </button>

            <button
              onClick={() => goTo("/members")}
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
            >
              View Members
            </button>

            <button
              onClick={() => goTo("/events")}
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
            >
              View Events
            </button>

            <button
              onClick={() => goTo("/gallery")}
              className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
            >
              View Gallery
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 text-center py-6">
        <p className="text-sm">
          GEC Sheohar Student Activity Council — Admin Panel
        </p>
      </footer>
    </main>
  );
}

function AdminCard({
  title,
  description,
  icon,
  buttonText,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-slate-600 text-sm leading-6 mt-2 min-h-[72px]">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
      >
        {buttonText}
      </button>
    </div>
  );
}