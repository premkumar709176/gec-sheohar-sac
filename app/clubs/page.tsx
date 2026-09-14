"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  activities: string;
  head: string;
  head_email: string | null;
  head_phone: string | null;
  coordinator: string;
  coordinator_email: string | null;
  coordinator_phone: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo: string | null;
  display_order: number;
};

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<string | null>(null);

  async function loadClubs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clubs")
      .select(
        "id,name,category,description,activities,head,head_email,head_phone,coordinator,coordinator_email,coordinator_phone,contact_name,contact_email,contact_phone,logo,display_order"
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error) {
      setClubs((data || []) as Club[]);
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

  function getActivities(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function toggleFlip(id: string) {
    setFlipped((current) => (current === id ? null : id));
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#103575]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,53,117,0.96),rgba(23,70,162,0.90))]" />

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#f47b20]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#f47b20]">
              Student Activity Council
            </p>

            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
              Our Clubs
            </h1>

            <div className="mt-5 h-1 w-16 rounded-full bg-[#f47b20]" />

            <p className="mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Explore the clubs of Government Engineering College Sheohar,
              discover their activities, and connect with their leadership.
            </p>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="college-pattern">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47b20]">
                Student Communities
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Discover Your Club
              </h2>

              <p className="mt-3 max-w-2xl text-slate-600">
                Click any club card to view complete details and contact
                information.
              </p>
            </div>

            <Link href="/join" className="btn-orange">
              Join SAC
            </Link>
          </div>

          {loading ? (
            <div className="college-card p-16 text-center">
              <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[#e4e7ec] border-t-[#1746a2]" />

              <p className="font-semibold text-slate-500">
                Loading clubs...
              </p>
            </div>
          ) : clubs.length === 0 ? (
            <div className="college-card p-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl font-black text-[#1746a2]">
                +
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Clubs coming soon
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-slate-500">
                Club information will appear here once it is added by the
                Student Activity Council.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {clubs.map((club) => {
                const activities = getActivities(club.activities);
                const isFlipped = flipped === club.id;

                return (
                  <div
                    key={club.id}
                    className="h-[590px] cursor-pointer [perspective:1200px]"
                    onClick={() => toggleFlip(club.id)}
                  >
                    <div
                      className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                      }`}
                    >
                      {/* FRONT */}
                      <article className="absolute inset-0 overflow-hidden rounded-[20px] border border-[#e4e7ec] bg-white shadow-sm [backface-visibility:hidden]">
                        <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#eaf1ff] p-8">
                          {club.logo ? (
                            <>
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98),rgba(234,241,255,0.9))]" />

                              <img
                                src={club.logo}
                                alt={`${club.name} logo`}
                                className="relative h-52 w-52 rounded-3xl bg-white object-contain p-4 shadow-lg transition duration-500"
                              />
                            </>
                          ) : (
                            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-white text-6xl font-black text-[#1746a2] shadow-lg">
                              {club.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="absolute right-5 top-5 rounded-full bg-[#f47b20] px-3 py-1.5 text-xs font-black text-white shadow-md">
                            #{club.display_order}
                          </div>
                        </div>

                        <div className="p-7">
                          {club.category && (
                            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#f47b20]">
                              {club.category}
                            </p>
                          )}

                          <h3 className="mt-2 text-2xl font-black leading-tight text-[#172033]">
                            {club.name}
                          </h3>

                          {club.description && (
                            <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                              {club.description}
                            </p>
                          )}

                          <div className="mt-7 flex items-center justify-between border-t border-[#e4e7ec] pt-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Tap to view details
                            </span>

                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1746a2]">
                              ↻
                            </span>
                          </div>
                        </div>
                      </article>

                      {/* BACK */}
                      <article className="absolute inset-0 overflow-y-auto rounded-[20px] border border-[#1746a2]/15 bg-white p-6 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="mb-5 flex items-start justify-between gap-3">
                          <div>
                            {club.category && (
                              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#f47b20]">
                                {club.category}
                              </p>
                            )}

                            <h3 className="mt-1 text-2xl font-black leading-tight text-[#172033]">
                              {club.name}
                            </h3>
                          </div>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-lg font-bold text-[#1746a2]">
                            ↻
                          </span>
                        </div>

                        {club.description && (
                          <div className="rounded-2xl bg-[#f8f6f0] p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1746a2]">
                              About
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {club.description}
                            </p>
                          </div>
                        )}

                        {activities.length > 0 && (
                          <div className="mt-4">
                            <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                              Activities
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {activities.map((activity, index) => (
                                <span
                                  key={`${club.id}-${index}`}
                                  className="rounded-full bg-[#eaf1ff] px-3 py-1.5 text-xs font-bold text-[#1746a2]"
                                >
                                  {activity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {club.head && (
                          <div className="mt-5 rounded-2xl border border-[#1746a2]/10 bg-[#eaf1ff]/70 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1746a2]">
                              Club Head
                            </p>

                            <p className="mt-2 text-lg font-black">
                              {club.head}
                            </p>

                            <div className="mt-3 space-y-2">
                              {club.head_email && (
                                <a
                                  href={`mailto:${club.head_email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex gap-2 text-sm font-medium text-[#1746a2] hover:underline"
                                >
                                  <span>✉</span>
                                  <span className="break-all">
                                    {club.head_email}
                                  </span>
                                </a>
                              )}

                              {club.head_phone && (
                                <a
                                  href={`tel:${club.head_phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex gap-2 text-sm font-medium text-[#1746a2] hover:underline"
                                >
                                  <span>☎</span>
                                  <span>{club.head_phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {club.coordinator && (
                          <div className="mt-4 rounded-2xl border border-[#f47b20]/10 bg-[#fff1e6] p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d96512]">
                              Student Coordinator
                            </p>

                            <p className="mt-2 text-lg font-black">
                              {club.coordinator}
                            </p>

                            <div className="mt-3 space-y-2">
                              {club.coordinator_email && (
                                <a
                                  href={`mailto:${club.coordinator_email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex gap-2 text-sm font-medium text-[#d96512] hover:underline"
                                >
                                  <span>✉</span>
                                  <span className="break-all">
                                    {club.coordinator_email}
                                  </span>
                                </a>
                              )}

                              {club.coordinator_phone && (
                                <a
                                  href={`tel:${club.coordinator_phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex gap-2 text-sm font-medium text-[#d96512] hover:underline"
                                >
                                  <span>☎</span>
                                  <span>{club.coordinator_phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {(club.contact_name ||
                          club.contact_email ||
                          club.contact_phone) && (
                          <div className="mt-4 rounded-2xl border border-[#e4e7ec] bg-white p-4">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                              Additional Contact
                            </p>

                            {club.contact_name && (
                              <p className="mt-2 font-bold">
                                {club.contact_name}
                              </p>
                            )}

                            {club.contact_email && (
                              <a
                                href={`mailto:${club.contact_email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 block break-all text-sm font-medium text-[#1746a2] hover:underline"
                              >
                                {club.contact_email}
                              </a>
                            )}

                            {club.contact_phone && (
                              <a
                                href={`tel:${club.contact_phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 block text-sm font-medium text-[#1746a2] hover:underline"
                              >
                                {club.contact_phone}
                              </a>
                            )}
                          </div>
                        )}

                        <div className="mt-5 border-t border-[#e4e7ec] pt-4 text-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Tap card to flip back
                          </span>
                        </div>
                      </article>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-12 text-center sm:flex-row sm:text-left lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#f47b20]">
              Get Involved
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Find your community at SAC.
            </h2>
          </div>

          <Link href="/join" className="btn-orange">
            Join a Club
          </Link>
        </div>
      </section>
    </main>
  );
}