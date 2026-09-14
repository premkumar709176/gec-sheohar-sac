"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eaf1ff] via-[#f8f6f0] to-[#fff1e6]" />

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1746a2]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="college-pattern absolute inset-0 opacity-60" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8">
          {/* LEFT */}
          <div className="fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1746a2]/15 bg-white/80 px-4 py-2 text-sm font-bold text-[#1746a2] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
              GEC SHEOHAR • STUDENT ACTIVITY COUNCIL
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Learn.
              <br />
              <span className="gradient-text">Create.</span>
              <br />
              <span className="text-[#172033]">Lead.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              The Student Activity Council of Government Engineering College
              Sheohar brings students together through technology, creativity,
              culture, leadership and meaningful activities.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/clubs" className="btn-primary">
                Explore Clubs
                <span>→</span>
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1746a2]/20 bg-white px-6 py-3 font-bold text-[#1746a2] shadow-sm transition hover:-translate-y-0.5 hover:border-[#1746a2]/40 hover:bg-[#eaf1ff]"
              >
                Explore Events
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-200 pt-7">
              <div>
                <p className="text-2xl font-black text-[#1746a2]">14+</p>
                <p className="text-sm font-medium text-slate-500">
                  Activity Clubs
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-[#f47b20]">∞</p>
                <p className="text-sm font-medium text-slate-500">
                  Ideas & Activities
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-[#1746a2]">1</p>
                <p className="text-sm font-medium text-slate-500">
                  Student Community
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="fade-in relative">
            <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-[#1746a2]/15 to-[#f47b20]/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-[30px] border-8 border-white bg-white shadow-2xl">
              <img
                src="/sac-campus.jpg"
                alt="Government Engineering College Sheohar"
                className="h-[430px] w-full object-cover lg:h-[540px]"
              />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f47b20]">
                  Student Activity Council
                </p>
                <p className="mt-1 text-lg font-black text-[#1746a2]">
                  Government Engineering College Sheohar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITY CLUBS */}
      <section className="college-pattern border-y border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
              Discover
            </p>

            <h2 className="accent-line mt-2 text-4xl font-black tracking-tight text-[#1746a2] sm:text-5xl">
              Activity Clubs
            </h2>

            <p className="mt-7 text-lg leading-8 text-slate-600">
              From science and technology to music, dance, art, photography
              and social initiatives, there is a space for every interest.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ActivityCard
              icon="⚙️"
              title="Technology"
              text="Build, experiment and innovate with technical activities."
            />

            <ActivityCard
              icon="🎨"
              title="Creativity"
              text="Express ideas through art, design, photography and media."
            />

            <ActivityCard
              icon="🎭"
              title="Culture"
              text="Celebrate music, dance, literature and student talent."
            />

            <ActivityCard
              icon="🌱"
              title="Social Impact"
              text="Take part in awareness, sustainability and community initiatives."
            />
          </div>

          <div className="mt-10">
            <Link href="/clubs" className="btn-primary">
              View All Clubs →
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-[#f8f6f0] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
                What's happening
              </p>

              <h2 className="accent-line mt-2 text-4xl font-black tracking-tight text-[#1746a2] sm:text-5xl">
                Events & Activities
              </h2>

              <p className="mt-7 text-lg leading-8 text-slate-600">
                Workshops, competitions, seminars, awareness drives and
                cultural activities that keep campus life active and engaging.
              </p>

              <Link href="/events" className="btn-orange mt-8">
                See Events →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <EventCard
                number="01"
                title="Workshops"
                text="Learn practical skills beyond the classroom."
              />

              <EventCard
                number="02"
                title="Competitions"
                text="Challenge yourself, compete and showcase your talent."
              />

              <EventCard
                number="03"
                title="Seminars"
                text="Connect with ideas, knowledge and new perspectives."
              />

              <EventCard
                number="04"
                title="Campus Activities"
                text="Participate, collaborate and make college life memorable."
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="bg-[#1746a2] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/10 p-8 backdrop-blur sm:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f47b20]/20 blur-3xl" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-300">
                Your Voice Matters
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Have an idea?
                <br />
                Make it happen.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
                Share your suggestions, ideas and feedback to help make
                student activities at GEC Sheohar even better.
              </p>

              <Link
                href="/suggestions"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f47b20] px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#d96512]"
              >
                Share Feedback →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
            Stay Connected
          </p>

          <h2 className="mt-2 text-4xl font-black text-[#1746a2]">
            Follow SAC
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Stay updated with events, activities, achievements and campus
            moments.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <SocialLink
              name="Instagram"
              href="https://www.instagram.com/gecsheohar2019?igsh=MTBxMmxnbThndjh6bQ=="
            />

            <SocialLink
              name="Facebook"
              href="https://www.facebook.com/share/P96conXp3siyw5HQ/?mibextid=qi2Omg"
            />

            <SocialLink
              name="LinkedIn"
              href="https://www.linkedin.com/in/government-engineering-college-sheohar-8a27262a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            />

            <SocialLink
              name="X"
              href="https://x.com/gecsheohar2023"
            />

            <SocialLink
              name="YouTube"
              href="https://youtube.com/@gec_sheohar?si=J7AQVQAJHttqIByy"
            />
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-[#f8f6f0] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#f47b20]">
                Visit Us
              </p>

              <h2 className="mt-2 text-4xl font-black text-[#1746a2]">
                Government Engineering College Sheohar
              </h2>

              <p className="mt-6 leading-7 text-slate-600">
                Student Activity Council
                <br />
                Government Engineering College, Sheohar
                <br />
                Bihar, India
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Government+Engineering+College+Sheohar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-7"
              >
                Open in Google Maps →
              </a>
            </div>

            <div className="min-h-[350px] bg-slate-100">
              <iframe
                title="Government Engineering College Sheohar Location"
                src="https://www.google.com/maps?q=Government+Engineering+College+Sheohar&output=embed"
                className="h-full min-h-[350px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 text-center sm:flex-row sm:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/sac-logo.jpg"
              alt="SAC Logo"
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />

            <div>
              <p className="font-black text-[#1746a2]">
                Student Activity Council
              </p>
              <p className="text-sm font-medium text-slate-500">
                GEC Sheohar
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Student Activity Council, GEC Sheohar
          </p>
        </div>
      </footer>
    </main>
  );
}

function ActivityCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="college-card group p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black text-[#1746a2]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>

      <div className="mt-5 h-1 w-8 rounded-full bg-[#f47b20] transition-all group-hover:w-14" />
    </div>
  );
}

function EventCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="college-card group p-6">
      <p className="text-sm font-black text-[#f47b20]">{number}</p>

      <h3 className="mt-3 text-xl font-black text-[#1746a2]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>

      <div className="mt-5 text-2xl font-light text-[#1746a2] transition group-hover:translate-x-2">
        →
      </div>
    </div>
  );
}

function SocialLink({
  name,
  href,
}: {
  name: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-slate-200 bg-[#f8f6f0] px-5 py-3 text-sm font-bold text-[#1746a2] transition hover:-translate-y-1 hover:border-[#1746a2]/30 hover:bg-[#eaf1ff] hover:shadow-md"
    >
      {name}
    </a>
  );
}