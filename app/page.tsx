"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  logo?: string | null;
};

type Event = {
  id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  event_time?: string | null;
  venue?: string | null;
  poster_url?: string | null;
};

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [{ data: clubsData }, { data: eventsData }] = await Promise.all([
        supabase
          .from("clubs")
          .select("*")
          .order("created_at", { ascending: true }),

        supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true })
          .limit(3),
      ]);

      if (clubsData) {
        setClubs(clubsData);
      }

      if (eventsData) {
        setEvents(eventsData);
      }
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">

      {/* HERO */}
      <section
        className="relative min-h-[680px] overflow-hidden bg-cover bg-center bg-no-repeat pt-[76px]"
        style={{
          backgroundImage: "url('/sac-campus.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#071a3d]/65" />

        <div className="relative mx-auto flex min-h-[604px] max-w-7xl items-center justify-center px-6 py-24 text-center lg:px-10">
          <div className="mx-auto max-w-4xl text-white">

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-orange-300">
              Student Activity Council
            </p>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">Empowering Student</span>
              <span className="mt-2 block">Potential.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
              A vibrant platform at Government Engineering College Sheohar
              where students connect, create, lead and grow beyond the
              classroom.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/join"
                className="rounded-full bg-[#f47b20] px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-1 hover:bg-[#d96512]"
              >
                Become a Member →
              </Link>

              <Link
                href="/events"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1746a2]"
              >
                Explore Events
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT SAC */}
      <section className="section-container py-20">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
            About SAC
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#1746a2] sm:text-4xl">
            Explore Student Activity Council
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The Student Activity Council provides students with opportunities
            to discover their talents, develop leadership skills, participate
            in diverse activities and contribute meaningfully to campus life.
            Through clubs, events, workshops and student-led initiatives, SAC
            creates a community where every student can learn, express and
            grow.
          </p>

        </div>
      </section>

      {/* CLUBS */}
      <section className="section-container py-16">

        <div className="mb-10 flex items-end justify-between gap-4">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#1746a2]">
              Our Clubs
            </h2>
          </div>

          <Link
            href="/clubs"
            className="hidden font-bold text-[#1746a2] transition hover:text-[#f47b20] sm:block"
          >
            View All →
          </Link>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {clubs.slice(0, 6).map((club) => (
            <Link
              key={club.id}
              href="/clubs"
              className="college-card group p-6"
            >

              <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#eaf1ff]">

                {club.logo ? (
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-[#1746a2]">
                    {club.name?.charAt(0)}
                  </span>
                )}

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#f47b20]">
                {club.category || "Student Club"}
              </p>

              <h3 className="mt-2 text-xl font-black text-[#1746a2] transition group-hover:text-[#f47b20]">
                {club.name}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {club.description ||
                  "Explore activities, opportunities and experiences through this SAC club."}
              </p>

            </Link>
          ))}

        </div>

        <Link
          href="/clubs"
          className="mt-8 inline-flex font-bold text-[#1746a2] sm:hidden"
        >
          View All Clubs →
        </Link>

      </section>

      {/* EVENTS */}
      <section className="bg-white py-20">
        <div className="section-container">

          <div className="mb-10 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
                What&apos;s Happening
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#1746a2]">
                Upcoming Events
              </h2>
            </div>

            <Link
              href="/events"
              className="hidden font-bold text-[#1746a2] transition hover:text-[#f47b20] sm:block"
            >
              View All →
            </Link>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {events.map((event) => (
              <Link
                key={event.id}
                href="/events"
                className="college-card group overflow-hidden"
              >

                {event.poster_url && (
                  <div className="image-hover h-52 bg-slate-100">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#f47b20]">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Upcoming Event"}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#1746a2] transition group-hover:text-[#f47b20]">
                    {event.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {event.description ||
                      "Join us for an exciting student activity at GEC Sheohar."}
                  </p>

                  {event.venue && (
                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      📍 {event.venue}
                    </p>
                  )}

                </div>

              </Link>
            ))}

            {events.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-[#f8f6f0] p-12 text-center text-slate-500">
                No upcoming events at the moment.
              </div>
            )}

          </div>

          <Link
            href="/events"
            className="mt-8 inline-flex font-bold text-[#1746a2] sm:hidden"
          >
            View All Events →
          </Link>

        </div>
      </section>

      {/* FEEDBACK */}
      <section className="section-container py-20">

        <div className="rounded-3xl bg-[#1746a2] p-8 text-white shadow-xl sm:p-12">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
              Your Voice Matters
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Have a suggestion or concern?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
              Share your ideas, suggestions or raise a ticket. Your feedback
              helps us make student activities better.
            </p>

            <Link
              href="/suggestions"
              className="mt-7 inline-flex rounded-full bg-[#f47b20] px-7 py-3.5 font-bold text-white transition hover:bg-[#d96512]"
            >
              Suggestions &amp; Support →
            </Link>

          </div>

        </div>

      </section>

      {/* SOCIAL */}
      <section className="bg-[#eaf1ff] py-16">

        <div className="section-container text-center">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
            Stay Connected
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#1746a2]">
            Follow SAC GEC Sheohar
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href="https://www.youtube.com/@SAC-GECSheohar"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 font-bold text-[#1746a2] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              YouTube
            </a>

            <a
              href="https://www.facebook.com/share/1BbqbSh9Qw/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 font-bold text-[#1746a2] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/sacgecsheohar?stkn=ZjgwM2gwcmJxZXE1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 font-bold text-[#1746a2] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              Instagram
            </a>

          </div>

        </div>

      </section>

      {/* LOCATION */}
      <section className="section-container py-20">

        <div className="grid items-center gap-10 lg:grid-cols-2">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Visit Us
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#1746a2]">
              Government Engineering College Sheohar
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Student Activity Council, Government Engineering College
              Sheohar, Bihar.
            </p>

            <a
              href="https://maps.google.com/?q=Government+Engineering+College+Sheohar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7"
            >
              Open in Google Maps →
            </a>

          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

            <iframe
              src="https://www.google.com/maps?q=Government%20Engineering%20College%20Sheohar&output=embed"
              width="100%"
              height="350"
              loading="lazy"
              className="border-0"
              title="Government Engineering College Sheohar location"
            />

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#103575] py-10 text-white">

        <div className="section-container flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">

          <div>
            <p className="font-black">
              Student Activity Council
            </p>

            <p className="mt-1 text-sm text-blue-200">
              Government Engineering College Sheohar
            </p>
          </div>

          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} SAC GEC Sheohar. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}