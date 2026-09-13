const navItems = [
  { name: "Home", href: "/" },
  { name: "About SAC", href: "/about" },
  { name: "Clubs", href: "/clubs" },
  { name: "Members", href: "/members" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-black text-blue-900 shadow-lg">
              GEC
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                GEC SHEOHAR
              </p>

              <p className="text-xs text-blue-300">
                Student Activity Council
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-200 transition hover:text-blue-300"
              >
                {item.name}
              </a>
            ))}

            <a
              href="/join"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Join SAC
            </a>
          </nav>

          {/* Mobile Button */}
          <button
            className="rounded-lg border border-white/20 px-3 py-2 text-white md:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden bg-slate-950"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.78) 48%, rgba(2,6,23,0.45) 100%), url('/sac-campus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80" />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-32">

          <div className="max-w-3xl">

            {/* Label */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 backdrop-blur-sm">

              <span className="h-2 w-2 rounded-full bg-blue-400" />

              Student Activity Council

            </div>


            {/* Heading */}
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">

              Empowering

              <span className="block text-blue-400">
                Student Potential.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">

              Welcome to the Student Activity Council of Government
              Engineering College Sheohar — a platform where students
              come together to learn, create, lead, collaborate and
              celebrate their talents beyond the classroom.

            </p>


            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <a
                href="/join"
                className="rounded-full bg-blue-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500"
              >
                Become a Member →
              </a>

              <a
                href="/events"
                className="rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-center font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Explore Events
              </a>

            </div>

          </div>

        </div>


        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-slate-400 sm:flex">

          <span>Scroll to explore</span>

          <span className="text-lg">
            ↓
          </span>

        </div>

      </section>


      {/* ================= ABOUT SAC ================= */}
      <section className="bg-white px-6 py-24">

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              About SAC
            </p>

            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">

              More than academics.

              <span className="block text-blue-600">
                A community of creators.
              </span>

            </h2>

          </div>


          <div>

            <p className="text-lg leading-8 text-slate-600">

              The Student Activity Council provides students with a
              platform to participate in extracurricular activities,
              workshops, seminars, competitions, cultural activities
              and student-led initiatives.

            </p>

            <a
              href="/about"
              className="mt-6 inline-flex font-semibold text-blue-600 transition hover:text-blue-800"
            >
              Discover SAC →
            </a>

          </div>

        </div>

      </section>


      {/* ================= ACTIVITIES ================= */}
      <section className="bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Get Involved
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Explore Student Activities
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">

              Find your interest, connect with other students and
              contribute to the college community.

            </p>

          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <ActivityCard
              icon="🎨"
              title="Creative"
              description="Arts, design, photography and creative expression."
            />

            <ActivityCard
              icon="💻"
              title="Technical"
              description="Technology, innovation, projects and workshops."
            />

            <ActivityCard
              icon="🎤"
              title="Cultural"
              description="Music, dance, drama and cultural activities."
            />

            <ActivityCard
              icon="🏆"
              title="Competitions"
              description="Challenges, contests, hackathons and competitions."
            />

          </div>

        </div>

      </section>


      {/* ================= EVENTS CTA ================= */}
      <section className="bg-blue-700 px-6 py-20">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

          <div>

            <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Stay Connected
            </p>

            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Discover what is happening at SAC.
            </h2>

            <p className="mt-3 max-w-2xl text-blue-100">

              Check upcoming workshops, seminars, competitions and
              student activities.

            </p>

          </div>


          <a
            href="/events"
            className="whitespace-nowrap rounded-full bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
          >
            View Events →
          </a>

        </div>

      </section>


      {/* ================= JOIN SAC ================= */}
      <section className="px-6 py-24">

        <div className="mx-auto max-w-4xl rounded-3xl bg-slate-950 px-8 py-14 text-center shadow-2xl sm:px-14">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
            Your Journey Starts Here
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">

            Have an idea?

            <br />

            Make it happen.

          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">

            Join the Student Activity Council and become a part of
            a community where students can turn their ideas into
            meaningful activities and experiences.

          </p>

          <a
            href="/join"
            className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-3.5 font-bold text-white transition hover:bg-blue-500"
          >
            Join Student Activity Council
          </a>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div>

            <p className="font-bold text-slate-900">
              GEC Sheohar
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Student Activity Council
            </p>

          </div>


          <div className="flex gap-5 text-sm text-slate-500">

            <a
              href="/about"
              className="hover:text-blue-600"
            >
              About
            </a>

            <a
              href="/events"
              className="hover:text-blue-600"
            >
              Events
            </a>

            <a
              href="/gallery"
              className="hover:text-blue-600"
            >
              Gallery
            </a>

            <a
              href="/join"
              className="hover:text-blue-600"
            >
              Join
            </a>

          </div>


          <p className="text-sm text-slate-400">
            © 2026 GEC Sheohar SAC
          </p>

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

    <a
      href="/clubs"
      className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >

      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
        Explore →
      </span>

    </a>
  );
}