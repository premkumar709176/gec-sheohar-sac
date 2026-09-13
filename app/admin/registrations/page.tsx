"use client";

import { useEffect, useMemo, useState } from "react";
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
    (item) => item.status === "pending"
  ).length;

  const approvedCount = registrations.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = registrations.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              SAC Admin Panel
            </h1>
            <p className="text-xs text-slate-500">
              Government Engineering College Sheohar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </a>

            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Administration
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            SAC Membership Registrations
          </h2>

          <p className="mt-2 text-slate-600">
            Review and manage applications submitted through the Join SAC form.
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
            {message}
          </div>
        )}

        {/* STAT CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={registrations.length}
          />

          <StatCard
            title="Pending"
            value={pendingCount}
          />

          <StatCard
            title="Approved"
            value={approvedCount}
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
          />
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
            <input
              type="text"
              placeholder="Search name, registration no., email, club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={loadRegistrations}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* APPLICATIONS */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-slate-500">
              Loading applications...
            </p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📋
            </div>

            <h3 className="text-lg font-semibold">
              No applications found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Applications submitted through Join SAC will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Applicant
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registration No.
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Branch / Year
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Preferred Club
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          {item.profile_photo_url ? (
                            <img
                              src={item.profile_photo_url}
                              alt={item.full_name}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {item.full_name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.full_name}
                            </p>

                            <p className="text-sm text-slate-500">
                              {item.college_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm font-medium">
                        {item.registration_number || "—"}
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium">
                          {item.branch || "—"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.year_semester || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm">
                        {item.preferred_club || "—"}
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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

      {/* DETAILS MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h3 className="text-xl font-bold">
                  Application Details
                </h3>

                <p className="text-sm text-slate-500">
                  {selected.full_name}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-full bg-slate-100 px-3 py-2 text-lg hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-7 p-6">
              {/* PHOTO */}
              {selected.profile_photo_url && (
                <div className="flex justify-center">
                  <img
                    src={selected.profile_photo_url}
                    alt={selected.full_name}
                    className="h-28 w-28 rounded-2xl object-cover shadow-md"
                  />
                </div>
              )}

              {/* PERSONAL */}
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

              {/* SAC */}
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

              {/* EXPERIENCE */}
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

              {/* STATUS */}
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  Current Status
                </p>

                <StatusBadge status={selected.status} />
              </div>

              {/* ACTIONS */}
              <div className="border-t border-slate-200 pt-6">
                <p className="mb-3 text-sm font-semibold text-slate-600">
                  Change Application Status
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateStatus(selected.id, "approved")
                    }
                    className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(selected.id, "pending")
                    }
                    className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600"
                  >
                    ↻ Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(selected.id, "rejected")
                    }
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    ✕ Reject
                  </button>

                  <button
                    onClick={() =>
                      deleteRegistration(selected.id)
                    }
                    className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {/* DATE */}
              <p className="text-xs text-slate-400">
                Submitted:{" "}
                {selected.created_at
                  ? new Date(
                      selected.created_at
                    ).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "pending").toLowerCase();

  if (normalized === "approved") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
        Approved
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
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
      <h4 className="mb-4 text-lg font-bold text-slate-900">
        {title}
      </h4>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
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
    <div className={full ? "md:col-span-2" : ""}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}