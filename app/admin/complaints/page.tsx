"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Complaint = {
  id: string;
  category: string | null;
  name: string | null;
  registration_number: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  attachment_url: string | null;
  status: string | null;
  created_at: string;
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    setLoading(true);
    setError("");

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/admin/login";
      return;
    }

    await loadComplaints();
  }

  async function loadComplaints() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .ilike("category", "Complaint -%")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setComplaints([]);
    } else {
      setComplaints((data || []) as Complaint[]);
    }

    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("suggestions")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setComplaints((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    if (selectedComplaint?.id === id) {
      setSelectedComplaint({
        ...selectedComplaint,
        status,
      });
    }
  }

  async function deleteComplaint(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("suggestions")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setComplaints((current) =>
      current.filter((item) => item.id !== id)
    );

    if (selectedComplaint?.id === id) {
      setSelectedComplaint(null);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      (complaint.name || "").toLowerCase().includes(query) ||
      (complaint.subject || "").toLowerCase().includes(query) ||
      (complaint.message || "").toLowerCase().includes(query) ||
      (complaint.email || "").toLowerCase().includes(query) ||
      (complaint.registration_number || "")
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (complaint.status || "pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = complaints.filter(
    (item) => (item.status || "pending") === "pending"
  ).length;

  const reviewedCount = complaints.filter(
    (item) => item.status === "reviewed"
  ).length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              SAC Admin
            </h1>
            <p className="text-xs text-slate-500">
              Complaints Management
            </p>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/members"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Members
            </Link>

            <Link
              href="/admin/events"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Events
            </Link>

            <Link
              href="/admin/complaints"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Complaints
            </Link>

            <button
              onClick={logout}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-100">
            Student Activity Council
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Complaints
          </h2>

          <p className="mt-3 max-w-2xl text-blue-100">
            Review, manage and respond to complaints submitted by students.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Complaints"
            value={complaints.length}
            icon="📋"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            icon="⏳"
          />

          <StatCard
            title="Reviewed"
            value={reviewedCount}
            icon="👁️"
          />

          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon="✅"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={loadComplaints}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-500">
              Loading complaints...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-800">
              Unable to load complaints
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              onClick={loadComplaints}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredComplaints.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">📭</div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No complaints found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are no complaints matching the current filters.
            </p>
          </div>
        )}

        {!loading && !error && filteredComplaints.length > 0 && (
          <div className="mt-8 grid gap-5">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={() => setSelectedComplaint(complaint)}
                onStatusChange={(status) =>
                  updateStatus(complaint.id, status)
                }
                onDelete={() => deleteComplaint(complaint.id)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={(status) =>
            updateStatus(selectedComplaint.id, status)
          }
          onDelete={() => deleteComplaint(selectedComplaint.id)}
        />
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ComplaintCard({
  complaint,
  onView,
  onStatusChange,
  onDelete,
}: {
  complaint: Complaint;
  onView: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}) {
  const status = complaint.status || "pending";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              {complaint.category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {complaint.category.replace(/^Complaint\s*-\s*/i, "")}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-lg font-bold text-slate-900">
              {complaint.subject || "Untitled Complaint"}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
              {complaint.message || "No complaint details provided."}
            </p>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                label="Name"
                value={complaint.name || "Anonymous"}
              />

              <InfoItem
                label="Registration"
                value={complaint.registration_number || "Not provided"}
              />

              <InfoItem
                label="Email"
                value={complaint.email || "Not provided"}
              />

              <InfoItem
                label="Phone"
                value={complaint.phone || "Not provided"}
              />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Submitted{" "}
              {new Date(complaint.created_at).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:w-64 lg:justify-end">
            <button
              onClick={onView}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View
            </button>

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={onDelete}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    reviewed: "bg-blue-100 text-blue-700",
    resolved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ComplaintModal({
  complaint,
  onClose,
  onStatusChange,
  onDelete,
}: {
  complaint: Complaint;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}) {
  const status = complaint.status || "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Complaint Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {new Date(complaint.created_at).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              {complaint.category && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {complaint.category.replace(/^Complaint\s*-\s*/i, "")}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-2xl font-bold text-slate-900">
              {complaint.subject || "Untitled Complaint"}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField
              label="Name"
              value={complaint.name || "Anonymous"}
            />

            <DetailField
              label="Registration Number"
              value={complaint.registration_number || "Not provided"}
            />

            <DetailField
              label="Email"
              value={complaint.email || "Not provided"}
            />

            <DetailField
              label="Phone"
              value={complaint.phone || "Not provided"}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-900">
              Complaint
            </p>

            <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {complaint.message || "No complaint details provided."}
            </div>
          </div>

          {complaint.attachment_url && (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Attachment
              </p>

              <a
                href={complaint.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                View Attachment
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Delete
              </button>

              <button
                onClick={onClose}
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}