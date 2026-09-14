"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Registration = {
  id: string;
  full_name: string;
  registration_number: string;
  branch: string;
  year_semester: string;
  college_email: string;
  phone: string;
  preferred_club: string;
  position_interested: string;
  skills: string;
  motivation: string;
  previous_experience: string;
  availability: string;
  profile_photo_url: string | null;
  declaration: boolean;
  status: string;
  created_at: string;
};

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      window.location.href = "/admin/login";
      return;
    }

    loadRegistrations();
  }

  async function loadRegistrations() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  }

  async function updateStatus(
    id: string,
    status: "pending" | "approved" | "rejected"
  ) {
    const { error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setRegistrations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    if (selected?.id === id) {
      setSelected({ ...selected, status });
    }

    setMessage(`Application marked as ${status}.`);
  }

  async function deleteRegistration(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this application?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setRegistrations((current) =>
      current.filter((item) => item.id !== id)
    );

    setSelected(null);
    setMessage("Application deleted successfully.");
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const text = `
        ${item.full_name}
        ${item.registration_number}
        ${item.college_email}
        ${item.phone}
        ${item.preferred_club}
        ${item.branch}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (item.status || "pending").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const pendingCount = registrations.filter(
    (item) => (item.status || "pending") === "pending"
  ).length;

  const approvedCount = registrations.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = registrations.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <nav className="sticky top-0 z-50 border-b border-[#e4e7ec] bg-[#f8f6f0]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/admin" className="group">
            <p className="text-lg font-extrabold text-[#1746a2]">
              SAC Admin
            </p>

            <p className="text-xs font-semibold tracking-wide text-[#667085]">
              GEC Sheohar
            </p>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2] sm:block"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/members"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2] lg:block"
            >
              Members
            </Link>

            <Link
              href="/admin/events"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2] lg:block"
            >
              Events
            </Link>

            <Link
              href="/admin/registrations"
              className="rounded-full bg-[#1746a2] px-4 py-2 text-sm font-bold text-white shadow-sm"
            >
              Registrations
            </Link>

            <button
              onClick={logout}
              className="rounded-full bg-[#fff1e6] px-4 py-2 text-sm font-bold text-[#d96512] transition hover:bg-[#f47b20] hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="college-pattern min-h-[calc(100vh-76px)]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47b20]">
              Administration
            </p>

            <h1 className="text-4xl font-black tracking-tight text-[#172033] sm:text-5xl">
              SAC Membership Registrations
            </h1>

            <p className="mt-3 max-w-2xl text-[#667085]">
              Review and manage applications submitted through the Join SAC
              form.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-[#1746a2]/15 bg-[#eaf1ff] px-5 py-4 text-sm font-semibold text-[#1746a2]">
              {message}
            </div>
          )}

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Applications"
              value={registrations.length}
              icon="📋"
              accent="blue"
            />

            <StatCard
              title="Pending"
              value={pendingCount}
              icon="⏳"
              accent="orange"
            />

            <StatCard
              title="Approved"
              value={approvedCount}
              icon="✓"
              accent="green"
            />

            <StatCard
              title="Rejected"
              value={rejectedCount}
              icon="×"
              accent="red"
            />
          </div>

          <div className="mb-6 rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
              <input
                type="text"
                placeholder="Search name, registration no., email, club..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#d8dce4] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#d8dce4] bg-white px-4 py-3 text-sm font-medium text-[#172033] outline-none focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={loadRegistrations}
                className="rounded-xl bg-[#1746a2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#103575] hover:shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#e4e7ec] bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eaf1ff] border-t-[#1746a2]" />

              <p className="mt-4 text-sm font-medium text-[#667085]">
                Loading applications...
              </p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d8dce4] bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
                📋
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
                No applications found
              </h3>

              <p className="mt-2 text-sm text-[#667085]">
                Applications submitted through Join SAC will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left">
                  <thead className="border-b border-[#e4e7ec] bg-[#eaf1ff]/60">
                    <tr>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Applicant
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Registration No.
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Branch / Year
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Preferred Club
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#667085]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#eef0f3]">
                    {filteredRegistrations.map((item) => (
                      <tr
                        key={item.id}
                        className="transition hover:bg-[#f8f6f0]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            {item.profile_photo_url ? (
                              <img
                                src={item.profile_photo_url}
                                alt={item.full_name}
                                className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf1ff] font-black text-[#1746a2]">
                                {item.full_name
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-bold text-[#172033]">
                                {item.full_name}
                              </p>

                              <p className="text-sm text-[#667085]">
                                {item.college_email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-[#172033]">
                          {item.registration_number || "—"}
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-[#172033]">
                            {item.branch || "—"}
                          </p>

                          <p className="text-xs font-medium text-[#667085]">
                            {item.year_semester || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm font-medium text-[#172033]">
                          {item.preferred_club || "—"}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-5 py-5">
                          <button
                            onClick={() => setSelected(item)}
                            className="rounded-xl bg-[#1746a2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#103575]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e4e7ec] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e4e7ec] bg-white px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-xl font-black text-[#172033]">
                  Application Details
                </h3>

                <p className="mt-1 text-sm font-medium text-[#667085]">
                  {selected.full_name}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f3f6] text-lg font-bold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
              >
                ×
              </button>
            </div>

            <div className="space-y-7 p-5 sm:p-6">
              {selected.profile_photo_url && (
                <div className="flex justify-center">
                  <img
                    src={selected.profile_photo_url}
                    alt={selected.full_name}
                    className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg ring-1 ring-[#e4e7ec]"
                  />
                </div>
              )}

              <Section title="Personal Information">
                <Detail
                  label="Full Name"
                  value={selected.full_name}
                />

                <Detail
                  label="Registration Number"
                  value={selected.registration_number}
                />

                <Detail
                  label="Branch"
                  value={selected.branch}
                />

                <Detail
                  label="Year / Semester"
                  value={selected.year_semester}
                />

                <Detail
                  label="College Email"
                  value={selected.college_email}
                />

                <Detail
                  label="Phone"
                  value={selected.phone}
                />
              </Section>

              <Section title="SAC Preferences">
                <Detail
                  label="Preferred Club"
                  value={selected.preferred_club}
                />

                <Detail
                  label="Position Interested"
                  value={selected.position_interested}
                />

                <Detail
                  label="Skills"
                  value={selected.skills}
                />

                <Detail
                  label="Availability"
                  value={selected.availability}
                />
              </Section>

              <Section title="Experience & Motivation">
                <Detail
                  label="Motivation"
                  value={selected.motivation}
                  full
                />

                <Detail
                  label="Previous Experience"
                  value={selected.previous_experience}
                  full
                />
              </Section>

              <div className="rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-5">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#667085]">
                  Current Status
                </p>

                <StatusBadge status={selected.status} />
              </div>

              <div className="border-t border-[#e4e7ec] pt-6">
                <p className="mb-4 text-sm font-bold text-[#172033]">
                  Change Application Status
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(selected.id, "approved")
                    }
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(selected.id, "pending")
                    }
                    className="rounded-xl bg-[#f47b20] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d96512]"
                  >
                    ↻ Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(selected.id, "rejected")
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    × Reject
                  </button>

                  <button
                    onClick={() =>
                      deleteRegistration(selected.id)
                    }
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              <p className="text-xs font-medium text-[#98a2b3]">
                Submitted:{" "}
                {selected.created_at
                  ? new Date(selected.created_at).toLocaleString(
                      "en-IN"
                    )
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: number;
  icon: string;
  accent: "blue" | "orange" | "green" | "red";
}) {
  const styles = {
    blue: "bg-[#eaf1ff] text-[#1746a2]",
    orange: "bg-[#fff1e6] text-[#f47b20]",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="college-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#667085]">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-[#172033]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black ${styles[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "pending").toLowerCase();

  if (normalized === "approved") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        Approved
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#d96512]">
      Pending
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-4 text-lg font-black text-[#1746a2]">
        {title}
      </h4>

      <div className="grid gap-4 rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string | null | undefined;
  full?: boolean;
}) {
  return (
    <div
      className={
        full ? "rounded-xl bg-white p-4 md:col-span-2" : "rounded-xl bg-white p-4"
      }
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-[#172033]">
        {value || "—"}
      </p>
    </div>
  );
}