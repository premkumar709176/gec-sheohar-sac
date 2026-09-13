"use client";

import Link from "next/link";

export default function Navbar() {
  return (
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

          <Link href="/" className="transition hover:text-blue-300">
            Home
          </Link>

          <Link href="/clubs" className="transition hover:text-blue-300">
            Clubs
          </Link>

          <Link href="/members" className="transition hover:text-blue-300">
            Members
          </Link>

          <Link href="/events" className="transition hover:text-blue-300">
            Events
          </Link>

          <Link href="/gallery" className="transition hover:text-blue-300">
            Gallery
          </Link>

          <Link href="/suggestions" className="transition hover:text-blue-300">
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
  );
}