"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function JoinSACPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    registration_number: "",
    branch: "",
    year_semester: "",
    college_email: "",
    phone: "",
    preferred_club: "",
    position_interested: "",
    skills: "",
    motivation: "",
    previous_experience: "",
    availability: "",
    profile_photo_url: "",
    declaration: false,
  });

  const updateField = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.registration_number.trim()) {
      setError("Please enter your registration number.");
      return;
    }

    if (!form.branch.trim()) {
      setError("Please select your branch.");
      return;
    }

    if (!form.year_semester.trim()) {
      setError("Please select your year/semester.");
      return;
    }

    if (!form.college_email.trim()) {
      setError("Please enter your college email.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.preferred_club.trim()) {
      setError("Please select your preferred club.");
      return;
    }

    if (!form.position_interested.trim()) {
      setError("Please select the position you are interested in.");
      return;
    }

    if (!form.motivation.trim()) {
      setError("Please tell us why you want to join SAC.");
      return;
    }

    if (!form.declaration) {
      setError("Please accept the declaration before submitting.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("registrations")
        .insert([
          {
            full_name: form.full_name.trim(),
            registration_number: form.registration_number.trim(),
            branch: form.branch.trim(),
            year_semester: form.year_semester.trim(),
            college_email: form.college_email.trim(),
            phone: form.phone.trim(),
            preferred_club: form.preferred_club.trim(),
            position_interested: form.position_interested.trim(),
            skills: form.skills.trim() || null,
            motivation: form.motivation.trim(),
            previous_experience:
              form.previous_experience.trim() || null,
            availability: form.availability.trim() || null,
            profile_photo_url:
              form.profile_photo_url.trim() || null,
            declaration: form.declaration,
            status: "pending",
          },
        ]);

      if (insertError) {
        console.error("Registration error:", insertError);
        throw insertError;
      }

      setSuccess(
        "Your SAC registration has been submitted successfully. The SAC team will review your application."
      );

      setForm({
        full_name: "",
        registration_number: "",
        branch: "",
        year_semester: "",
        college_email: "",
        phone: "",
        preferred_club: "",
        position_interested: "",
        skills: "",
        motivation: "",
        previous_experience: "",
        availability: "",
        profile_photo_url: "",
        declaration: false,
      });
    } catch (err: any) {
      console.error(err);

      setError(
        err?.message ||
          "Registration failed. Please try again or contact the SAC team."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="h-[76px]" />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.18),_transparent_40%)]" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center lg:px-8 lg:py-28">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
            Student Activity Council
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Join SAC
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Become a part of the Student Activity Council and contribute your
            skills, ideas, creativity and leadership to campus life.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Registration
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              SAC Membership Application
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Fill in your details carefully. Your application will be
              reviewed by the SAC team.
            </p>
          </div>

          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                  ✓
                </div>

                <div>
                  <p className="font-bold">Registration Successful</p>
                  <p className="mt-1 text-sm leading-6">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                  !
                </div>

                <div>
                  <p className="font-bold">Registration Failed</p>
                  <p className="mt-1 text-sm leading-6">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="border-b border-slate-200 p-6 sm:p-8">
              <SectionTitle
                number="01"
                title="Personal Information"
                description="Enter your basic academic and contact details."
              />

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  required
                  value={form.full_name}
                  onChange={(value) => updateField("full_name", value)}
                  placeholder="Enter your full name"
                />

                <Input
                  label="Registration Number"
                  required
                  value={form.registration_number}
                  onChange={(value) =>
                    updateField("registration_number", value)
                  }
                  placeholder="e.g. 24101145034"
                />

                <Select
                  label="Branch"
                  required
                  value={form.branch}
                  onChange={(value) => updateField("branch", value)}
                  options={[
                    "Computer Science & Engineering",
                    "Civil Engineering",
                    "Electrical Engineering",
                    "Mechanical Engineering",
                    "Electronics & Communication Engineering",
                    "Other",
                  ]}
                />

                <Select
                  label="Year / Semester"
                  required
                  value={form.year_semester}
                  onChange={(value) =>
                    updateField("year_semester", value)
                  }
                  options={[
                    "1st Year / 1st Semester",
                    "1st Year / 2nd Semester",
                    "2nd Year / 3rd Semester",
                    "2nd Year / 4th Semester",
                    "3rd Year / 5th Semester",
                    "3rd Year / 6th Semester",
                    "4th Year / 7th Semester",
                    "4th Year / 8th Semester",
                  ]}
                />

                <Input
                  label="College Email"
                  required
                  type="email"
                  value={form.college_email}
                  onChange={(value) =>
                    updateField("college_email", value)
                  }
                  placeholder="yourname@college.edu"
                />

                <Input
                  label="Phone Number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="border-b border-slate-200 p-6 sm:p-8">
              <SectionTitle
                number="02"
                title="SAC Preference"
                description="Tell us where you would like to contribute."
              />

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Select
                  label="Preferred Club"
                  required
                  value={form.preferred_club}
                  onChange={(value) =>
                    updateField("preferred_club", value)
                  }
                  options={[
                    "Bhabha - Science Club",
                    "Vishveshvaraya - Technical Club",
                    "Media Club",
                    "Eco Task Force",
                    "Literary & Poetry Club",
                    "Social Work & Heritage Club",
                    "Red Ribbon Club",
                    "Electoral Literacy Club",
                    "Natraj - Dance Club",
                    "Sur Sangam - Music Club",
                    "Art & Craft Club",
                    "Yoga & Mental Wellness Club",
                    "Pixel & Frame - Photography & Videography Club",
                    "DigiCrafters - Digital Art & Craft Club",
                    "SAC Core Team",
                    "Any Club",
                  ]}
                />

                <Select
                  label="Position Interested In"
                  required
                  value={form.position_interested}
                  onChange={(value) =>
                    updateField("position_interested", value)
                  }
                  options={[
                    "Club Member",
                    "Volunteer",
                  ]}
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Skills"
                    value={form.skills}
                    onChange={(value) => updateField("skills", value)}
                    placeholder="e.g. Web development, photography, public speaking, video editing, event management..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 p-6 sm:p-8">
              <SectionTitle
                number="03"
                title="Your Contribution"
                description="Help us understand your interest and experience."
              />

              <div className="mt-8 space-y-6">
                <TextArea
                  label="Why do you want to join SAC?"
                  required
                  value={form.motivation}
                  onChange={(value) =>
                    updateField("motivation", value)
                  }
                  placeholder="Tell us what motivates you to become a part of SAC..."
                  rows={5}
                />

                <TextArea
                  label="Previous Experience"
                  value={form.previous_experience}
                  onChange={(value) =>
                    updateField("previous_experience", value)
                  }
                  placeholder="Mention any previous club, event, competition, volunteering or leadership experience..."
                  rows={4}
                />

                <TextArea
                  label="Availability"
                  value={form.availability}
                  onChange={(value) =>
                    updateField("availability", value)
                  }
                  placeholder="Tell us when you are generally available for SAC activities..."
                  rows={3}
                />

                <Input
                  label="Profile Photo URL"
                  value={form.profile_photo_url}
                  onChange={(value) =>
                    updateField("profile_photo_url", value)
                  }
                  placeholder="Optional — paste a public photo URL"
                />

                <p className="text-xs leading-5 text-slate-500">
                  Profile photo is optional. You can leave this field empty
                  and provide your photo later if requested by the SAC team.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <SectionTitle
                number="04"
                title="Declaration"
                description="Please confirm the information you have provided."
              />

              <label className="mt-8 flex cursor-pointer gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50/40">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={(e) =>
                    updateField("declaration", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
                />

                <span className="text-sm leading-6 text-slate-700">
                  I declare that the information provided by me is true and
                  correct to the best of my knowledge. I understand that
                  submission of this form does not guarantee selection into
                  SAC or any particular club/position.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting Application...
                  </span>
                ) : (
                  "Submit SAC Application"
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Your information will be stored securely and used only for
                SAC membership and administrative purposes.
              </p>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-slate-950 px-5 py-12 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-950">
                  GEC
                </div>

                <div>
                  <p className="font-bold">GEC Sheohar</p>
                  <p className="text-xs text-slate-400">
                    Student Activity Council
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Empowering students through creativity, leadership,
                collaboration and meaningful campus activities.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Quick Links</h3>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400">
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
                <Link href="/suggestions" className="hover:text-white">
                  Feedback
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Get Involved</h3>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Have an idea, activity or suggestion for SAC?
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  href="/suggestions"
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                >
                  Give Feedback
                </Link>

                <Link
                  href="/events"
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  View Events
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Government Engineering College
            Sheohar, Bihar • Student Activity Council
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}