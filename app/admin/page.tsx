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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0]">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1746a2]/20 border-t-[#1746a2]" />
          </div>

          <h1 className="text-lg font-bold text-[#172033]">
            Loading Admin Dashboard...
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Checking administrator access
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#e4e7ec] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1e6] text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-black text-[#172033]">
            Admin Access Error
          </h1>

          <p className="mt-3 leading-6 text-[#667085]">
            {error}
          </p>

          <button
            onClick={() => goTo("/admin/login")}
            className="mt-7 w-full rounded-xl bg-[#1746a2] px-5 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-lg"
          >
            Go to Admin Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <header className="border-b border-[#e4e7ec] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-[#f47b20]/20 blur-md" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1746a2] text-sm font-black text-white shadow-md">
                SAC
              </div>
            </div>

            <div>
              <h1 className="text-xl font-black text-[#1746a2] sm:text-2xl">
                SAC Admin Dashboard
              </h1>

              <p className="mt-0.5 text-xs font-semibold text-[#667085] sm:text-sm">
                Government Engineering College Sheohar
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#f47b20] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d96512] hover:shadow-md sm:px-5"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="college-pattern">
        <div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8">
          <div className="college-card blue-glow overflow-hidden p-7 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-1.5 text-xs font-bold text-[#1746a2]">
                  <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
                  Administrator Access
                </div>

                <p className="text-sm font-semibold text-[#667085]">
                  Logged in as
                </p>

                <h2 className="mt-1 break-all text-xl font-black text-[#172033] sm:text-2xl">
                  {email}
                </h2>

                <p className="mt-2 text-[#667085]">
                  Welcome to the SAC website administration panel.
                </p>
              </div>

              <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#eaf1ff] text-4xl sm:flex">
                🛠️
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-wider text-[#f47b20]">
            Administration
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#172033] sm:text-3xl">
            Website Management
          </h2>

          <div className="mt-3 h-1 w-14 rounded-full bg-[#f47b20]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            title="Raise a Ticket"
            description="Review and manage support tickets raised through the SAC website."
            icon="🎫"
            buttonText="View Tickets"
            onClick={() => goTo("/admin/complaints")}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <div className="college-card p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
              🔗
            </div>

            <div>
              <h2 className="text-xl font-black text-[#172033]">
                Quick Links
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Quickly access the public SAC website sections.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <QuickLinkButton
              text="View Website"
              onClick={() => goTo("/")}
            />

            <QuickLinkButton
              text="View Members"
              onClick={() => goTo("/members")}
            />

            <QuickLinkButton
              text="View Events"
              onClick={() => goTo("/events")}
            />

            <QuickLinkButton
              text="View Gallery"
              onClick={() => goTo("/gallery")}
            />

            <QuickLinkButton
              text="Suggestions & Support"
              onClick={() => goTo("/suggestions")}
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#103575] bg-[#103575] py-7 text-center text-white">
        <p className="text-sm font-semibold">
          GEC Sheohar Student Activity Council
        </p>

        <p className="mt-1 text-xs text-blue-100">
          Admin Panel • Secure Website Management
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
    <div className="college-card group flex flex-col p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl transition group-hover:scale-105 group-hover:bg-[#fff1e6]">
          {icon}
        </div>

        <div className="h-2.5 w-2.5 rounded-full bg-[#f47b20]" />
      </div>

      <h3 className="mt-5 text-xl font-black text-[#172033]">
        {title}
      </h3>

      <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#667085]">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-6 w-full rounded-xl bg-[#1746a2] px-5 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-md"
      >
        {buttonText}
      </button>
    </div>
  );
}

function QuickLinkButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-[#e4e7ec] bg-white px-5 py-3 text-sm font-bold text-[#1746a2] transition hover:-translate-y-0.5 hover:border-[#1746a2]/30 hover:bg-[#eaf1ff]"
    >
      {text}
    </button>
  );
}