"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  short_name?: string | null;
  description?: string | null;
  faculty_incharge?: string | null;
  student_coordinator?: string | null;
  head_email?: string | null;
  head_phone?: string | null;
  coordinator_email?: string | null;
  coordinator_phone?: string | null;
  logo?: string | null;
};

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

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
        () => loadClubs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadClubs() {
    const { data } = await supabase
      .from("clubs")
      .select("*")
      .order("name", { ascending: true });

    if (data) setClubs(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eaf1ff] via-[#f8f6f0] to-[#fff1e6]" />
        <div className="college-pattern absolute inset-0 opacity-70" />

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1746a2]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1746a2]/15 bg-white/80 px-4 py-2 text-sm font-bold text-[#1746a2] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
              GEC SHEOHAR • STUDENT COMMUNITY
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
              Our{" "}
              <span className="gradient-text">Activity Clubs</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Discover the communities where students learn, create, compete,
              collaborate and turn their ideas into action.
            </p>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[430px] animate-pulse rounded-[24px] bg-white shadow-sm"
              />
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
              🎓
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#1746a2]">
              Clubs coming soon
            </h2>

            <p className="mt-2 text-slate-500">
              Club information will appear here once added by the SAC team.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club, index) => (
              <ClubCard
                key={club.id}
                club={club}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-10 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/sac-logo.jpg"
              alt="SAC Logo"
              className="h-11 w-11 rounded-full border border-slate-200 object-cover"
            />

            <div>
              <p className="font-black text-[#1746a2]">
                Student Activity Council
              </p>
              <p className="text-sm text-slate-500">GEC Sheohar</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Student Activity Council • GEC Sheohar
          </p>
        </div>
      </footer>
    </main>
  );
}

function ClubCard({
  club,
  index,
}: {
  club: Club;
  index: number;
}) {
  return (
    <article className="college-card group overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#eaf1ff] to-[#fff1e6]">
        {club.logo ? (
          <img
            src={club.logo}
            alt={club.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              🎓
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Club photo coming soon
            </p>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#1746a2] shadow-sm backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="absolute bottom-4 left-4 rounded-full bg-[#f47b20] px-3 py-1 text-xs font-bold text-white shadow-md">
          Student Club
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h2 className="text-xl font-black leading-tight text-[#1746a2]">
          {club.name}
        </h2>

        {club.short_name && (
          <p className="mt-1 text-sm font-bold text-[#f47b20]">
            {club.short_name}
          </p>
        )}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {club.description ||
            "A student-led activity club encouraging creativity, collaboration and meaningful campus participation."}
        </p>

        {/* FACULTY */}
        {club.faculty_incharge && (
          <div className="mt-5 rounded-2xl bg-[#f8f6f0] p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#f47b20]">
              Faculty In-Charge
            </p>

            <p className="mt-1 font-bold text-[#172033]">
              {club.faculty_incharge}
            </p>
          </div>
        )}

        {/* HEAD */}
        {club.student_coordinator && (
          <div className="mt-3 rounded-2xl border border-[#1746a2]/10 bg-[#eaf1ff]/60 p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1746a2]">
              Club Head
            </p>

            <p className="mt-1 font-bold text-[#172033]">
              {club.student_coordinator}
            </p>

            {(club.head_email || club.head_phone) && (
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                {club.head_email && (
                  <a
                    href={`mailto:${club.head_email}`}
                    className="block hover:text-[#1746a2]"
                  >
                    {club.head_email}
                  </a>
                )}

                {club.head_phone && (
                  <a
                    href={`tel:${club.head_phone}`}
                    className="block hover:text-[#1746a2]"
                  >
                    {club.head_phone}
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* COORDINATOR */}
        {(club.coordinator_email || club.coordinator_phone) && (
          <div className="mt-3 border-t border-slate-100 pt-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Coordinator Contact
            </p>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
              {club.coordinator_email && (
                <a
                  href={`mailto:${club.coordinator_email}`}
                  className="block hover:text-[#1746a2]"
                >
                  {club.coordinator_email}
                </a>
              )}

              {club.coordinator_phone && (
                <a
                  href={`tel:${club.coordinator_phone}`}
                  className="block hover:text-[#1746a2]"
                >
                  {club.coordinator_phone}
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 h-1 w-10 rounded-full bg-[#f47b20] transition-all duration-300 group-hover:w-20" />
      </div>
    </article>
  );
}