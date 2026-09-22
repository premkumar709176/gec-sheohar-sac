"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  event_date?: string | null;
};

type Certificate = {
  id: string;
  student_name: string;
  registration_number: string;
  certificate_url: string;
  event_id: string;
};

export default function CertificatesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoadingEvents(true);

    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date")
      .order("event_date", { ascending: false });

    if (error) {
      console.error(error);
      setError("Unable to load events.");
      setLoadingEvents(false);
      return;
    }

    setEvents(data || []);
    setLoadingEvents(false);
  }

  async function findCertificate(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setCertificate(null);
    setSearched(false);

    if (!eventId) {
      setError("Please select an event.");
      return;
    }

    if (!registrationNumber.trim()) {
      setError("Please enter your registration/roll number.");
      return;
    }

    setSearching(true);

    const { data, error } = await supabase
      .from("certificates")
      .select(
        "id, student_name, registration_number, certificate_url, event_id"
      )
      .eq("event_id", eventId)
      .eq("registration_number", registrationNumber.trim())
      .maybeSingle();

    if (error) {
      console.error(error);
      setError("Unable to search for the certificate.");
      setSearching(false);
      return;
    }

    if (!data) {
      setError(
        "No certificate found. Please check your event and registration/roll number."
      );
      setSearching(false);
      setSearched(true);
      return;
    }

    setCertificate(data);
    setSearched(true);
    setSearching(false);
  }

  function downloadCertificate() {
    if (!certificate?.certificate_url) return;

    const link = document.createElement("a");
    link.href = certificate.certificate_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `${certificate.student_name}-Certificate.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const selectedEvent = events.find((event) => event.id === eventId);

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#103575] pt-[76px]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#1746a2] blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#f47b20] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 text-center sm:py-24">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-5xl shadow-xl backdrop-blur">
            🏆
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f47b20]">
            Student Activity Council
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            E-Certificate
            <span className="block text-[#f47b20]">Download</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Find and download your certificate issued for SAC events,
            workshops and activities.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="relative mx-auto -mt-10 max-w-4xl px-5 pb-16">
        <div className="college-card overflow-hidden bg-white shadow-2xl">
          <div className="border-b border-[#e4e7ec] bg-[#eaf1ff]/60 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1746a2] text-xl text-white">
                🔎
              </div>

              <div>
                <h2 className="text-lg font-black text-[#172033] sm:text-xl">
                  Find Your Certificate
                </h2>

                <p className="text-xs text-[#667085] sm:text-sm">
                  Enter your event and registration/roll number
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={findCertificate} className="p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Event */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Select Event
                </label>

                <select
                  value={eventId}
                  onChange={(e) => {
                    setEventId(e.target.value);
                    setCertificate(null);
                    setError("");
                    setSearched(false);
                  }}
                  disabled={loadingEvents}
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10 disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingEvents
                      ? "Loading events..."
                      : "Select your event"}
                  </option>

                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Registration */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#172033]">
                  Registration / Roll Number
                </label>

                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => {
                    setRegistrationNumber(e.target.value);
                    setCertificate(null);
                    setError("");
                    setSearched(false);
                  }}
                  placeholder="Enter your registration / roll number"
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={searching}
              className="mt-6 w-full rounded-xl bg-[#1746a2] px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? "Searching..." : "Find Certificate"}
            </button>
          </form>
        </div>

        {/* Result */}
        {searched && certificate && (
          <div className="college-card mt-8 overflow-hidden border-[#1746a2]/20 bg-white shadow-xl">
            <div className="bg-[#eaf1ff] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-xl text-white">
                  ✓
                </div>

                <div>
                  <h2 className="font-black text-[#172033]">
                    Certificate Found
                  </h2>

                  <p className="text-sm text-[#667085]">
                    Your certificate is ready to download.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f8f6f0] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Student Name
                  </p>

                  <p className="mt-2 text-lg font-black text-[#172033]">
                    {certificate.student_name}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8f6f0] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Registration / Roll No.
                  </p>

                  <p className="mt-2 text-lg font-black text-[#1746a2]">
                    {certificate.registration_number}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8f6f0] p-5 sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                    Event
                  </p>

                  <p className="mt-2 text-lg font-black text-[#172033]">
                    {selectedEvent?.title || "SAC Event"}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={downloadCertificate}
                  className="flex-1 rounded-xl bg-[#f47b20] px-6 py-3.5 text-center font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#d96512] hover:shadow-lg"
                >
                  ⬇ Download Certificate
                </button>

                <a
                  href={certificate.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl border border-[#1746a2]/20 bg-[#eaf1ff] px-6 py-3.5 text-center font-black text-[#1746a2] transition hover:bg-[#dce8ff]"
                >
                  View Certificate
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon="1️⃣"
            title="Select Event"
            text="Choose the event in which you participated."
          />

          <InfoCard
            icon="2️⃣"
            title="Enter Number"
            text="Use the registration or roll number used for your certificate."
          />

          <InfoCard
            icon="3️⃣"
            title="Download"
            text="Find your certificate and download it instantly."
          />
        </div>
      </section>

      <footer className="border-t border-[#103575] bg-[#103575] py-8 text-center text-white">
        <p className="font-semibold">
          Government Engineering College Sheohar
        </p>

        <p className="mt-1 text-xs text-blue-100">
          Student Activity Council • E-Certificate Portal
        </p>
      </footer>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="college-card p-5 text-center">
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-3 font-black text-[#172033]">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-[#667085]">{text}</p>
    </div>
  );
}