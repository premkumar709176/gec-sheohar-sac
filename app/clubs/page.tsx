"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  activities: string | null;
  head: string | null;
  coordinator: string | null;
  logo: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  display_order: number | null;
};

function getClubImage(name: string) {
  const club = name.toLowerCase().trim();

  if (club.includes("digicrafter")) {
    return "/clubs/digicrafter.jpg";
  }

  if (club.includes("eco")) {
    return "/clubs/Eco Task Force.jpg";
  }

  if (club.includes("media")) {
    return "/clubs/Media Club.jpg";
  }

  if (club.includes("red ribbon")) {
    return "/clubs/Red Ribbon Club.jpg";
  }

  if (club.includes("science") || club.includes("bhabha")) {
    return "/clubs/Bhabha.jpg";
  }

  if (club.includes("social") || club.includes("heritage")) {
    return "/clubs/Social Work & Heritage Club.jpg";
  }

  if (club.includes("srijan")) {
    return "/clubs/srijan.jpg";
  }

  if (club.includes("technical") || club.includes("vishvesvaraya")) {
    return "/clubs/technical.jpg";
  }

  if (club.includes("yoga")) {
    return "/clubs/yoga.jpg";
  }

  return null;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClubs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("clubs")
      .select(
        `
        id,
        name,
        category,
        description,
        activities,
        head,
        coordinator,
        logo,
        contact_name,
        contact_email,
        contact_phone,
        display_order
      `
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setError(error.message);
      setClubs([]);
    } else {
      setClubs(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadClubs();

    const channel = supabase
      .channel("public-clubs-page")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clubs",
        },
        () => {
          loadClubs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Student Activity Council
            </p>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Explore Our
              <span className="block text-slate-400">
                Activity Clubs.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Discover the student-led clubs at Government Engineering
              College Sheohar and find the community that matches your
              interests, skills and passion.
            </p>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="text-slate-400">
              Loading clubs...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <p className="font-semibold text-red-300">
              Unable to load clubs
            </p>

            <p className="mt-2 text-sm text-red-200/70">
              {error}
            </p>

            <button
              onClick={loadClubs}
              className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Try Again
            </button>
          </div>
        ) : clubs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              🎓
            </div>

            <h2 className="text-2xl font-bold">
              Clubs Coming Soon
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              Club information will be published here soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  SAC Clubs
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Find Your Community
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {clubs.length}{" "}
                {clubs.length === 1 ? "Club" : "Clubs"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => {
                const activities =
                  club.activities
                    ?.split(/[,;\n]/)
                    .map((item) => item.trim())
                    .filter(Boolean) || [];

                const clubImage = getClubImage(club.name);

                return (
                  <article
                    key={club.id}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    {/* CLUB PHOTO */}
                    <div className="relative flex h-60 items-center justify-center overflow-hidden bg-white">
                      {clubImage ? (
                        <img
                          src={clubImage}
                          alt={`${club.name} logo`}
                          className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                        />
                      ) : club.logo ? (
                        <img
                          src={club.logo}
                          alt={`${club.name} logo`}
                          className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-3xl font-black text-slate-700">
                          {club.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      {club.category && (
                        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          {club.category}
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold">
                        {club.name}
                      </h3>

                      {club.description && (
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                          {club.description}
                        </p>
                      )}

                      {/* ACTIVITIES */}
                      {activities.length > 0 && (
                        <div className="mt-5">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Activities
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {activities.map((activity, index) => (
                              <span
                                key={`${activity}-${index}`}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LEADERS */}
                      {(club.head || club.coordinator) && (
                        <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                          {club.head && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                Club Head
                              </p>

                              <p className="mt-1 font-medium text-slate-200">
                                {club.head}
                              </p>
                            </div>
                          )}

                          {club.coordinator && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                Coordinator
                              </p>

                              <p className="mt-1 whitespace-pre-line font-medium text-slate-200">
                                {club.coordinator}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CONTACT */}
                      {(club.contact_name ||
                        club.contact_email ||
                        club.contact_phone) && (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Contact
                          </p>

                          {club.contact_name && (
                            <p className="mt-2 font-semibold text-slate-200">
                              {club.contact_name}
                            </p>
                          )}

                          {club.contact_email && (
                            <a
                              href={`mailto:${club.contact_email}`}
                              className="mt-2 block break-all text-sm text-blue-400 transition hover:text-blue-300"
                            >
                              {club.contact_email}
                            </a>
                          )}

                          {club.contact_phone && (
                            <a
                              href={`tel:${club.contact_phone}`}
                              className="mt-1 block text-sm text-emerald-400 transition hover:text-emerald-300"
                            >
                              {club.contact_phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* JOIN CTA */}
      <section className="border-t border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 text-center sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Get Involved
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Ready to become part of SAC?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Join a club, meet like-minded students and turn your ideas
              into real activities and experiences.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/join"
                className="rounded-full bg-white px-7 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Join SAC
              </Link>

              <Link
                href="/events"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-300">
              Government Engineering College Sheohar
            </p>

            <p className="mt-1">
              Student Activity Council
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/about"
              className="transition hover:text-white"
            >
              About
            </Link>

            <Link
              href="/members"
              className="transition hover:text-white"
            >
              Members
            </Link>

            <Link
              href="/events"
              className="transition hover:text-white"
            >
              Events
            </Link>

            <Link
              href="/gallery"
              className="transition hover:text-white"
            >
              Gallery
            </Link>

            <Link
              href="/suggestions"
              className="transition hover:text-white"
            >
              Feedback
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}