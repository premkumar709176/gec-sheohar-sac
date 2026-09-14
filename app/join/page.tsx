"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const branches = [
  "Computer Science & Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Electronics & Communication Engineering",
  "Other",
];

const years = [
  "1st Year / 1st Semester",
  "1st Year / 2nd Semester",
  "2nd Year / 3rd Semester",
  "2nd Year / 4th Semester",
  "3rd Year / 5th Semester",
  "3rd Year / 6th Semester",
  "4th Year / 7th Semester",
  "4th Year / 8th Semester",
];

const clubs = [
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
  "Any Club",
];

const positions = ["Club Member", "Volunteer"];

export default function JoinPage() {
  const [form, setForm] = useState({
    fullName: "",
    registrationNumber: "",
    branch: "",
    yearSemester: "",
    email: "",
    phone: "",
    preferredClub: "",
    position: "",
    skills: "",
    whyJoin: "",
    previousExperience: "",
    availability: "",
    profilePhotoUrl: "",
    declaration: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.declaration) {
      setMessage("Please accept the declaration before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("registrations").insert([
        {
          full_name: form.fullName,
          registration_number: form.registrationNumber,
          branch: form.branch,
          year_semester: form.yearSemester,
          email: form.email,
          phone: form.phone,
          preferred_club: form.preferredClub,
          position_interested: form.position,
          skills: form.skills,
          why_join: form.whyJoin,
          previous_experience: form.previousExperience,
          availability: form.availability,
          profile_photo_url: form.profilePhotoUrl || null,
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage(
        "Application submitted successfully! The SAC team will review your application."
      );

      setForm({
        fullName: "",
        registrationNumber: "",
        branch: "",
        yearSemester: "",
        email: "",
        phone: "",
        preferredClub: "",
        position: "",
        skills: "",
        whyJoin: "",
        previousExperience: "",
        availability: "",
        profilePhotoUrl: "",
        declaration: false,
      });
    } catch (error: any) {
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="h-[76px]" />

      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Join SAC
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Become a part of the Student Activity Council
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Contribute your skills, ideas, creativity and leadership to campus
            life.
          </p>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Registration
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              SAC Membership Application
            </h2>
            <p className="mt-3 text-slate-400">
              Fill in your details carefully. Your application will be
              reviewed by the SAC team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <span className="text-sm font-bold text-blue-400">01</span>
                <div>
                  <h3 className="text-2xl font-bold">Personal Information</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Enter your basic academic and contact details.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  required
                  value={form.fullName}
                  onChange={(v) => updateField("fullName", v)}
                />

                <Input
                  label="Registration Number"
                  required
                  value={form.registrationNumber}
                  onChange={(v) => updateField("registrationNumber", v)}
                />

                <Select
                  label="Branch"
                  required
                  value={form.branch}
                  options={branches}
                  onChange={(v) => updateField("branch", v)}
                />

                <Select
                  label="Year / Semester"
                  required
                  value={form.yearSemester}
                  options={years}
                  onChange={(v) => updateField("yearSemester", v)}
                />

                <Input
                  label="College Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <span className="text-sm font-bold text-blue-400">02</span>
                <div>
                  <h3 className="text-2xl font-bold">SAC Preference</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Tell us where you would like to contribute.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Select
                  label="Preferred Club"
                  required
                  value={form.preferredClub}
                  options={clubs}
                  onChange={(v) => updateField("preferredClub", v)}
                />

                <Select
                  label="Position Interested In"
                  required
                  value={form.position}
                  options={positions}
                  onChange={(v) => updateField("position", v)}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Skills"
                    value={form.skills}
                    onChange={(v) => updateField("skills", v)}
                    placeholder="e.g. Coding, Design, Photography, Public Speaking"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <span className="text-sm font-bold text-blue-400">03</span>
                <div>
                  <h3 className="text-2xl font-bold">Your Contribution</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Help us understand your interest and experience.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Textarea
                  label="Why do you want to join SAC?"
                  required
                  value={form.whyJoin}
                  onChange={(v) => updateField("whyJoin", v)}
                />

                <Textarea
                  label="Previous Experience"
                  value={form.previousExperience}
                  onChange={(v) => updateField("previousExperience", v)}
                />

                <Textarea
                  label="Availability"
                  value={form.availability}
                  onChange={(v) => updateField("availability", v)}
                  placeholder="e.g. Weekdays after 4 PM, weekends"
                />

                <Input
                  label="Profile Photo URL"
                  value={form.profilePhotoUrl}
                  onChange={(v) => updateField("profilePhotoUrl", v)}
                />

                <p className="-mt-2 text-sm text-slate-400">
                  Profile photo is optional. You can leave this field empty
                  and provide your photo later if requested by the SAC team.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <span className="text-sm font-bold text-blue-400">04</span>
                <div>
                  <h3 className="text-2xl font-bold">Declaration</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Please confirm the information you have provided.
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300">
                <input
                  type="checkbox"
                  checked={form.declaration}
                  onChange={(e) =>
                    updateField("declaration", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-600"
                />

                <span>
                  I declare that the information provided by me is true and
                  correct to the best of my knowledge. I understand that
                  submission of this form does not guarantee selection into SAC
                  or any particular club/position.
                </span>
              </label>

              {message && (
                <div className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 rounded-full bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit SAC Application"}
              </button>

              <p className="mt-4 text-sm text-slate-500">
                Your information will be stored securely and used only for SAC
                membership and administrative purposes.
              </p>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <img
              src="/sac-logo.jpg"
              alt="Student Activity Club GEC Sheohar"
              className="mb-4 h-14 w-14 rounded-full object-cover"
            />

            <h3 className="text-lg font-bold">Student Activity Club</h3>
            <p className="text-sm text-slate-400">GEC Sheohar</p>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Empowering students through creativity, leadership,
              collaboration and meaningful campus activities.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <a href="/" className="hover:text-white">
                Home
              </a>
              <a href="/clubs" className="hover:text-white">
                Clubs
              </a>
              <a href="/members" className="hover:text-white">
                Members
              </a>
              <a href="/events" className="hover:text-white">
                Events
              </a>
              <a href="/gallery" className="hover:text-white">
                Gallery
              </a>
              <a href="/suggestions" className="hover:text-white">
                Feedback
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Get Involved</h3>

            <p className="text-sm leading-6 text-slate-400">
              Have an idea, activity or suggestion for SAC?
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/suggestions"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Give Feedback
              </a>

              <a
                href="/events"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                View Events
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-sm text-slate-500">
          © 2026 Government Engineering College Sheohar, Bihar • Student
          Activity Council
        </div>
      </footer>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500"
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

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>

      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
      />
    </div>
  );
}