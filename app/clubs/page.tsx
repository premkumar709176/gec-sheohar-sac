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
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/sac-campus.jpg"
            alt="Government Engineering College Sheohar"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#0f1f3d]/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f3d]/90 via-[#1746a2]/65 to-[#1746a2]/30" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:py-36 lg:px-8">
          <div className="max-w-3xl fade-up">
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              Student Activity Council
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Explore Our
              <span className="block text-[#f47b20]">Clubs</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
              Discover the diverse student clubs of Government Engineering
              College Sheohar and find a space to learn, create, collaborate,
              and grow.
            </p>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="college-pattern px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eaf1ff] border-t-[#1746a2]" />
                <p className="mt-5 font-medium text-[#667085]">
                  Loading clubs...
                </p>
              </div>
            </div>
          ) : clubs.length === 0 ? (
            <div className="college-card p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
                🏛️
              </div>

              <h2 className="mt-6 text-2xl font-black text-[#172033]">
                No clubs available
              </h2>

              <p className="mt-3 text-[#667085]">
                Club information will appear here once it is added.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <article
                  key={club.id}
                  className="college-card group overflow-hidden"
                >
                  {/* CLUB PHOTO */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#eaf1ff]">
                    {club.logo ? (
                      <>
                        <img
                          src={club.logo}
                          alt={club.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f3d]/65 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eaf1ff] to-white">
                        <div className="text-center">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1746a2] text-3xl font-black text-white shadow-lg">
                            {club.name.charAt(0).toUpperCase()}
                          </div>

                          <p className="mt-4 text-sm font-medium text-[#667085]">
                            Club photo will be added soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="p-6">
                    <h2 className="text-xl font-black leading-snug text-[#172033]">
                      {club.name}
                    </h2>

                    {club.category && (
                      <p className="mt-1 text-sm font-bold text-[#f47b20]">
                        {club.category}
                      </p>
                    )}

                    {club.description && (
                      <p className="mt-4 text-sm leading-6 text-[#667085]">
                        {club.description}
                      </p>
                    )}

                    {/* HEAD */}
                    {club.head && (
                      <div className="mt-6 rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#f47b20]">
                          Club Head
                        </p>

                        <p className="mt-2 font-bold text-[#172033]">
                          {club.head}
                        </p>

                        {club.head_email && (
                          <a
                            href={`mailto:${club.head_email}`}
                            className="mt-2 block break-all text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
                          >
                            {club.head_email}
                          </a>
                        )}

                        {club.head_phone && (
                          <a
                            href={`tel:${club.head_phone}`}
                            className="mt-1 block text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
                          >
                            {club.head_phone}
                          </a>
                        )}
                      </div>
                    )}

                    {/* COORDINATOR */}
                    {club.coordinator && (
                      <div className="mt-3 rounded-2xl border border-[#e4e7ec] bg-[#eaf1ff] p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1746a2]">
                          Student Coordinator
                        </p>

                        <p className="mt-2 font-bold text-[#172033]">
                          {club.coordinator}
                        </p>

                        {club.coordinator_email && (
                          <a
                            href={`mailto:${club.coordinator_email}`}
                            className="mt-2 block break-all text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
                          >
                            {club.coordinator_email}
                          </a>
                        )}

                        {club.coordinator_phone && (
                          <a
                            href={`tel:${club.coordinator_phone}`}
                            className="mt-1 block text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
                          >
                            {club.coordinator_phone}
                          </a>
                        )}
                      </div>
                    )}

                    {/* ACTIVITIES */}
                    {club.activities && (
                      <div className="mt-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#667085]">
                          Activities
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {club.activities.split(",").map((activity, index) => {
                            const item = activity.trim();

                            if (!item) return null;

                            return (
                              <span
                                key={`${club.id}-${index}`}
                                className="rounded-full border border-[#dbe4f5] bg-[#eaf1ff] px-3 py-1.5 text-xs font-medium text-[#1746a2]"
                              >
                                {item}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ADDITIONAL CONTACT */}
                    {(club.contact_name ||
                      club.contact_email ||
                      club.contact_phone) && (
                      <div className="mt-5 border-t border-[#e4e7ec] pt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                          Additional Contact
                        </p>

                        {club.contact_name && (
                          <p className="mt-2 text-sm font-semibold text-[#172033]">
                            {club.contact_name}
                          </p>
                        )}

                        {club.contact_email && (
                          <a
                            href={`mailto:${club.contact_email}`}
                            className="mt-1 block break-all text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
                          >
                            {club.contact_email}
                          </a>
                        )}

                        {club.contact_phone && (
                          <a
                            href={`tel:${club.contact_phone}`}
                            className="mt-1 block text-sm text-[#667085] hover:text-[#1746a2] hover:underline"
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
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/sac-logo.jpg"
                  alt="Student Activity Council GEC Sheohar"
                  className="h-12 w-12 rounded-full border border-[#e4e7ec] object-cover shadow-sm"
                />

                <div>
                  <p className="font-bold text-[#1746a2]">
                    Student Activity Council
                  </p>

                  <p className="text-sm text-[#667085]">GEC Sheohar</p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#667085]">
                Explore student clubs at Government Engineering College
                Sheohar and discover opportunities to learn, create and lead.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#172033]">Quick Links</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-[#667085]">
                <a href="/" className="transition hover:text-[#1746a2]">
                  Home
                </a>

                <a
                  href="/clubs"
                  className="font-semibold text-[#1746a2]"
                >
                  Clubs
                </a>

                <a
                  href="/members"
                  className="transition hover:text-[#1746a2]"
                >
                  Members
                </a>

                <a
                  href="/events"
                  className="transition hover:text-[#1746a2]"
                >
                  Events
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#172033]">Get Involved</h3>

              <p className="mt-4 text-sm leading-6 text-[#667085]">
                Interested in joining a club or participating in SAC
                activities?
              </p>

              <a href="/join" className="btn-orange mt-5">
                Join SAC →
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-[#e4e7ec] pt-6 text-center text-xs text-[#667085]">
            © {new Date().getFullYear()} Government Engineering College
            Sheohar — Student Activity Council. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}