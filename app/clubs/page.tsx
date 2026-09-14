"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  activities?: string | null;
  head?: string | null;
  head_email?: string | null;
  head_phone?: string | null;
  coordinator?: string | null;
  coordinator_email?: string | null;
  coordinator_phone?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  logo?: string | null;
  display_order?: number | null;
};

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadClubs() {
    const { data, error } = await supabase
      .from("clubs")
      .select(
        "id,name,category,description,activities,head,head_email,head_phone,coordinator,coordinator_email,coordinator_phone,contact_name,contact_email,contact_phone,logo,display_order"
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) {
      setClubs(data as Club[]);
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
                {/* CLUB PHOTO */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  {club.logo ? (
                    <>
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                      <div className="text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl font-black text-blue-400">
                          {club.name.charAt(0).toUpperCase()}
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-500">
                          Club photo will be added soon
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="p-6">
                  <h2 className="text-xl font-bold leading-snug">
                    {club.name}
                  </h2>

                  {club.category && (
                    <p className="mt-1 text-sm font-medium text-cyan-400">
                      {club.category}
                    </p>
                  )}

                  {club.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {club.description}
                    </p>
                  )}

                  {/* HEAD */}
                  {club.head && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Club Head
                      </p>

                      <p className="mt-2 font-semibold text-white">
                        {club.head}
                      </p>

                      {club.head_email && (
                        <a
                          href={`mailto:${club.head_email}`}
                          className="mt-2 block break-all text-sm text-slate-400 hover:text-cyan-400 hover:underline"
                        >
                          {club.head_email}
                        </a>
                      )}

                      {club.head_phone && (
                        <a
                          href={`tel:${club.head_phone}`}
                          className="mt-1 block text-sm text-slate-400 hover:text-cyan-400 hover:underline"
                        >
                          {club.head_phone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* COORDINATOR */}
                  {club.coordinator && (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                        Student Coordinator
                      </p>

                      <p className="mt-2 font-semibold text-white">
                        {club.coordinator}
                      </p>

                      {club.coordinator_email && (
                        <a
                          href={`mailto:${club.coordinator_email}`}
                          className="mt-2 block break-all text-sm text-slate-400 hover:text-blue-400 hover:underline"
                        >
                          {club.coordinator_email}
                        </a>
                      )}

                      {club.coordinator_phone && (
                        <a
                          href={`tel:${club.coordinator_phone}`}
                          className="mt-1 block text-sm text-slate-400 hover:text-blue-400 hover:underline"
                        >
                          {club.coordinator_phone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* ACTIVITIES */}
                  {club.activities && (
                    <div className="mt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Activities
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {club.activities
                          .split(",")
                          .map((activity, index) => {
                            const item = activity.trim();

                            if (!item) return null;

                            return (
                              <span
                                key={`${club.id}-${index}`}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                              >
                                {item}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* OLD GENERIC CONTACT */}
                  {(club.contact_name ||
                    club.contact_email ||
                    club.contact_phone) && (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Additional Contact
                      </p>

                      {club.contact_name && (
                        <p className="mt-2 text-sm text-slate-300">
                          {club.contact_name}
                        </p>
                      )}

                      {club.contact_email && (
                        <a
                          href={`mailto:${club.contact_email}`}
                          className="mt-1 block break-all text-sm text-slate-400 hover:text-cyan-400 hover:underline"
                        >
                          {club.contact_email}
                        </a>
                      )}

                      {club.contact_phone && (
                        <a
                          href={`tel:${club.contact_phone}`}
                          className="mt-1 block text-sm text-slate-400 hover:text-cyan-400 hover:underline"
                        >
                          {club.contact_phone}
                        </a>
                      )}
                    </div>
                  )}
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

                <p className="text-sm text-slate-400">
                  GEC Sheohar
                </p>
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