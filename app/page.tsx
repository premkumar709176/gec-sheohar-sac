"use client";

import Link from "next/link";

const socialLinks = [
  {
    name: "YouTube",
    icon: "▶",
    url: "https://www.youtube.com/@SAC-GECSheohar",
    label: "SAC GEC Sheohar",
  },
  {
    name: "Facebook",
    icon: "f",
    url: "https://www.facebook.com/share/1BbqbSh9Qw/",
    label: "Student Activity Council GEC Sheohar",
  },
  {
    name: "Instagram",
    icon: "◎",
    url: "https://www.instagram.com/sacgecsheohar?stkn=ZjgwM2gwcmJxZXE1",
    label: "@sacgecsheohar",
  },
];

const clubs = [
  {
    icon: "🔬",
    title: "Science",
    description:
      "Explore scientific thinking, experiments, research and innovation.",
  },
  {
    icon: "⚙️",
    title: "Technical",
    description:
      "Build technical skills through projects, workshops and competitions.",
  },
  {
    icon: "🎨",
    title: "Creative",
    description:
      "Express yourself through art, design, media and literature.",
  },
  {
    icon: "🎭",
    title: "Cultural",
    description:
      "Celebrate talent through music, dance and cultural activities.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      {/* HERO */}
      <section className="relative overflow-hidden pt-[76px]">
        <div className="absolute inset-0 college-pattern opacity-70" />

        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#1746a2]/10 blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="section-container relative flex min-h-[650px] items-center py-20 lg:min-h-[700px]">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1746a2]/15 bg-white px-4 py-2 text-sm font-bold text-[#1746a2] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
              Student Activity Council
            </div>

            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1746a2]">
              Government Engineering College Sheohar
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              Empowering
              <br />
              <span className="gradient-text">Student Potential.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              The Student Activity Council (SAC) of Government Engineering
              College Sheohar is a student-driven platform dedicated to
              creating a vibrant, inclusive and engaging campus environment.
              SAC provides students with opportunities to discover their
              interests, showcase their talents, develop leadership and
              teamwork skills, and gain practical experience beyond academics.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/join" className="btn-orange">
                Become a Member →
              </Link>

              <Link href="/events" className="btn-primary">
                Explore Events
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              {[
                "Leadership",
                "Creativity",
                "Innovation",
                "Teamwork",
                "Campus Life",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLUBS */}
      <section className="section-container py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
              Explore
            </p>

            <h2 className="accent-line mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Activity Clubs
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-slate-600">
              Discover different clubs where students can learn, participate,
              create and lead.
            </p>
          </div>

          <Link
            href="/clubs"
            className="hidden font-bold text-[#1746a2] transition hover:text-[#f47b20] md:block"
          >
            View All Clubs →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clubs.map((club) => (
            <Link
              href="/clubs"
              key={club.title}
              className="college-card group p-7"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl transition group-hover:bg-[#1746a2] group-hover:scale-105">
                {club.icon}
              </div>

              <h3 className="mt-6 text-2xl font-black text-[#172033]">
                {club.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {club.description}
              </p>

              <div className="mt-6 font-bold text-[#1746a2] transition group-hover:text-[#f47b20]">
                Explore →
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/clubs"
          className="btn-primary mt-8 md:hidden"
        >
          View All Clubs →
        </Link>
      </section>

      {/* EVENTS */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="section-container grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
              Stay Updated
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Events & Activities
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              Stay informed about upcoming SAC events, workshops, seminars,
              competitions, cultural programs and club activities happening at
              GEC Sheohar.
            </p>

            <Link href="/events" className="btn-primary mt-8">
              Explore Events →
            </Link>
          </div>

          <div className="college-card overflow-hidden bg-[#172033] p-8 text-white sm:p-10">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1746a2] text-3xl">
                📅
              </div>

              <div>
                <p className="text-sm font-bold text-[#f47b20]">
                  SAC Events
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  Something exciting is coming
                </h3>
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-300">
              Upcoming event information will be published here as activities
              are scheduled.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-block font-bold text-white transition hover:text-[#f47b20]"
            >
              View Events →
            </Link>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="section-container py-20 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#1746a2]">
              Your Voice Matters
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Suggestions & Support
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              Have an idea to improve SAC activities? Facing an issue or
              concern? Share your feedback with the Student Activity Council.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Your feedback can help us improve clubs, events, activities and
              the overall student experience.
            </p>

            <Link href="/suggestions" className="btn-orange mt-8">
              Share Your Feedback →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="college-card p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
                💡
              </div>

              <h3 className="mt-6 text-xl font-black">
                Give a Suggestion
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Share ideas for new events, clubs, activities or campus
                improvements.
              </p>
            </div>

            <div className="college-card p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                ⚠️
              </div>

              <h3 className="mt-6 text-xl font-black">
                Report an Issue
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Report a concern or issue that needs attention from the SAC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="bg-[#1746a2] text-white">
        <div className="section-container py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-200">
              Connect With Us
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Student Activity Council Online
            </h2>

            <p className="mt-5 leading-7 text-blue-100">
              Follow Student Activity Council GEC Sheohar on social media for
              announcements, events, activities, achievements and campus
              updates.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-black text-[#1746a2]">
                    {social.icon}
                  </div>

                  <div>
                    <p className="font-black">{social.name}</p>
                    <p className="mt-1 text-xs text-blue-100">
                      {social.label}
                    </p>
                  </div>
                </div>

                <div className="mt-5 text-sm font-bold text-orange-200 transition group-hover:text-white">
                  Visit →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="section-container py-20 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="college-card p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
              📍
            </div>

            <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
              Location
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Find GEC Sheohar
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Visit Government Engineering College Sheohar. Open the location
              directly in Google Maps for directions.
            </p>

            <a
              href="https://maps.app.goo.gl/4iggGvkexJGPyvKt9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8"
            >
              Open Google Maps →
            </a>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=Government%20Engineering%20College%20Sheohar&output=embed"
              className="h-full min-h-[350px] w-full border-0"
              loading="lazy"
              title="Government Engineering College Sheohar location"
            />
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="section-container pb-20 sm:pb-24">
        <div className="relative overflow-hidden rounded-[28px] bg-[#172033] px-7 py-14 text-center text-white shadow-xl sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#1746a2]/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#f47b20]/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
              Get Involved
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Be a part of SAC
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Join a club, participate in activities, develop new skills and
              make your college experience more meaningful.
            </p>

            <Link href="/join" className="btn-orange mt-8">
              Join Student Activity Council →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="section-container py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="/sac-logo.jpg"
                  alt="Student Activity Council GEC Sheohar"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md"
                />

                <div>
                  <p className="font-black text-[#1746a2]">
                    Student Activity Council
                  </p>

                  <p className="text-sm font-semibold text-slate-500">
                    GEC Sheohar
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                Student Activity Council of Government Engineering College
                Sheohar — encouraging student participation, creativity,
                leadership and campus engagement.
              </p>
            </div>

            <div>
              <h3 className="font-black text-[#172033]">
                Quick Links
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-slate-500">
                <Link href="/" className="transition hover:text-[#1746a2]">
                  Home
                </Link>

                <Link
                  href="/clubs"
                  className="transition hover:text-[#1746a2]"
                >
                  Clubs
                </Link>

                <Link
                  href="/members"
                  className="transition hover:text-[#1746a2]"
                >
                  Members
                </Link>

                <Link
                  href="/events"
                  className="transition hover:text-[#1746a2]"
                >
                  Events
                </Link>

                <Link
                  href="/gallery"
                  className="transition hover:text-[#1746a2]"
                >
                  Gallery
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-black text-[#172033]">
                Student
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm font-semibold text-slate-500">
                <Link
                  href="/join"
                  className="transition hover:text-[#1746a2]"
                >
                  Join SAC
                </Link>

                <Link
                  href="/suggestions"
                  className="transition hover:text-[#1746a2]"
                >
                  Suggestions & Support
                </Link>

                <a
                  href="https://www.youtube.com/@SAC-GECSheohar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#1746a2]"
                >
                  YouTube
                </a>

                <a
                  href="https://www.instagram.com/sacgecsheohar?stkn=ZjgwM2gwcmJxZXE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#1746a2]"
                >
                  Instagram
                </a>

                <a
                  href="https://www.facebook.com/share/1BbqbSh9Qw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#1746a2]"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            © 2026 Government Engineering College Sheohar · Student Activity
            Council
          </div>
        </div>
      </footer>
    </main>
  );
}