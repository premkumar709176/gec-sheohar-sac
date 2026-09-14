"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative flex min-h-[calc(100vh-76px)] items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/sac-campus.jpg')" }}
        />

        <div className="absolute inset-0 bg-[#0f1f3d]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f3d]/95 via-[#1746a2]/55 to-[#1746a2]/20" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-4xl text-white fade-up">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              Government Engineering College Sheohar
            </div>

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Empowering
              <span className="block text-[#f47b20]">
                Student Potential.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">
              The Student Activity Council (SAC) of Government Engineering
              College Sheohar is a student-driven platform dedicated to
              creating a vibrant, inclusive and engaging campus environment.
              SAC provides students with opportunities to discover their
              interests, showcase their talents, develop leadership and
              teamwork skills, and gain practical experience beyond academics.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/join"
                className="inline-flex items-center justify-center rounded-full bg-[#f47b20] px-7 py-4 font-bold text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-1 hover:bg-[#d96512]"
              >
                Become a Member →
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITY CLUBS */}
      <section className="college-pattern px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#f47b20]">
              Explore
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#172033] sm:text-4xl">
              Activity Clubs
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#667085]">
              Discover different clubs where students can learn,
              participate, create and lead.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ActivityCard
              icon="🔬"
              title="Science"
              description="Explore scientific thinking, experiments and innovation."
            />

            <ActivityCard
              icon="⚙️"
              title="Technical"
              description="Build technical skills through projects and competitions."
            />

            <ActivityCard
              icon="🎨"
              title="Creative"
              description="Express yourself through art, design, media and literature."
            />

            <ActivityCard
              icon="🎭"
              title="Cultural"
              description="Celebrate talent through music, dance and cultural activities."
            />
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/clubs"
              className="btn-primary"
            >
              View All Clubs →
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#f47b20]">
                Stay Updated
              </span>

              <h2 className="mt-4 text-3xl font-black text-[#172033] sm:text-4xl">
                Events & Activities
              </h2>

              <p className="mt-5 leading-7 text-[#667085]">
                Stay informed about upcoming SAC events, workshops, seminars,
                competitions, cultural programs and club activities happening
                at GEC Sheohar.
              </p>

              <Link
                href="/events"
                className="btn-primary mt-7"
              >
                Explore Events →
              </Link>
            </div>

            <div className="college-card blue-glow p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                  📅
                </div>

                <div>
                  <p className="text-sm font-bold text-[#f47b20]">
                    SAC Events
                  </p>

                  <h3 className="text-xl font-bold text-[#172033]">
                    Something exciting is coming
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-[#667085]">
                Upcoming event information will be published here as
                activities are scheduled.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-block text-sm font-bold text-[#1746a2] transition hover:text-[#103575]"
              >
                View Events →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[28px] bg-[#1746a2] p-8 text-white shadow-xl sm:p-12">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  Your Voice Matters
                </span>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Suggestions & Complaints
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-blue-50">
                  Have an idea to improve SAC activities? Facing an issue or
                  concern? Share your feedback with the Student Activity
                  Council.
                </p>

                <p className="mt-3 max-w-xl leading-7 text-blue-100">
                  Your feedback can help us improve clubs, events, activities
                  and the overall student experience.
                </p>

                <Link
                  href="/suggestions"
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 font-bold text-[#1746a2] transition hover:-translate-y-1 hover:bg-[#fff1e6]"
                >
                  Share Your Feedback →
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f47b20] text-2xl">
                    💡
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Give a Suggestion
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-blue-50">
                    Share ideas for new events, clubs, activities or campus
                    improvements.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                    ⚠️
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Report an Issue
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-blue-50">
                    Report a concern or issue that needs attention from the
                    SAC.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN SAC */}
      <section className="bg-[#fff1e6] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#f47b20]">
            Get Involved
          </span>

          <h2 className="mt-4 text-3xl font-black text-[#172033] sm:text-4xl">
            Be a part of SAC
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#667085]">
            Join a club, participate in activities, develop new skills and
            make your college experience more meaningful.
          </p>

          <Link
            href="/join"
            className="btn-orange mt-8"
          >
            Join Student Activity Council →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/sac-logo.jpg"
                  alt="Student Activity Council GEC Sheohar"
                  className="h-12 w-12 rounded-full border border-[#e4e7ec] object-cover shadow-sm"
                />

                <div>
                  <p className="font-bold text-[#1746a2]">
                    GEC Sheohar
                  </p>

                  <p className="text-xs text-[#667085]">
                    Student Activity Council
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#667085]">
                Student Activity Council of Government Engineering College
                Sheohar — encouraging student participation, creativity,
                leadership and campus engagement.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#172033]">
                Quick Links
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-[#667085]">
                <Link href="/" className="transition hover:text-[#1746a2]">
                  Home
                </Link>

                <Link href="/clubs" className="transition hover:text-[#1746a2]">
                  Clubs
                </Link>

                <Link href="/members" className="transition hover:text-[#1746a2]">
                  Members
                </Link>

                <Link href="/events" className="transition hover:text-[#1746a2]">
                  Events
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#172033]">
                Student
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-[#667085]">
                <Link href="/gallery" className="transition hover:text-[#1746a2]">
                  Gallery
                </Link>

                <Link href="/join" className="transition hover:text-[#1746a2]">
                  Join SAC
                </Link>

                <Link
                  href="/suggestions"
                  className="transition hover:text-[#1746a2]"
                >
                  Suggestions & Complaints
                </Link>
              </div>
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

function ActivityCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href="/clubs"
      className="college-card group p-7"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl transition group-hover:bg-[#1746a2] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#172033]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#667085]">
        {description}
      </p>

      <div className="mt-5 text-sm font-bold text-[#1746a2]">
        Explore →
      </div>
    </Link>
  );
}