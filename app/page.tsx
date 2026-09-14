"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <img
              src="/sac-logo.jpg"
              alt="Student Activity Council GEC Sheohar"
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <p className="text-sm font-bold leading-tight">
                Student Activity Council
              </p>
              <p className="text-xs text-slate-300">
                GEC Sheohar
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium lg:flex">

            <Link
              href="/"
              className="text-blue-300 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/clubs"
              className="transition hover:text-blue-300"
            >
              Clubs
            </Link>

            <Link
              href="/members"
              className="transition hover:text-blue-300"
            >
              Members
            </Link>

            <Link
              href="/events"
              className="transition hover:text-blue-300"
            >
              Events
            </Link>

            <Link
              href="/gallery"
              className="transition hover:text-blue-300"
            >
              Gallery
            </Link>

            <Link
              href="/suggestions"
              className="transition hover:text-blue-300"
            >
              Feedback
            </Link>

            <Link
              href="/join"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-500"
            >
              Join SAC
            </Link>

          </div>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen items-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/sac-campus.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-slate-950/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-blue-950/30" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 lg:px-8">

          <div className="max-w-4xl text-white">

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Empowering
              <span className="block text-blue-400">
                Student Potential.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
              The Student Activity Council (SAC) of Government Engineering
              College Sheohar is a student-driven platform dedicated to
              creating a vibrant, inclusive and engaging campus environment.
              SAC provides students with opportunities to discover their
              interests, showcase their talents, develop leadership and
              teamwork skills, and gain practical experience beyond academics.
              Through various clubs, workshops, seminars, competitions,
              cultural programs, social initiatives and other activities,
              SAC encourages creativity, innovation and active participation.
              It brings students together to learn, collaborate, lead and
              contribute positively to college life.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/join"
                className="rounded-xl bg-blue-600 px-7 py-4 text-center font-bold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
              >
                Become a Member →
              </Link>

              <Link
                href="/events"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Events
              </Link>

            </div>

          </div>
        </div>
      </section>


      {/* ================= ACTIVITY CLUBS ================= */}
      <section className="bg-slate-50 px-5 py-20 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Explore
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Activity Clubs
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
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
              className="inline-flex rounded-xl bg-slate-900 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700"
            >
              View All Clubs →
            </Link>

          </div>

        </div>
      </section>


      {/* ================= EVENTS ================= */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Stay Updated
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Events & Activities
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Stay informed about upcoming SAC events, workshops,
                seminars, competitions, cultural programs and club
                activities happening at GEC Sheohar.
              </p>

              <Link
                href="/events"
                className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white transition hover:bg-blue-700"
              >
                Explore Events →
              </Link>

            </div>

            <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl">
                  📅
                </div>

                <div>
                  <p className="text-sm text-blue-300">
                    SAC Events
                  </p>

                  <h3 className="text-xl font-bold">
                    Something exciting is coming
                  </h3>
                </div>

              </div>

              <p className="mt-6 text-sm leading-6 text-slate-400">
                Upcoming event information will be published here as
                activities are scheduled.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-block text-sm font-bold text-blue-400 hover:text-blue-300"
              >
                View Events →
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ================= FEEDBACK / SUGGESTIONS ================= */}
      <section className="bg-slate-50 px-5 py-20 lg:px-8 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-950 to-slate-900 p-8 text-white shadow-2xl sm:p-12">

            <div className="grid items-center gap-10 lg:grid-cols-2">

              <div>

                <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                  Your Voice Matters
                </span>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  Suggestions & Complaints
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-300">
                  Have an idea to improve SAC activities? Facing an issue
                  or concern? Share your feedback with the Student Activity
                  Council.
                </p>

                <p className="mt-3 max-w-xl leading-7 text-slate-400">
                  Your feedback can help us improve clubs, events,
                  activities and the overall student experience.
                </p>

                <Link
                  href="/suggestions"
                  className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-bold text-blue-950 transition hover:bg-blue-50"
                >
                  Share Your Feedback →
                </Link>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl">
                    💡
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Give a Suggestion
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Share ideas for new events, clubs, activities or
                    campus improvements.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-2xl">
                    ⚠️
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    Report an Issue
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Report a concern or issue that needs attention from
                    the SAC.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= JOIN SAC ================= */}
      <section className="bg-blue-700 px-5 py-20 text-white lg:px-8 lg:py-24">

        <div className="mx-auto max-w-5xl text-center">

          <span className="text-sm font-bold uppercase tracking-widest text-blue-200">
            Get Involved
          </span>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Be a part of SAC
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Join a club, participate in activities, develop new skills
            and make your college experience more meaningful.
          </p>

          <Link
            href="/join"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 font-bold text-blue-800 transition hover:bg-blue-50"
          >
            Join Student Activity Council →
          </Link>

        </div>
      </section>


      {/* ================= SOCIAL MEDIA ================= */}
      <section className="border-t border-white/10 bg-slate-900 px-5 py-14 text-white">

        <div className="mx-auto max-w-6xl text-center">

          <span className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Connect With Us
          </span>

          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Follow GEC Sheohar
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Stay connected with Government Engineering College Sheohar
            through our official social media platforms.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <a
              href="https://www.facebook.com/share/P96conXp3siyw5HQ/?mibextid=qi2Omg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg"
            >
              <span className="text-xl">f</span>
              Facebook
            </a>

            <a
              href="https://www.linkedin.com/in/government-engineering-college-sheohar-8a27262a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg"
            >
              <span className="text-xl">in</span>
              LinkedIn
            </a>

            <a
              href="https://x.com/gecsheohar2023"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-black hover:shadow-lg"
            >
              <span className="text-xl">𝕏</span>
              X
            </a>

            <a
              href="https://www.instagram.com/gecsheohar2019?igsh=MTBxMmxnbThndjh6bQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-pink-600 hover:shadow-lg"
            >
              <span className="text-xl">◎</span>
              Instagram
            </a>

            <a
              href="https://youtube.com/@gec_sheohar?si=J7AQVQAJHttqIByy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-red-600 hover:shadow-lg"
            >
              <span className="text-xl">▶</span>
              YouTube
            </a>

          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-white">

        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

          <div className="grid gap-10 md:grid-cols-4">

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black text-blue-900">
                  GEC
                </div>

                <div>
                  <p className="font-bold">
                    GEC Sheohar
                  </p>

                  <p className="text-xs text-slate-400">
                    Student Activity Council
                  </p>
                </div>

              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
                Student Activity Council of Government Engineering
                College Sheohar — encouraging student participation,
                creativity, leadership and campus engagement.
              </p>

            </div>


            {/* QUICK LINKS */}
            <div>

              <h3 className="font-bold">
                Quick Links
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">

                <Link href="/" className="hover:text-white">
                  Home
                </Link>

                <Link href="/clubs" className="hover:text-white">
                  Clubs
                </Link>

                <Link href="/members" className="hover:text-white">
                  Members
                </Link>

                <Link href="/events" className="hover:text-white">
                  Events
                </Link>

              </div>

            </div>


            {/* STUDENT LINKS */}
            <div>

              <h3 className="font-bold">
                Student
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">

                <Link href="/gallery" className="hover:text-white">
                  Gallery
                </Link>

                <Link href="/join" className="hover:text-white">
                  Join SAC
                </Link>

                <Link
                  href="/suggestions"
                  className="hover:text-white"
                >
                  Suggestions & Complaints
                </Link>

              </div>

            </div>

          </div>


          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Government Engineering College
            Sheohar — Student Activity Council. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}


/* ================= ACTIVITY CARD ================= */

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
      className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-5 text-sm font-bold text-blue-600">
        Explore →
      </div>

    </Link>
  );
}