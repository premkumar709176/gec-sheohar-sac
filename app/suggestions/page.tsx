"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SuggestionsPage() {
  const [type, setType] = useState<"suggestion" | "ticket">("suggestion");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      type === "suggestion"
        ? "Thank you! Your suggestion has been submitted successfully."
        : "Your ticket has been raised successfully. The SAC team will review it."
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="college-pattern relative overflow-hidden border-b border-[#e4e7ec] bg-[#f8f6f0]">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1746a2]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5 py-16 text-center lg:px-8 lg:py-20">
          <span className="inline-flex rounded-full border border-[#1746a2]/20 bg-[#eaf1ff] px-4 py-2 text-sm font-bold text-[#1746a2]">
            Student Voice & Support
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
            Suggestions & <span className="text-[#f47b20]">Support</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg">
            Share your ideas with the Student Activity Council or raise a
            ticket about an issue that needs attention.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* INTRO */}
          <div className="college-card mb-8 p-6 sm:p-8">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf1ff] text-xl">
                💬
              </div>

              <div>
                <h2 className="text-xl font-black text-[#172033]">
                  We want to hear from you
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Submit a suggestion to help improve student life, or raise a
                  ticket if you have an issue or concern that requires
                  attention.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="college-card p-6 sm:p-10"
          >
            {/* TYPE */}
            <div>
              <label className="mb-4 block text-sm font-bold text-[#172033]">
                What would you like to submit?
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setType("suggestion")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    type === "suggestion"
                      ? "border-[#1746a2] bg-[#eaf1ff]"
                      : "border-[#e4e7ec] bg-white hover:border-[#1746a2]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                        type === "suggestion"
                          ? "bg-[#1746a2] text-white"
                          : "bg-[#f1f3f6]"
                      }`}
                    >
                      💡
                    </div>

                    <div>
                      <p className="font-bold text-[#172033]">Suggestion</p>
                      <p className="mt-1 text-xs text-[#667085]">
                        Share an idea or improvement
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType("ticket")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    type === "ticket"
                      ? "border-[#f47b20] bg-[#fff1e6]"
                      : "border-[#e4e7ec] bg-white hover:border-[#f47b20]/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                        type === "ticket"
                          ? "bg-[#f47b20] text-white"
                          : "bg-[#f1f3f6]"
                      }`}
                    >
                      🎫
                    </div>

                    <div>
                      <p className="font-bold text-[#172033]">
                        Raise a Ticket
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        Report an issue or concern
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="mt-8">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-[#172033]"
              >
                Category <span className="text-[#f47b20]">*</span>
              </label>

              <select
                id="category"
                name="category"
                required
                className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm text-[#172033] outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
              >
                <option value="">Select a category</option>
                <option>Academic & Student Activities</option>
                <option>SAC Clubs</option>
                <option>Events & Workshops</option>
                <option>Infrastructure & Facilities</option>
                <option>Campus Environment</option>
                <option>Student Welfare</option>
                <option>Communication & Information</option>
                <option>Discipline & Conduct</option>
                <option>Other</option>
              </select>
            </div>

            {/* DETAILS */}
            <div className="mt-10">
              <div className="mb-5">
                <h3 className="text-xl font-black text-[#172033]">
                  Your Details
                </h3>

                <p className="mt-1 text-sm text-[#667085]">
                  These fields are optional.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#172033]"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roll"
                    className="mb-2 block text-sm font-semibold text-[#172033]"
                  >
                    Registration / Roll Number
                  </label>

                  <input
                    id="roll"
                    name="roll"
                    type="text"
                    placeholder="e.g. 24101145001"
                    className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#172033]"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[#172033]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mt-10">
              <h3 className="mb-5 text-xl font-black text-[#172033]">
                {type === "suggestion"
                  ? "Suggestion Details"
                  : "Ticket Details"}
              </h3>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-[#172033]"
                >
                  Subject <span className="text-[#f47b20]">*</span>
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder={
                    type === "suggestion"
                      ? "Briefly describe your suggestion"
                      : "Briefly describe the issue"
                  }
                  className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-[#172033]"
                >
                  Detailed Message{" "}
                  <span className="text-[#f47b20]">*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder={
                    type === "suggestion"
                      ? "Explain your idea or suggestion in detail..."
                      : "Describe the issue or concern in detail..."
                  }
                  className="w-full resize-none rounded-xl border border-[#e4e7ec] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#eaf1ff]"
                />
              </div>
            </div>

            {/* ATTACHMENT */}
            <div className="mt-10">
              <label
                htmlFor="attachment"
                className="mb-2 block text-sm font-semibold text-[#172033]"
              >
                Supporting Attachment
              </label>

              <input
                id="attachment"
                name="attachment"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="block w-full cursor-pointer rounded-xl border border-dashed border-[#e4e7ec] bg-[#f8f6f0] px-4 py-4 text-sm text-[#667085] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1746a2] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#103575]"
              />

              <p className="mt-2 text-xs text-[#667085]">
                Optional. Attach an image or document that helps explain your
                submission.
              </p>
            </div>

            {/* DECLARATION */}
            <div className="mt-10 rounded-2xl bg-[#f8f6f0] p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-[#e4e7ec] text-[#1746a2] focus:ring-[#1746a2]"
                />

                <span className="text-sm leading-6 text-[#667085]">
                  I confirm that the information provided by me is accurate to
                  the best of my knowledge. I understand that the SAC may
                  review this submission and take appropriate action where
                  necessary.
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[#667085]">
                Your submission will be reviewed by the Student Activity
                Council.
              </p>

              <button
                type="submit"
                className={`rounded-xl px-7 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 ${
                  type === "suggestion"
                    ? "bg-[#1746a2] shadow-[#1746a2]/20 hover:bg-[#103575]"
                    : "bg-[#f47b20] shadow-[#f47b20]/20 hover:bg-[#d96512]"
                }`}
              >
                {type === "suggestion"
                  ? "Submit Suggestion"
                  : "Raise Ticket"}
              </button>
            </div>
          </form>

          {/* PRIVACY */}
          <div className="mt-6 rounded-2xl border border-[#e4e7ec] bg-white p-5 text-center">
            <p className="text-sm text-[#667085]">
              🔒 Please avoid including passwords, payment information, or
              other highly sensitive information.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-black text-[#1746a2]">
                GEC Sheohar SAC
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#667085]">
                Student Activity Council of Government Engineering College
                Sheohar — encouraging student participation, creativity,
                leadership and campus engagement.
              </p>
            </div>

            <div>
              <h3 className="font-black text-[#172033]">Quick Links</h3>

              <div className="mt-4 flex flex-col gap-3 text-sm">
                <Link
                  href="/"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Home
                </Link>

                <Link
                  href="/clubs"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Clubs
                </Link>

                <Link
                  href="/members"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Members
                </Link>

                <Link
                  href="/events"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Events
                </Link>

                <Link
                  href="/gallery"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Gallery
                </Link>

                <Link
                  href="/join"
                  className="text-[#667085] transition hover:text-[#1746a2]"
                >
                  Join SAC
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-black text-[#172033]">Student Voice</h3>

              <p className="mt-4 text-sm leading-6 text-[#667085]">
                Have an idea, concern or issue? Share your feedback or raise a
                ticket with the Student Activity Council.
              </p>

              <Link
                href="/suggestions"
                className="mt-5 inline-flex rounded-full bg-[#f47b20] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d96512]"
              >
                Suggestions & Support
              </Link>
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