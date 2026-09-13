"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type FormData = {
  type: "Suggestion" | "Complaint";
  category: string;
  name: string;
  registration_number: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  declaration: boolean;
};

const categories = [
  "Academic",
  "Faculty",
  "Infrastructure",
  "Hostel",
  "Library",
  "Laboratory",
  "Canteen",
  "Sports",
  "Clubs & Activities",
  "Events",
  "Administration",
  "Other",
];

export default function SuggestionsPage() {
  const [form, setForm] = useState<FormData>({
    type: "Suggestion",
    category: "",
    name: "",
    registration_number: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    declaration: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!form.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    if (!form.declaration) {
      setError("Please accept the declaration.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("suggestions")
        .insert([
          {
            name: form.name.trim() || null,
            registration_number:
              form.registration_number.trim() || null,
            email: form.email.trim() || null,
            phone: form.phone.trim() || null,

            // Stores whether this is a suggestion or complaint
            category: `${form.type} - ${form.category}`,

            subject: form.subject.trim(),
            message: form.message.trim(),

            attachment_url: null,

            status: "pending",
          },
        ]);

      if (insertError) {
        console.error(insertError);
        throw new Error(insertError.message);
      }

      setSuccess(
        `Your ${form.type.toLowerCase()} has been submitted successfully.`
      );

      setForm({
        type: "Suggestion",
        category: "",
        name: "",
        registration_number: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        declaration: false,
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-slate-950">
              GEC
            </div>

            <div>
              <div className="font-bold">
                GEC Sheohar
              </div>
              <div className="text-xs text-slate-400">
                Student Activity Council
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/" className="hover:text-blue-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-300">
              About SAC
            </Link>
            <Link href="/clubs" className="hover:text-blue-300">
              Clubs
            </Link>
            <Link href="/members" className="hover:text-blue-300">
              Members
            </Link>
            <Link href="/events" className="hover:text-blue-300">
              Events
            </Link>
            <Link href="/gallery" className="hover:text-blue-300">
              Gallery
            </Link>
            <Link href="/join" className="hover:text-blue-300">
              Join SAC
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
            Student Voice
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Suggestions & Complaints
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Your feedback helps the Student Activity Council improve
            student activities, facilities and campus life.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200 md:p-10">

            {/* TYPE SWITCH */}
            <div className="mb-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  updateField("type", "Suggestion")
                }
                className={`rounded-xl px-5 py-4 font-semibold transition ${
                  form.type === "Suggestion"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                💡 Suggestion
              </button>

              <button
                type="button"
                onClick={() =>
                  updateField("type", "Complaint")
                }
                className={`rounded-xl px-5 py-4 font-semibold transition ${
                  form.type === "Complaint"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                ⚠️ Complaint
              </button>
            </div>

            {/* SUCCESS */}
            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                <div className="font-semibold">
                  Submission successful
                </div>
                <div className="mt-1 text-sm">
                  {success}
                </div>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="font-semibold">
                  Submission failed
                </div>
                <div className="mt-1 text-sm break-words">
                  {error}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category *
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField("category", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* PERSONAL DETAILS */}
              <div>
                <h2 className="mb-4 text-xl font-bold">
                  Your Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Name
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Registration Number
                    </label>

                    <input
                      type="text"
                      value={form.registration_number}
                      onChange={(e) =>
                        updateField(
                          "registration_number",
                          e.target.value
                        )
                      }
                      placeholder="Your registration number"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateField("phone", e.target.value)
                      }
                      placeholder="Your phone number"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <h2 className="mb-4 text-xl font-bold">
                  {form.type} Details
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Subject *
                    </label>

                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        updateField("subject", e.target.value)
                      }
                      placeholder={`Subject of your ${form.type.toLowerCase()}`}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Detailed Message *
                    </label>

                    <textarea
                      rows={7}
                      value={form.message}
                      onChange={(e) =>
                        updateField("message", e.target.value)
                      }
                      placeholder={`Write your ${form.type.toLowerCase()} in detail...`}
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* DECLARATION */}
              <label className="flex cursor-pointer gap-3 rounded-xl bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={(e) =>
                    updateField(
                      "declaration",
                      e.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5"
                />

                <span className="text-sm leading-6 text-slate-600">
                  I confirm that the information provided by me
                  is genuine and accurate to the best of my
                  knowledge.
                </span>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl px-6 py-4 text-lg font-bold text-white transition ${
                  form.type === "Complaint"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                {loading
                  ? "Submitting..."
                  : `Submit ${form.type}`}
              </button>
            </form>

            {/* PRIVACY */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <strong className="text-slate-900">
                Privacy:
              </strong>{" "}
              Your submission will be securely stored and
              accessible only to authorized SAC administrators
              for review and appropriate action.
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <div className="font-bold">
            Government Engineering College Sheohar
          </div>

          <div className="mt-2 text-sm text-slate-400">
            Student Activity Council
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>

            <Link href="/join" className="hover:text-white">
              Join SAC
            </Link>

            <Link href="/suggestions" className="hover:text-white">
              Feedback
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} GEC Sheohar SAC
          </div>
        </div>
      </footer>
    </main>
  );
}