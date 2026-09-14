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

      if (clubsData) setClubs(clubsData);
      if (eventsData) setEvents(eventsData);
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">

      {/* HERO */}
      <section
        className="relative min-h-[700px] overflow-hidden bg-cover bg-center bg-no-repeat pt-[76px]"
        style={{
          backgroundImage: "url('/sac-campus.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#061b40]/72" />

        <div className="relative mx-auto flex min-h-[624px] max-w-7xl items-center px-6 py-24 lg:px-10">
          <div className="max-w-4xl text-white">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
              Student Activity Council • GEC Sheohar
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Empowering Student
              <span className="block text-orange-300">
                Potential.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/90 sm:text-xl">
              The Student Activity Council is the vibrant student community
              of Government Engineering College Sheohar, created to help
              students discover their talents, develop leadership qualities,
              build meaningful connections and grow beyond the classroom.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100">
              From technical innovation and science to literature, music,
              dance, art, photography, social service and wellness, SAC gives
              every student a platform to participate, create, lead and make
              a difference.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/join"
                className="rounded-full bg-[#f47b20] px-7 py-3.5 text-center font-bold text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-1 hover:bg-[#d96512]"
              >
                Become a Member →
              </Link>

              <Link
                href="/clubs"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-center font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#1746a2]"
              >
                Explore Our Clubs
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* WHAT IS SAC */}
      <section className="section-container py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              About SAC
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-[#1746a2] sm:text-4xl">
              A platform where students discover, participate and lead.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                The Student Activity Council (SAC) of Government Engineering
                College Sheohar provides students with a platform to explore
                interests and talents outside the regular academic curriculum.
              </p>

              <p>
                SAC brings together a diverse range of student clubs and
                activities covering technology, science, literature, arts,
                music, dance, photography, social work, health awareness,
                wellness and civic responsibility.
              </p>

              <p>
                Through workshops, competitions, awareness programmes,
                cultural activities, technical projects and student-led
                initiatives, SAC encourages students to learn by doing and
                become confident contributors to the college community.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="college-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-black text-[#1746a2]">
                Our Mission
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                To create opportunities where students can develop creativity,
                leadership, teamwork, communication and practical skills.
              </p>
            </div>

            <div className="college-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
                💡
              </div>
              <h3 className="text-xl font-black text-[#1746a2]">
                Our Vision
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                To build an active, creative and inclusive campus where every
                student gets the opportunity to learn, express and lead.
              </p>
            </div>

            <div className="college-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                🤝
              </div>
              <h3 className="text-xl font-black text-[#1746a2]">
                Community
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                SAC connects students through collaborative activities,
                projects, events and experiences across different clubs.
              </p>
            </div>

            <div className="college-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-black text-[#1746a2]">
                Growth
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Students gain practical exposure, confidence and experience
                by taking part in real activities beyond the classroom.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHY SAC */}
      <section className="bg-white py-20">
        <div className="section-container">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Why Join SAC?
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#1746a2] sm:text-4xl">
              More than just extracurricular activities
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              SAC is an opportunity to discover yourself, work with others and
              develop skills that complement your academic journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="college-card p-7">
              <div className="text-3xl">🧠</div>
              <h3 className="mt-5 text-xl font-black text-[#1746a2]">
                Discover Your Talent
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Explore new interests and find your strengths through
                different clubs, events and activities.
              </p>
            </div>

            <div className="college-card p-7">
              <div className="text-3xl">👥</div>
              <h3 className="mt-5 text-xl font-black text-[#1746a2]">
                Build Connections
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Work with students from different branches and semesters while
                building teamwork and communication skills.
              </p>
            </div>

            <div className="college-card p-7">
              <div className="text-3xl">🏆</div>
              <h3 className="mt-5 text-xl font-black text-[#1746a2]">
                Create & Lead
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Organise activities, participate in competitions and take
                responsibility as a student leader.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="section-container py-20">

        <div className="mb-10 flex items-end justify-between gap-4">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#1746a2] sm:text-4xl">
              Our Clubs
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore the different communities of SAC and find the space
              where your interests and ideas can grow.
            </p>
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
              className="college-card group overflow-hidden"
            >

              {club.logo ? (
                <div className="image-hover h-52 bg-[#eaf1ff]">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-52 items-center justify-center bg-[#eaf1ff]">
                  <span className="text-6xl font-black text-[#1746a2]">
                    {club.name?.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">

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

                <div className="mt-5 font-bold text-[#1746a2] transition group-hover:text-[#f47b20]">
                  Explore Club →
                </div>

              </div>

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

      {/* SAC ACTIVITIES */}
      <section className="bg-[#eaf1ff] py-20">
        <div className="section-container">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              What We Do
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#1746a2] sm:text-4xl">
              Learn. Create. Participate. Lead.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              SAC activities are designed to give students practical exposure
              and meaningful opportunities to contribute to campus life.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              ["🔬", "Technical & Science", "Projects, workshops, experiments and technical innovation."],
              ["🎨", "Arts & Culture", "Art, dance, music, literature and cultural expression."],
              ["📸", "Media & Creativity", "Photography, videography, editing and digital content."],
              ["❤️", "Social & Wellness", "Community service, awareness, wellness and responsible citizenship."],
            ].map(([icon, title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white bg-white p-6 shadow-sm"
              >
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-4 font-black text-[#1746a2]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-white py-20">
        <div className="section-container">

          <div className="mb-10 flex items-end justify-between gap-4">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
                What&apos;s Happening
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#1746a2] sm:text-4xl">
                Upcoming Events
              </h2>

              <p className="mt-3 text-slate-600">
                Stay updated with workshops, programmes, competitions and
                activities happening through SAC.
              </p>
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

      {/* JOIN CTA */}
      <section className="section-container py-20">

        <div className="overflow-hidden rounded-3xl bg-[#1746a2] p-8 text-white shadow-xl sm:p-12">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
                Be Part of SAC
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Your college journey is more than the classroom.
              </h2>

              <p className="mt-5 max-w-3xl leading-7 text-blue-100">
                Join a club, participate in an event, share your ideas and
                discover opportunities to build skills, friendships and
                experiences that stay with you beyond college.
              </p>
            </div>

            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-full bg-[#f47b20] px-7 py-3.5 font-bold text-white transition hover:bg-[#d96512]"
            >
              Join SAC →
            </Link>

          </div>

        </div>

      </section>

      {/* FEEDBACK */}
      <section className="section-container pb-20">

        <div className="rounded-3xl border border-[#dce6f8] bg-[#eaf1ff] p-8 sm:p-12">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Your Voice Matters
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#1746a2] sm:text-4xl">
              Have a suggestion or concern?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              Share your ideas, suggestions or raise a ticket. Your feedback
              helps us make student activities better.
            </p>

            <Link
              href="/suggestions"
              className="mt-7 inline-flex rounded-full bg-[#1746a2] px-7 py-3.5 font-bold text-white transition hover:bg-[#103575]"
            >
              Suggestions &amp; Support →
            </Link>

          </div>

        </div>

      </section>

      {/* SOCIAL */}
      <section className="bg-[#f0f4fb] py-16">

        <div className="section-container text-center">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
            Stay Connected
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#1746a2]">
            Follow SAC GEC Sheohar
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Follow our social channels for event updates, activities,
            announcements and highlights from campus.
          </p>

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

            <h2 className="mt-2 text-3xl font-black text-[#1746a2] sm:text-4xl">
              Government Engineering College Sheohar
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
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