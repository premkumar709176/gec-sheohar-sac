"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Club = {
  id: string;
  name: string;
  short_name?: string | null;
  description?: string | null;
  faculty_incharge?: string | null;
  student_coordinator?: string | null;
};

function getClubImage(name: string) {
  const images: Record<string, string> = {
    "Bhabha – Science Club": "/clubs/science.jpg",
    "Vishveshvaraya – Technical Club": "/clubs/technical.jpg",
    "Media Club": "/clubs/media.jpg",
    "Eco Task Force": "/clubs/eco.jpg",
    "Literary & Poetry Club": "/clubs/literary.jpg",
    "Social Work & Heritage Club": "/clubs/social.jpg",
    "Red Ribbon Club": "/clubs/red-ribbon.jpg",
    "Electoral Literacy Club": "/clubs/electoral.jpg",
    "Natraj – Dance Club": "/clubs/dance.jpg",
    "Sur Sangam – Music Club": "/clubs/music.jpg",
    "Srijan – Art & Craft Club": "/clubs/art.jpg",
    "Yoga & Mental Wellness Club": "/clubs/yoga.jpg",
    "Pixel & Frame – Photography and Videography Club":
      "/clubs/photography.jpg",
    "DigiCrafters – Digital Art & Craft Club": "/clubs/digital-art.jpg",
  };

  return images[name] || "/sac-campus.jpg";
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadClubs() {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setClubs(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadClubs();

    const channel = supabase
      .channel("public-clubs")
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
      {/* NAVBAR SPACER */}
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="/sac-campus.jpg"
            alt="Government Engineering College Sheohar"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Student Activity Council
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Explore Our Clubs
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover the diverse student clubs of Government Engineering
              College Sheohar and find a space to learn, create, collaborate,
              and grow.
            </p>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-slate-400">Loading clubs...</p>
          </div>
        ) : clubs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <h2 className="text-2xl font-bold">No clubs available</h2>
            <p className="mt-3 text-slate-400">
              Club information will appear here once it is added.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <article
                key={club.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.06]"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={getClubImage(club.name)}
                    alt={club.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    {club.short_name && (
                      <span className="inline-flex rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur">
                        {club.short_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h2 className="text-xl font-bold leading-snug">
                    {club.name}
                  </h2>

                  {club.description && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                      {club.description}
                    </p>
                  )}

                  <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                    {club.faculty_incharge && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Faculty In-Charge
                        </p>
                        <p className="mt-1 text-sm text-slate-200">
                          {club.faculty_incharge}
                        </p>
                      </div>
                    )}

                    {club.student_coordinator && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Student Coordinator
                        </p>
                        <p className="mt-1 text-sm text-slate-200">
                          {club.student_coordinator}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/sac-logo.jpg"
                alt="Student Activity Council GEC Sheohar"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="font-bold text-white">
                  Student Activity Council
                </p>
                <p className="text-sm text-slate-400">GEC Sheohar</p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Student Activity Council, GEC
              Sheohar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}