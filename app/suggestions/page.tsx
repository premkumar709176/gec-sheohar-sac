"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SuggestionsPage() {
  const [type, setType] = useState<"suggestion" | "complaint">("suggestion");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      type === "suggestion"
        ? "Thank you! Your suggestion has been recorded in the form interface. Database connection will be added later."
        : "Thank you! Your complaint has been submitted through the form interface. Database connection will be added later."
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* SPACE FOR GLOBAL NAVBAR */}
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center lg:px-8 lg:py-28">
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Student Voice & Feedback
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Suggestions & Complaints
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Your feedback helps the Student Activity Council improve
            student activities, clubs, events and the overall campus
            experience.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">

          {/* INTRO CARD */}
          <div className="mb-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                💬
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  We want to hear from you
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You can submit a suggestion for improvement or report
                  an issue through a complaint. Providing your contact
                  details is optional, but it may help SAC follow up with
                  you when necessary.
                </p>
              </div>

            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10"
          >

            {/* TYPE SELECTOR */}
            <div>
              <label className="mb-4 block text-sm font-bold text-slate-900">
                What would you like to submit?
              </label>

              <div className="grid gap-4 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() => setType("suggestion")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    type === "suggestion"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                        type === "suggestion"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      💡
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Suggestion
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Share an idea or improvement
                      </p>
                    </div>

                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType("complaint")}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    type === "complaint"
                      ? "border-red-500 bg-red-50"
                      : "border-slate-200 bg-white hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                        type === "complaint"
                          ? "bg-red-500 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      ⚠️
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Complaint
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
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
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Category <span className="text-red-500">*</span>
              </label>

              <select
                id="category"
                name="category"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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

            {/* PERSONAL DETAILS */}
            <div className="mt-10">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900">
                  Your Details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  These fields are optional.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roll"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Registration / Roll Number
                  </label>

                  <input
                    id="roll"
                    name="roll"
                    type="text"
                    placeholder="e.g. 24101145001"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>
            </div>

            {/* MESSAGE */}
            <div className="mt-10">
              <h3 className="mb-5 text-xl font-bold text-slate-900">
                {type === "suggestion"
                  ? "Suggestion Details"
                  : "Complaint Details"}
              </h3>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Subject <span className="text-red-500">*</span>
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder={
                    type === "suggestion"
                      ? "Briefly describe your suggestion"
                      : "Briefly describe your complaint"
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Detailed Message <span className="text-red-500">*</span>
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
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* ATTACHMENT */}
            <div className="mt-10">
              <label
                htmlFor="attachment"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Supporting Attachment
              </label>

              <input
                id="attachment"
                name="attachment"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional. You may attach an image or document that helps
                explain your submission.
              </p>
            </div>

            {/* DECLARATION */}
            <div className="mt-10 rounded-2xl bg-slate-50 p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm leading-6 text-slate-600">
                  I confirm that the information provided by me is
                  accurate to the best of my knowledge. I understand that
                  the SAC may review this submission and take appropriate
                  action where necessary.
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs leading-5 text-slate-500">
                Your submission will be connected to the SAC database
                when the backend is configured.
              </p>

              <button
                type="submit"
                className={`rounded-xl px-7 py-3.5 font-bold text-white shadow-lg transition ${
                  type === "suggestion"
                    ? "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
                    : "bg-red-600 shadow-red-600/20 hover:bg-red-700"
                }`}
              >
                Submit{" "}
                {type === "suggestion"
                  ? "Suggestion"
                  : "Complaint"}
              </button>

            </div>

          </form>

          {/* PRIVACY NOTE */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-sm text-slate-500">
              🔒 Please avoid including passwords, payment information,
              or other highly sensitive information in your submission.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <h3 className="text-lg font-bold">
                GEC Sheohar SAC
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Student Activity Council of Government Engineering
                College Sheohar — encouraging student participation,
                creativity, leadership and campus engagement.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Quick Links</h3>

              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
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

                <Link href="/gallery" className="hover:text-white">
                  Gallery
                </Link>

                <Link href="/join" className="hover:text-white">
                  Join SAC
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Student Voice</h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Have an idea, concern or issue? Use this page to
                communicate with the Student Activity Council.
              </p>

              <Link
                href="/suggestions"
                className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                Suggestions & Complaints
              </Link>
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