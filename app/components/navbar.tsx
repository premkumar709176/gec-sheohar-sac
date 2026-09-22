"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Clubs", href: "/clubs" },
    { name: "Members", href: "/members" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "E-Certificates", href: "/certificates" },
    { name: "Feedback", href: "/suggestions" },
  ];

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-[#f8f6f0]/95 text-[#172033] shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#f47b20]/20 blur-md transition group-hover:bg-[#1746a2]/20" />

              <img
                src="/sac-logo.jpg"
                alt="Student Activity Council GEC Sheohar"
                className="relative h-12 w-12 rounded-full border-2 border-white object-cover shadow-md"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-extrabold leading-tight text-[#1746a2]">
                Student Activity Council
              </p>

              <p className="text-xs font-semibold tracking-wide text-slate-500">
                GEC Sheohar
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  link.name === "E-Certificates"
                    ? "text-[#f47b20] hover:bg-[#fff1e6] hover:text-[#d96512]"
                    : "text-slate-700 hover:bg-[#eaf1ff] hover:text-[#1746a2]"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/join"
              className="ml-3 rounded-full bg-[#f47b20] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#d96512] hover:shadow-lg"
            >
              Join SAC
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1746a2] shadow-sm transition hover:bg-[#eaf1ff] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h-16" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 bg-[#f8f6f0] px-5 py-4 shadow-lg lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 font-semibold transition ${
                    link.name === "E-Certificates"
                      ? "bg-[#fff1e6] text-[#f47b20]"
                      : "text-slate-700 hover:bg-[#eaf1ff] hover:text-[#1746a2]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-[#f47b20] px-4 py-3 text-center font-bold text-white transition hover:bg-[#d96512]"
              >
                Join SAC
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}