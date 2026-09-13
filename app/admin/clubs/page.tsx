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
  coordinator: string;
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
  coordinator: string;
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
  coordinator: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  display_order: "0",
};

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
        "id,name,category,description,activities,head,coordinator,contact_name,contact_email,contact_phone,logo,display_order,created_at,updated_at"
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

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setExistingLogo(null);

    const input = document.getElementById(
      "club-logo"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  }

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return existingLogo;

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
      throw new Error(`Logo upload failed: ${uploadError.message}`);
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
        coordinator: form.coordinator.trim(),
        contact_name: form.contact_name.trim(),
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim(),
        display_order: Number(form.display_order) || 0,
        logo: logoUrl,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("clubs")
          .update(payload)
          .eq("id", editingId);

        if (updateError) throw new Error(updateError.message);

        setMessage("Club updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("clubs")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (insertError) throw new Error(insertError.message);

        setMessage("Club added successfully.");
      }

      resetForm();
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
      coordinator: club.coordinator || "",
      contact_name: club.contact_name || "",
      contact_email: club.contact_email || "",
      contact_phone: club.contact_phone || "",
      display_order: String(club.display_order ?? 0),
    });

    setExistingLogo(club.logo || null);
    setLogoFile(null);

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
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-xl font-bold">
            SAC Admin
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/clubs"
              target="_blank"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              View Clubs
            </Link>

            <button
              onClick={logout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Student Activity Council
          </p>

          <h1 className="text-4xl font-black">Club Management</h1>

          <p className="mt-3 text-slate-400">
            Add, edit and manage clubs, contacts and logos.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-1 text-2xl font-bold">
            {editingId ? "Edit Club" : "Add Club"}
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            Club logos are uploaded directly to Supabase Storage.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Club Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Club name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    updateField("category", e.target.value)
                  }
                  placeholder="e.g. Science Club"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Club Head
                </label>
                <input
                  type="text"
                  value={form.head}
                  onChange={(e) => updateField("head", e.target.value)}
                  placeholder="Club head"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Coordinator
                </label>
                <input
                  type="text"
                  value={form.coordinator}
                  onChange={(e) =>
                    updateField("coordinator", e.target.value)
                  }
                  placeholder="Coordinator"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) =>
                    updateField("contact_name", e.target.value)
                  }
                  placeholder="Contact person"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) =>
                    updateField("contact_email", e.target.value)
                  }
                  placeholder="contact@example.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) =>
                    updateField("contact_phone", e.target.value)
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.display_order}
                  onChange={(e) =>
                    updateField("display_order", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Club Logo
              </label>

              <input
                id="club-logo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogoFile(e.target.files?.[0] || null)
                }
                className="block w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-slate-400"
              />

              {existingLogo && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={existingLogo}
                    alt="Current club logo"
                    className="h-20 w-20 rounded-xl bg-white object-contain p-2"
                  />
                  <span className="text-sm text-slate-400">
                    Current logo
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Club description"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Activities
              </label>

              <textarea
                rows={4}
                value={form.activities}
                onChange={(e) =>
                  updateField("activities", e.target.value)
                }
                placeholder="Workshops, competitions, events"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can separate activities with commas.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
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
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Clubs</h2>
              <p className="mt-1 text-sm text-slate-400">
                {clubs.length} {clubs.length === 1 ? "club" : "clubs"} in
                database
              </p>
            </div>

            <button
              onClick={loadClubs}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
              Loading clubs...
            </div>
          ) : clubs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <h3 className="text-xl font-bold">
                No clubs added yet.
              </h3>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {clubs.map((club) => (
                <article
                  key={club.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex gap-5">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                      {club.logo ? (
                        <img
                          src={club.logo}
                          alt={`${club.name} logo`}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-3xl">🏫</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold">
                            {club.name}
                          </h3>

                          {club.category && (
                            <p className="mt-1 text-sm text-cyan-400">
                              {club.category}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-slate-500">
                          #{club.display_order}
                        </span>
                      </div>
                    </div>
                  </div>

                  {club.description && (
                    <p className="mt-5 text-sm leading-6 text-slate-400">
                      {club.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {club.head && (
                      <div className="rounded-xl bg-slate-900/70 p-4">
                        <p className="text-xs uppercase text-slate-500">
                          Club Head
                        </p>
                        <p className="mt-1 font-semibold">
                          {club.head}
                        </p>
                      </div>
                    )}

                    {club.coordinator && (
                      <div className="rounded-xl bg-slate-900/70 p-4">
                        <p className="text-xs uppercase text-slate-500">
                          Coordinator
                        </p>
                        <p className="mt-1 font-semibold">
                          {club.coordinator}
                        </p>
                      </div>
                    )}
                  </div>

                  {(club.contact_name ||
                    club.contact_email ||
                    club.contact_phone) && (
                    <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                        Contact Information
                      </p>

                      {club.contact_name && (
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">
                            Person:
                          </span>{" "}
                          {club.contact_name}
                        </p>
                      )}

                      {club.contact_email && (
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">
                            Email:
                          </span>{" "}
                          <a
                            href={`mailto:${club.contact_email}`}
                            className="text-cyan-400 hover:underline"
                          >
                            {club.contact_email}
                          </a>
                        </p>
                      )}

                      {club.contact_phone && (
                        <p className="text-sm">
                          <span className="font-semibold">
                            Phone:
                          </span>{" "}
                          <a
                            href={`tel:${club.contact_phone}`}
                            className="text-cyan-400 hover:underline"
                          >
                            {club.contact_phone}
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {club.activities && (
                    <div className="mt-4 rounded-xl bg-slate-900/70 p-4">
                      <p className="mb-2 text-xs uppercase text-slate-500">
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
                                className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                              >
                                {item}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
                    <button
                      onClick={() => editClub(club)}
                      className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteClub(club.id)}
                      className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}