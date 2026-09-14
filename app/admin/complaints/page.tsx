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
      "Are you sure you want to delete this ticket?"
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
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <header className="sticky top-0 z-40 border-b border-[#e4e7ec] bg-[#f8f6f0]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/admin" className="group">
            <p className="text-lg font-extrabold text-[#1746a2]">
              SAC Admin
            </p>
            <p className="text-xs font-semibold tracking-wide text-[#667085]">
              Suggestions & Support
            </p>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/members"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
            >
              Members
            </Link>

            <Link
              href="/admin/events"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
            >
              Events
            </Link>

            <Link
              href="/admin/complaints"
              className="rounded-full bg-[#1746a2] px-4 py-2 text-sm font-bold text-white shadow-sm"
            >
              Tickets
            </Link>

            <button
              onClick={logout}
              className="ml-2 rounded-full bg-[#fff1e6] px-4 py-2 text-sm font-bold text-[#d96512] transition hover:bg-[#f47b20] hover:text-white"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="college-pattern border-b border-[#e4e7ec]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#f47b20]">
            Student Activity Council
          </p>

          <h1 className="text-4xl font-black tracking-tight text-[#172033] sm:text-5xl">
            Suggestions & Support
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#667085]">
            Review, manage and respond to suggestions and support tickets
            submitted by students.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Tickets"
            value={complaints.length}
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
            title="Reviewed"
            value={reviewedCount}
            icon="👁"
            accent="blue"
          />

          <StatCard
            title="Resolved"
            value={resolvedCount}
            icon="✓"
            accent="green"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full rounded-xl border border-[#d8dce4] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#d8dce4] bg-white px-4 py-3 text-sm font-medium text-[#172033] outline-none focus:border-[#1746a2]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={loadComplaints}
                className="rounded-xl bg-[#1746a2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#103575] hover:shadow-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-[#e4e7ec] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eaf1ff] border-t-[#1746a2]" />
            <p className="mt-4 text-sm font-medium text-[#667085]">
              Loading tickets...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-bold text-red-800">
              Unable to load tickets
            </h3>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              onClick={loadComplaints}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredComplaints.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d8dce4] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
              📭
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#172033]">
              No tickets found
            </h3>

            <p className="mt-2 text-sm text-[#667085]">
              There are no tickets matching the current filters.
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
  accent,
}: {
  title: string;
  value: number;
  icon: string;
  accent: "blue" | "orange" | "green";
}) {
  const styles = {
    blue: "bg-[#eaf1ff] text-[#1746a2]",
    orange: "bg-[#fff1e6] text-[#f47b20]",
    green: "bg-emerald-50 text-emerald-600",
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
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${styles[accent]}`}
        >
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
    <article className="college-card overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              {complaint.category && (
                <span className="rounded-full bg-[#f1f3f6] px-3 py-1 text-xs font-semibold text-[#667085]">
                  {complaint.category.replace(
                    /^Complaint\s*-\s*/i,
                    ""
                  )}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-lg font-extrabold text-[#172033]">
              {complaint.subject || "Untitled Ticket"}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">
              {complaint.message || "No ticket details provided."}
            </p>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                label="Name"
                value={complaint.name || "Anonymous"}
              />

              <InfoItem
                label="Registration"
                value={
                  complaint.registration_number || "Not provided"
                }
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

            <p className="mt-4 text-xs font-medium text-[#98a2b3]">
              Submitted{" "}
              {new Date(complaint.created_at).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:w-64 lg:justify-end">
            <button
              onClick={onView}
              className="rounded-xl bg-[#1746a2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#103575]"
            >
              View
            </button>

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-xl border border-[#d8dce4] bg-white px-3 py-2 text-sm font-medium text-[#172033] outline-none focus:border-[#1746a2]"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={onDelete}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
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
    <div className="rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-[#172033]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-[#fff1e6] text-[#d96512]",
    reviewed: "bg-[#eaf1ff] text-[#1746a2]",
    resolved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-[#f1f3f6] text-[#667085]"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172033]/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e4e7ec] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e4e7ec] bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-black text-[#172033]">
              Ticket Details
            </h2>

            <p className="mt-1 text-xs font-medium text-[#667085]">
              {new Date(complaint.created_at).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f3f6] text-xl font-bold text-[#667085] transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />

              {complaint.category && (
                <span className="rounded-full bg-[#f1f3f6] px-3 py-1 text-xs font-semibold text-[#667085]">
                  {complaint.category.replace(
                    /^Complaint\s*-\s*/i,
                    ""
                  )}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-2xl font-black text-[#172033]">
              {complaint.subject || "Untitled Ticket"}
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField
              label="Name"
              value={complaint.name || "Anonymous"}
            />

            <DetailField
              label="Registration Number"
              value={
                complaint.registration_number || "Not provided"
              }
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
            <p className="mb-2 text-sm font-bold text-[#172033]">
              Ticket Message
            </p>

            <div className="whitespace-pre-wrap rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-4 text-sm leading-7 text-[#172033]">
              {complaint.message || "No ticket details provided."}
            </div>
          </div>

          {complaint.attachment_url && (
            <div>
              <p className="mb-2 text-sm font-bold text-[#172033]">
                Attachment
              </p>

              <a
                href={complaint.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-[#eaf1ff] px-4 py-2 text-sm font-bold text-[#1746a2] transition hover:bg-[#dce8ff]"
              >
                View Attachment
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-[#e4e7ec] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-xl border border-[#d8dce4] bg-white px-4 py-3 text-sm font-semibold text-[#172033] outline-none focus:border-[#1746a2]"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>

              <button
                onClick={onClose}
                className="rounded-xl bg-[#1746a2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#103575]"
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
    <div className="rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-[#172033]">
        {value}
      </p>
    </div>
  );
}