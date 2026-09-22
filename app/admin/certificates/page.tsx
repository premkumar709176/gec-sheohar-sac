"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  event_date?: string | null;
};

export default function CertificatesAdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin/login";
      return;
    }

    await loadEvents();
    await loadCertificates();

    setLoading(false);
  }

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date")
      .order("event_date", { ascending: false });

    if (error) {
      console.error(error);
      setError("Unable to load events.");
      return;
    }

    setEvents(data || []);
  }

  async function loadCertificates() {
    const { data, error } = await supabase
      .from("certificates")
      .select(
        `
        id,
        student_name,
        registration_number,
        certificate_url,
        created_at,
        event_id,
        events (
          title
        )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("Unable to load certificates.");
      return;
    }

    setCertificates(data || []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!eventId) {
      setError("Please select an event.");
      return;
    }

    if (!studentName.trim()) {
      setError("Please enter the student name.");
      return;
    }

    if (!registrationNumber.trim()) {
      setError("Please enter the registration/roll number.");
      return;
    }

    if (!certificateFile) {
      setError("Please select a certificate PDF.");
      return;
    }

    if (certificateFile.type !== "application/pdf") {
      setError("Only PDF certificates are allowed.");
      return;
    }

    setUploading(true);

    try {
      const fileExtension = certificateFile.name.split(".").pop() || "pdf";

      const safeRegistration = registrationNumber
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "-");

      const fileName = `${Date.now()}-${safeRegistration}.${fileExtension}`;

      const filePath = `${eventId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(filePath, certificateFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("certificates")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("certificates")
        .insert({
          event_id: eventId,
          student_name: studentName.trim(),
          registration_number: registrationNumber.trim(),
          certificate_url: publicUrl,
        });

      if (insertError) {
        await supabase.storage.from("certificates").remove([filePath]);
        throw insertError;
      }

      setMessage("Certificate uploaded successfully.");

      setStudentName("");
      setRegistrationNumber("");
      setCertificateFile(null);
      setEventId("");

      const fileInput = document.getElementById(
        "certificate-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadCertificates();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Something went wrong while uploading the certificate."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteCertificate(certificate: any) {
    const confirmed = window.confirm(
      `Delete certificate for ${certificate.student_name}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const certificateUrl = certificate.certificate_url;

      const bucketMarker = "/storage/v1/object/public/certificates/";

      let filePath = "";

      if (certificateUrl?.includes(bucketMarker)) {
        filePath = decodeURIComponent(
          certificateUrl.split(bucketMarker)[1]
        );
      }

      if (filePath) {
        await supabase.storage
          .from("certificates")
          .remove([filePath]);
      }

      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificate.id);

      if (error) {
        throw error;
      }

      setMessage("Certificate deleted successfully.");

      await loadCertificates();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to delete certificate.");
    }
  }

  function getEventTitle(certificate: any) {
    if (Array.isArray(certificate.events)) {
      return certificate.events[0]?.title || "Unknown Event";
    }

    return certificate.events?.title || "Unknown Event";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#1746a2]/20 border-t-[#1746a2]" />

          <p className="mt-4 font-bold text-[#172033]">
            Loading Certificates...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <header className="border-b border-[#e4e7ec] bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#f47b20]">
              SAC Administration
            </p>

            <h1 className="mt-1 text-2xl font-black text-[#1746a2] sm:text-3xl">
              Certificate Manager
            </h1>

            <p className="mt-1 text-sm text-[#667085]">
              Upload and manage student e-certificates
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/admin")}
            className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-bold text-[#1746a2] transition hover:bg-[#eaf1ff]"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* Upload */}
          <div className="college-card h-fit p-6 sm:p-7">
            <div className="mb-6">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
                🏆
              </div>

              <h2 className="text-2xl font-black text-[#172033]">
                Upload Certificate
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Upload one student's participation certificate and connect it
                to an event.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Event
                </label>

                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
                >
                  <option value="">Select event</option>

                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Student Name
                </label>

                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Registration / Roll Number
                </label>

                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="Example: 24010101"
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Certificate PDF
                </label>

                <input
                  id="certificate-file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) =>
                    setCertificateFile(e.target.files?.[0] || null)
                  }
                  className="w-full rounded-xl border border-dashed border-[#1746a2]/30 bg-[#eaf1ff]/50 p-4 text-sm"
                />

                {certificateFile && (
                  <p className="mt-2 text-xs font-semibold text-[#1746a2]">
                    Selected: {certificateFile.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-[#1746a2] px-5 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Certificate"}
              </button>
            </form>
          </div>

          {/* Certificate List */}
          <div>
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-wider text-[#f47b20]">
                Records
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#172033]">
                Uploaded Certificates
              </h2>
            </div>

            {certificates.length === 0 ? (
              <div className="college-card p-10 text-center">
                <div className="text-5xl">📜</div>

                <h3 className="mt-4 text-xl font-black">
                  No certificates yet
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Upload the first student certificate using the form.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="college-card p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-bold text-[#1746a2]">
                            {getEventTitle(certificate)}
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-lg font-black text-[#172033]">
                          {certificate.student_name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-[#667085]">
                          Roll / Reg No:{" "}
                          <span className="text-[#1746a2]">
                            {certificate.registration_number}
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <a
                          href={certificate.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-[#1746a2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#103575]"
                        >
                          View
                        </a>

                        <a
                          href={certificate.certificate_url}
                          download
                          className="rounded-xl bg-[#f47b20] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d96512]"
                        >
                          Download
                        </a>

                        <button
                          onClick={() => deleteCertificate(certificate)}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="mt-8 border-t border-[#103575] bg-[#103575] py-7 text-center text-white">
        <p className="text-sm font-semibold">
          GEC Sheohar Student Activity Council
        </p>

        <p className="mt-1 text-xs text-blue-100">
          Certificate Management System
        </p>
      </footer>
    </main>
  );
}