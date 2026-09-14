"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
  category: string;
  description: string;
  activities: string;
  head: string;
  head_email: string | null;
  head_phone: string | null;
  coordinator: string;
  coordinator_email: string | null;
  coordinator_phone: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  logo: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type ClubForm = {
  name: string;
  category: string;
  description: string;
  activities: string;
  head: string;
  head_email: string;
  head_phone: string;
  coordinator: string;
  coordinator_email: string;
  coordinator_phone: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  display_order: string;
};

const emptyForm: ClubForm = {
  name: "",
  category: "",
  description: "",
  activities: "",
  head: "",
  head_email: "",
  head_phone: "",
  coordinator: "",
  coordinator_email: "",
  coordinator_phone: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  display_order: "0",
};

const inputClass =
  "w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10";

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [form, setForm] = useState<ClubForm>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      window.location.href = "/admin/login";
      return false;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .ilike("email", user.email)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
      return false;
    }

    return true;
  }

  async function loadClubs() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("clubs")
      .select(
        "id,name,category,description,activities,head,head_email,head_phone,coordinator,coordinator_email,coordinator_phone,contact_name,contact_email,contact_phone,logo,display_order,created_at,updated_at"
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setClubs([]);
    } else {
      setClubs((data || []) as Club[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function initialize() {
      const isAdmin = await checkAdmin();

      if (isAdmin) {
        await loadClubs();
      }
    }

    initialize();
  }, []);

  function updateField(field: keyof ClubForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function resetForm(clearFeedback = true) {
    setForm(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setExistingLogo(null);

    const input = document.getElementById(
      "club-logo"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }

    if (clearFeedback) {
      setMessage("");
      setError("");
    }
  }

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) {
      return existingLogo;
    }

    if (!logoFile.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    if (logoFile.size > 5 * 1024 * 1024) {
      throw new Error("Club logo must be smaller than 5 MB.");
    }

    const extension =
      logoFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName =
      form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "club";

    const filePath = `clubs/${safeName}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("clubs")
      .upload(filePath, logoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: logoFile.type,
      });

    if (uploadError) {
      throw new Error(`Club logo upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("clubs")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("Club name is required.");
      }

      const logoUrl = await uploadLogo();

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        activities: form.activities.trim(),
        head: form.head.trim(),
        head_email: form.head_email.trim() || null,
        head_phone: form.head_phone.trim() || null,
        coordinator: form.coordinator.trim(),
        coordinator_email: form.coordinator_email.trim() || null,
        coordinator_phone: form.coordinator_phone.trim() || null,
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim(),
        logo: logoUrl,
        display_order: Number(form.display_order) || 0,
        updated_at: new Date().toISOString(),
      };

      const successMessage = editingId
        ? "Club updated successfully."
        : "Club added successfully.";

      if (editingId) {
        const { error: updateError } = await supabase
          .from("clubs")
          .update(payload)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("clubs")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      resetForm(false);
      setMessage(successMessage);
      await loadClubs();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  function editClub(club: Club) {
    setEditingId(club.id);

    setForm({
      name: club.name || "",
      category: club.category || "",
      description: club.description || "",
      activities: club.activities || "",
      head: club.head || "",
      head_email: club.head_email || "",
      head_phone: club.head_phone || "",
      coordinator: club.coordinator || "",
      coordinator_email: club.coordinator_email || "",
      coordinator_phone: club.coordinator_phone || "",
      contact_name: club.contact_name || "",
      contact_email: club.contact_email || "",
      contact_phone: club.contact_phone || "",
      display_order: String(club.display_order ?? 0),
    });

    setExistingLogo(club.logo || null);
    setLogoFile(null);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteClub(id: string) {
    if (!window.confirm("Are you sure you want to delete this club?")) {
      return;
    }

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("clubs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage("Club deleted successfully.");
    await loadClubs();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <nav className="sticky top-0 z-50 border-b border-[#e4e7ec] bg-[#f8f6f0]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1746a2] text-lg font-black text-white shadow-md">
              SAC
            </div>

            <div>
              <p className="text-lg font-extrabold leading-tight text-[#1746a2]">
                SAC Admin
              </p>
              <p className="text-xs font-semibold text-slate-500">
                GEC Sheohar
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/clubs"
              target="_blank"
              className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#1746a2] shadow-sm transition hover:border-[#1746a2]/30 hover:bg-[#eaf1ff]"
            >
              View Clubs
            </Link>

            <button
              onClick={logout}
              className="rounded-xl bg-[#f47b20] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d96512]"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="college-pattern min-h-[calc(100vh-76px)]">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47b20]">
              Student Activity Council
            </p>

            <h1 className="text-4xl font-black tracking-tight text-[#172033] sm:text-5xl">
              Club Management
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Manage club logos, heads, coordinators and contact information
              from one place.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <section className="college-card mb-12 p-6 sm:p-8">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1.5 rounded-full bg-[#f47b20]" />

                <div>
                  <h2 className="text-2xl font-black text-[#172033]">
                    {editingId ? "Edit Club" : "Add Club"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the club logo and complete leadership contact details.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Club Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Club name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      updateField("category", e.target.value)
                    }
                    placeholder="e.g. Science Club"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.display_order}
                    onChange={(e) =>
                      updateField("display_order", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Club Logo
                  </label>

                  <input
                    id="club-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) =>
                      setLogoFile(e.target.files?.[0] || null)
                    }
                    className="block w-full rounded-xl border border-[#e4e7ec] bg-white p-3 text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#eaf1ff] file:px-4 file:py-2 file:font-semibold file:text-[#1746a2]"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    PNG, JPG, WEBP or SVG • Maximum 5 MB
                  </p>

                  {existingLogo && (
                    <div className="mt-4 flex items-center gap-4 rounded-xl border border-[#e4e7ec] bg-[#f8f6f0] p-3">
                      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                        <img
                          src={existingLogo}
                          alt="Current club logo"
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          Current logo
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Choose another image to replace it.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#1746a2]/15 bg-[#eaf1ff]/60 p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1746a2] text-white">
                    👤
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#1746a2]">
                      Club Head
                    </h3>

                    <p className="text-xs text-slate-500">
                      Faculty or designated club head
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Name
                    </label>

                    <input
                      type="text"
                      value={form.head}
                      onChange={(e) =>
                        updateField("head", e.target.value)
                      }
                      placeholder="Club head name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Email
                    </label>

                    <input
                      type="email"
                      value={form.head_email}
                      onChange={(e) =>
                        updateField("head_email", e.target.value)
                      }
                      placeholder="head@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={form.head_phone}
                      onChange={(e) =>
                        updateField("head_phone", e.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#f47b20]/20 bg-[#fff1e6]/70 p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f47b20] text-white">
                    🎓
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#d96512]">
                      Student Coordinator
                    </h3>

                    <p className="text-xs text-slate-500">
                      Student leadership contact
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Name
                    </label>

                    <input
                      type="text"
                      value={form.coordinator}
                      onChange={(e) =>
                        updateField("coordinator", e.target.value)
                      }
                      placeholder="Coordinator name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Email
                    </label>

                    <input
                      type="email"
                      value={form.coordinator_email}
                      onChange={(e) =>
                        updateField(
                          "coordinator_email",
                          e.target.value
                        )
                      }
                      placeholder="coordinator@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={form.coordinator_phone}
                      onChange={(e) =>
                        updateField(
                          "coordinator_phone",
                          e.target.value
                        )
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Club description"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Activities
                </label>

                <textarea
                  rows={4}
                  value={form.activities}
                  onChange={(e) =>
                    updateField("activities", e.target.value)
                  }
                  placeholder="Workshops, competitions, events"
                  className={`${inputClass} resize-none`}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate activities with commas.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-5 sm:p-6">
                <div className="mb-5">
                  <h3 className="text-lg font-black">
                    Additional Contact
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Optional contact information for the club.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Contact Person
                    </label>

                    <input
                      type="text"
                      value={form.contact_name}
                      onChange={(e) =>
                        updateField("contact_name", e.target.value)
                      }
                      placeholder="Contact person"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Contact Email
                    </label>

                    <input
                      type="email"
                      value={form.contact_email}
                      onChange={(e) =>
                        updateField("contact_email", e.target.value)
                      }
                      placeholder="contact@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Contact Phone
                    </label>

                    <input
                      type="tel"
                      value={form.contact_phone}
                      onChange={(e) =>
                        updateField("contact_phone", e.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Club"
                      : "Add Club"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => resetForm()}
                    className="rounded-full border border-[#e4e7ec] bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-[#1746a2]/30 hover:bg-[#eaf1ff] hover:text-[#1746a2]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-[#f47b20]">
                  Database
                </p>

                <h2 className="text-2xl font-black">
                  All Clubs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {clubs.length}{" "}
                  {clubs.length === 1 ? "club" : "clubs"} in database
                </p>
              </div>

              <button
                onClick={loadClubs}
                className="rounded-xl border border-[#e4e7ec] bg-white px-5 py-2.5 text-sm font-bold text-[#1746a2] shadow-sm transition hover:border-[#1746a2]/30 hover:bg-[#eaf1ff]"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="college-card p-10 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#e4e7ec] border-t-[#1746a2]" />

                <p className="text-sm font-medium text-slate-500">
                  Loading clubs...
                </p>
              </div>
            ) : clubs.length === 0 ? (
              <div className="college-card border-dashed p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl text-[#1746a2]">
                  +
                </div>

                <h3 className="mt-5 text-xl font-black">
                  No clubs added yet.
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first club using the form above.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {clubs.map((club) => (
                  <article
                    key={club.id}
                    className="college-card overflow-hidden"
                  >
                    <div className="flex min-h-56 items-center justify-center bg-[#eaf1ff] p-6">
                      {club.logo ? (
                        <img
                          src={club.logo}
                          alt={`${club.name} logo`}
                          className="h-44 w-44 rounded-2xl bg-white object-contain p-3 shadow-md"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-black text-[#1746a2] shadow-sm">
                            {club.name.charAt(0).toUpperCase()}
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-500">
                            No logo uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black">
                            {club.name}
                          </h3>

                          {club.category && (
                            <p className="mt-1 text-sm font-bold text-[#1746a2]">
                              {club.category}
                            </p>
                          )}
                        </div>

                        <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#d96512]">
                          #{club.display_order}
                        </span>
                      </div>

                      {club.description && (
                        <p className="mt-5 text-sm leading-6 text-slate-600">
                          {club.description}
                        </p>
                      )}

                      <div className="mt-5 grid gap-4">
                        {club.head && (
                          <div className="rounded-xl border border-[#1746a2]/10 bg-[#eaf1ff]/60 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#1746a2]">
                              Club Head
                            </p>

                            <p className="mt-1 font-bold">
                              {club.head}
                            </p>

                            {club.head_email && (
                              <a
                                href={`mailto:${club.head_email}`}
                                className="mt-2 flex items-center gap-2 text-sm font-medium text-[#1746a2] hover:underline"
                              >
                                <span>✉</span>
                                {club.head_email}
                              </a>
                            )}

                            {club.head_phone && (
                              <a
                                href={`tel:${club.head_phone}`}
                                className="mt-1 flex items-center gap-2 text-sm font-medium text-[#1746a2] hover:underline"
                              >
                                <span>☎</span>
                                {club.head_phone}
                              </a>
                            )}
                          </div>
                        )}

                        {club.coordinator && (
                          <div className="rounded-xl border border-[#f47b20]/10 bg-[#fff1e6]/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#d96512]">
                              Student Coordinator
                            </p>

                            <p className="mt-1 font-bold">
                              {club.coordinator}
                            </p>

                            {club.coordinator_email && (
                              <a
                                href={`mailto:${club.coordinator_email}`}
                                className="mt-2 flex items-center gap-2 text-sm font-medium text-[#d96512] hover:underline"
                              >
                                <span>✉</span>
                                {club.coordinator_email}
                              </a>
                            )}

                            {club.coordinator_phone && (
                              <a
                                href={`tel:${club.coordinator_phone}`}
                                className="mt-1 flex items-center gap-2 text-sm font-medium text-[#d96512] hover:underline"
                              >
                                <span>☎</span>
                                {club.coordinator_phone}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {club.activities && (
                        <div className="mt-4 rounded-xl border border-[#e4e7ec] bg-[#f8f6f0] p-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            Activities
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {club.activities
                              .split(",")
                              .map((activity, index) => {
                                const item = activity.trim();

                                if (!item) return null;

                                return (
                                  <span
                                    key={`${club.id}-${index}`}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1746a2] shadow-sm ring-1 ring-[#1746a2]/10"
                                  >
                                    {item}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 flex gap-3 border-t border-[#e4e7ec] pt-5">
                        <button
                          onClick={() => editClub(club)}
                          className="rounded-xl bg-[#1746a2] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#103575]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteClub(club.id)}
                          className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}