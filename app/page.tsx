"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/sac-campus.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <img
            src="/sac-logo.jpg"
            alt="Student Activity Council"
            className="mx-auto mb-8 h-28 w-28 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
          />

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            GEC Sheohar
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            Student Activity Council
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            The Student Activity Council of Government Engineering College,
            Sheohar provides a platform for students to explore their
            creativity, leadership, technical skills, cultural interests and
            social responsibility through a wide range of student-led clubs,
            events and activities.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/clubs"
              className="rounded-full bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
            >
              Explore Clubs
            </Link>

            <Link
              href="/join"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Join SAC
            </Link>
          </div>
        </div>
      </section>

      {/* SAC INTRO */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Student Life
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Learn. Create. Lead. Participate.
            </h2>

            <p className="mt-6 leading-8 text-slate-300">
              SAC brings together students from different branches and
              interests. Through technical, cultural, literary, social,
              creative and wellness activities, students get opportunities
              to learn beyond the classroom and develop confidence,
              teamwork and leadership.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-bold">Explore Your Interests</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Discover clubs and activities that match your technical,
                creative, cultural and personal interests.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-bold">Build Skills</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Participate in workshops, competitions, seminars and
                student-led activities to develop practical skills.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-xl font-bold">Make an Impact</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Work with fellow students to organize meaningful events and
                contribute to the college community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              SAC Portal
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Get Involved
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/clubs"
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-xl font-bold group-hover:text-blue-300">
                Clubs
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Explore all SAC clubs and their activities.
              </p>
            </Link>

            <Link
              href="/members"
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-xl font-bold group-hover:text-blue-300">
                Members
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Meet the students and faculty associated with SAC.
              </p>
            </Link>

            <Link
              href="/events"
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-xl font-bold group-hover:text-blue-300">
                Events
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Check workshops, competitions, seminars and activities.
              </p>
            </Link>

            <Link
              href="/gallery"
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-xl font-bold group-hover:text-blue-300">
                Gallery
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                View moments and memories from SAC activities.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="bg-blue-700 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Be a Part of SAC
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Participate in activities, work with different clubs, develop
            new skills and make your college journey more memorable.
          </p>

          <Link
            href="/join"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Join Student Activity Council
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">

            {/* LOGO + NAME */}
            <div className="flex items-center gap-4">
              <img
                src="/sac-logo.jpg"
                alt="Student Activity Council GEC Sheohar"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
              />

              <div>
                <h3 className="text-lg font-bold text-white">
                  Student Activity Council
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  GEC Sheohar
                </p>
              </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link href="/clubs" className="transition hover:text-white">
                Clubs
              </Link>

              <Link href="/members" className="transition hover:text-white">
                Members
              </Link>

              <Link href="/events" className="transition hover:text-white">
                Events
              </Link>

              <Link href="/gallery" className="transition hover:text-white">
                Gallery
              </Link>

              <Link href="/join" className="transition hover:text-white">
                Join SAC
              </Link>
            </div>
          </div>

          {/* LOCATION */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <h4 className="text-sm font-semibold text-white">
              Location
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Government Engineering College Sheohar,
              <br />
              Chhatauna Bisunpur, Block- Piprahi, Sheohar, Bihar,
              <br />
              Pin Code-843329
            </p>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-10 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Student Activity Council, GEC
              Sheohar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}