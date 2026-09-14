"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string | null;
  position: string | null;
  branch: string | null;
  year_semester: string | null;
  reg_no: string | null;
  club: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  skill: string | null;
  photo: string | null;
  instagram: string | null;
  linkedin: string | null;
  display_order: number | null;
  created_at: string | null;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState<string | null>(null);

  const loadMembers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("members")
      .select(
        "id,name,position,branch,year_semester,reg_no,club,email,phone,bio,skill,photo,instagram,linkedin,display_order,created_at"
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setError("Unable to load members.");
    } else {
      setMembers(data || []);
      setError("");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMembers();

    const channel = supabase
      .channel("members-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members",
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* TOP SPACING FOR NAVBAR */}
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="bg-slate-950 px-4 py-20 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
          Student Activity Council
        </p>

        <h1 className="mt-3 text-4xl font-black sm:text-5xl">
          Meet Our Members
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-300">
          Meet the students who lead, create, organize and contribute
          to campus life at GEC Sheohar.
        </p>
      </section>

      {/* MEMBERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Team
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            SAC Members
          </h2>

          <p className="mt-3 text-slate-500">
            Click a card to view complete member information.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[500px] animate-pulse rounded-3xl bg-white shadow"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && members.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow">
            <div className="text-5xl">👥</div>

            <h3 className="mt-4 text-xl font-bold">
              No members found
            </h3>

            <p className="mt-2 text-slate-500">
              Members added from the admin panel will appear here.
            </p>
          </div>
        )}

        {/* MEMBERS GRID */}
        {!loading && !error && members.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => {
              const isFlipped = flipped === member.id;

              return (
                <div
                  key={member.id}
                  className="h-[500px]"
                  style={{ perspective: "1200px" }}
                >
                  <div
                    className="relative h-full w-full cursor-pointer"
                    onClick={() =>
                      setFlipped(isFlipped ? null : member.id)
                    }
                    style={{
                      transformStyle: "preserve-3d",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                      transition:
                        "transform 0.7s cubic-bezier(0.2,0.7,0.2,1)",
                    }}
                  >
                    {/* FRONT */}
                    <div
                      className="absolute inset-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div className="relative h-[310px] overflow-hidden bg-slate-200">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name || "SAC Member"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-7xl font-black text-white">
                            {(member.name || "M")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow">
                            {member.club || "SAC"}
                          </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      <div className="p-5">
                        <h3 className="truncate text-xl font-black">
                          {member.name || "SAC Member"}
                        </h3>

                        <p className="mt-1 truncate font-semibold text-blue-600">
                          {member.position || "SAC Member"}
                        </p>

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                          {member.phone && (
                            <div className="flex gap-2">
                              <span>📞</span>
                              <span className="truncate">
                                {member.phone}
                              </span>
                            </div>
                          )}

                          {member.email && (
                            <div className="flex gap-2">
                              <span>✉️</span>
                              <span className="truncate">
                                {member.email}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 border-t pt-4 text-center text-xs font-semibold text-slate-400">
                          Click to view full profile
                        </div>
                      </div>
                    </div>

                    {/* BACK */}
                    <div
                      className="absolute inset-0 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="flex h-full flex-col">
                        <div className="bg-gradient-to-br from-slate-950 to-blue-950 p-5 text-white">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white/10">
                              {member.photo ? (
                                <img
                                  src={member.photo}
                                  alt={member.name || "Member"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xl font-black">
                                  {(member.name || "M")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-black">
                                {member.name || "SAC Member"}
                              </h3>

                              <p className="truncate text-sm text-blue-300">
                                {member.position || "SAC Member"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                          <div className="space-y-4">
                            <InfoRow
                              label="Club"
                              value={member.club}
                            />

                            <InfoRow
                              label="Position"
                              value={member.position}
                            />

                            <InfoRow
                              label="Branch"
                              value={member.branch}
                            />

                            <InfoRow
                              label="Year / Semester"
                              value={member.year_semester}
                            />

                            <InfoRow
                              label="Registration No."
                              value={member.reg_no}
                            />

                            <InfoRow
                              label="Email"
                              value={member.email}
                            />

                            <InfoRow
                              label="Phone"
                              value={member.phone}
                            />

                            <InfoRow
                              label="Skills"
                              value={member.skill}
                            />

                            {member.bio && (
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                  About
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  {member.bio}
                                </p>
                              </div>
                            )}

                            {(member.instagram || member.linkedin) && (
                              <div className="border-t pt-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                  Social
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {member.instagram && (
                                    <a
                                      href={member.instagram}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) =>
                                        e.stopPropagation()
                                      }
                                      className="rounded-full bg-pink-50 px-3 py-2 text-xs font-bold text-pink-600"
                                    >
                                      Instagram
                                    </a>
                                  )}

                                  {member.linkedin && (
                                    <a
                                      href={member.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) =>
                                        e.stopPropagation()
                                      }
                                      className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
                                    >
                                      LinkedIn
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t bg-slate-50 p-4 text-center text-xs font-semibold text-slate-400">
                          Click to flip back
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SIMPLE FOOTER — NO ABOUT / CTA */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
          <img
            src="/sac-logo.jpg"
            alt="Student Activity Council GEC Sheohar"
            className="h-12 w-12 rounded-full object-cover"
          />

          <p className="font-bold text-slate-900">
            Student Activity Council
          </p>

          <p className="text-sm text-slate-500">
            GEC Sheohar
          </p>

          <p className="mt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} Government Engineering College
            Sheohar — Student Activity Council
          </p>
        </div>
      </footer>
    </main>
  );
}

/* INFO ROW */
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-700">
        {value}
      </p>
    </div>
  );
}