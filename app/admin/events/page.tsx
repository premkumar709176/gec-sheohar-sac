"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Club = {
  id: string;
  name: string;
};

type EventItem = {
  id: string;
  title: string;
  category: string | null;
  event_date: string | null;
  venue: string | null;
  organizer: string | null;
  club: string | null;
  status: string | null;
  display_order: number | null;
  description: string | null;
  poster: string | null;
  image: string | null;
  images: string[] | null;
  registration_link: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  conducted_by: string | null;
  organizing_club: string | null;
  club_head: string | null;
  club_coordinator: string | null;
  collaborating_clubs: string[] | null;
  collaboration_details: string | null;
  created_at: string;
  updated_at: string | null;
};

type FormState = {
  title: string;
  category: string;
  event_date: string;
  venue: string;
  organizer: string;
  status: string;
  display_order: string;
  description: string;

  poster: string;

  registration_link: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;

  conducted_by: string;
  organizing_club: string;
  club_head: string;
  club_coordinator: string;
  collaborating_clubs: string[];
  collaboration_details: string;
};

const emptyForm: FormState = {
  title: "",
  category: "",
  event_date: "",
  venue: "",
  organizer: "",
  status: "Upcoming",
  display_order: "0",
  description: "",

  poster: "",

  registration_link: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",

  conducted_by: "Whole SAC",
  organizing_club: "",
  club_head: "",
  club_coordinator: "",
  collaborating_clubs: [],
  collaboration_details: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [eventFiles, setEventFiles] = useState<File[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select("email")
        .ilike("email", user.email || "")
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      await Promise.all([loadEvents(), loadClubs()]);
    } catch (err) {
      console.error(err);
      setError("Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(`
        id,
        title,
        category,
        event_date,
        venue,
        organizer,
        club,
        status,
        display_order,
        description,
        poster,
        image,
        images,
        registration_link,
        contact_name,
        contact_email,
        contact_phone,
        conducted_by,
        organizing_club,
        club_head,
        club_coordinator,
        collaborating_clubs,
        collaboration_details,
        created_at,
        updated_at
      `)
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }

    setEvents((data || []) as EventItem[]);
  }

  async function loadClubs() {
    const { data, error } = await supabase
      .from("clubs")
      .select("id,name")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setClubs(data || []);
  }

  useEffect(() => {
    const channel = supabase
      .channel("admin-events-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          loadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setPosterFile(null);
    setEventFiles([]);
    setExistingImages([]);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  function editEvent(event: EventItem) {
    setEditingId(event.id);

    setForm({
      title: event.title || "",
      category: event.category || "",
      event_date: event.event_date || "",
      venue: event.venue || "",
      organizer: event.organizer || "",
      status: event.status || "Upcoming",
      display_order: String(event.display_order ?? 0),
      description: event.description || "",

      poster: event.poster || "",

      registration_link: event.registration_link || "",
      contact_name: event.contact_name || "",
      contact_email: event.contact_email || "",
      contact_phone: event.contact_phone || "",

      conducted_by: event.conducted_by || "Whole SAC",
      organizing_club: event.organizing_club || "",
      club_head: event.club_head || "",
      club_coordinator: event.club_coordinator || "",
      collaborating_clubs: event.collaborating_clubs || [],
      collaboration_details: event.collaboration_details || "",
    });

    setExistingImages(event.images || (event.image ? [event.image] : []));
    setPosterFile(null);
    setEventFiles([]);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function toggleCollaboratingClub(clubName: string) {
    setForm((current) => {
      const exists = current.collaborating_clubs.includes(clubName);

      return {
        ...current,
        collaborating_clubs: exists
          ? current.collaborating_clubs.filter((name) => name !== clubName)
          : [...current.collaborating_clubs, clubName],
      };
    });
  }

  async function uploadFile(
    file: File,
    folder: string,
    index = 0
  ): Promise<string> {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName =
      form.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "event";

    const filePath = `${folder}/${safeName}-${Date.now()}-${index}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("events")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(
        `Photo upload failed: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("events")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function uploadPoster(): Promise<string | null> {
    if (!posterFile) {
      return form.poster || null;
    }

    return await uploadFile(posterFile, "posters");
  }

  async function uploadEventImages(): Promise<string[]> {
    if (eventFiles.length === 0) {
      return existingImages;
    }

    const uploaded: string[] = [];

    for (let i = 0; i < eventFiles.length; i++) {
      const url = await uploadFile(
        eventFiles[i],
        "event-images",
        i
      );

      uploaded.push(url);
    }

    return [...existingImages, ...uploaded];
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!form.title.trim()) {
        throw new Error("Event title is required.");
      }

      const posterUrl = await uploadPoster();
      const allImages = await uploadEventImages();

      let organizingClub = form.organizing_club;
      let clubHead = form.club_head;
      let clubCoordinator = form.club_coordinator;
      let collaboratingClubs = form.collaborating_clubs;

      if (form.conducted_by !== "Individual Club") {
        organizingClub = "";
        clubHead = "";
        clubCoordinator = "";
      }

      if (
        form.conducted_by !== "Multiple Clubs" &&
        form.conducted_by !== "Collaboration"
      ) {
        collaboratingClubs = [];
      }

      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || null,
        event_date: form.event_date || null,
        venue: form.venue.trim() || null,
        organizer: form.organizer.trim() || null,

        club:
          form.conducted_by === "Individual Club"
            ? form.organizing_club || null
            : null,

        status: form.status,
        display_order: Number(form.display_order) || 0,
        description: form.description.trim() || null,

        poster: posterUrl,

        image: allImages.length > 0 ? allImages[0] : null,
        images: allImages,

        registration_link:
          form.registration_link.trim() || null,

        contact_name:
          form.contact_name.trim() || null,

        contact_email:
          form.contact_email.trim() || null,

        contact_phone:
          form.contact_phone.trim() || null,

        conducted_by: form.conducted_by,

        organizing_club: organizingClub || null,

        club_head: clubHead.trim() || null,

        club_coordinator:
          clubCoordinator.trim() || null,

        collaborating_clubs: collaboratingClubs,

        collaboration_details:
          form.collaboration_details.trim() || null,

        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setMessage("Event updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          });

        if (insertError) {
          throw new Error(insertError.message);
        }

        setMessage("Event added successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Event deleted.");
    await loadEvents();
  }

  function removeExistingImage(url: string) {
    setExistingImages((current) =>
      current.filter((image) => image !== url)
    );
  }

  function formatDate(date: string | null) {
    if (!date) return "Date not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-lg">Loading admin panel...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">
              SAC Admin
            </h1>
            <p className="text-xs text-slate-400">
              Government Engineering College Sheohar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
            >
              View Events
            </Link>

            <Link
              href="/admin"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            {editingId ? "Edit Event" : "Add Event"}
          </h2>

          <p className="mt-2 text-slate-400">
            Manage event posters, event photos, clubs and event information.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-6 text-xl font-bold">
              Basic Event Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Event Title *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                >
                  <option value="">Select Category</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Competition">Competition</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Technical">Technical</option>
                  <option value="Sports">Sports</option>
                  <option value="Awareness">Awareness</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event Date
                </label>

                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      event_date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Venue
                </label>

                <input
                  value={form.venue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      venue: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Venue"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Organizer
                </label>

                <input
                  value={form.organizer}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      organizer: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Organizer name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Order
                </label>

                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Describe the event..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-2 text-xl font-bold">
              Event Media
            </h3>

            <p className="mb-6 text-sm text-slate-400">
              Upload one poster for the front of the event and multiple photos from the event.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <h4 className="mb-2 font-semibold text-blue-300">
                  Event Poster
                </h4>

                <p className="mb-4 text-sm text-slate-400">
                  This will be the main/front image of the event.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPosterFile(
                      e.target.files?.[0] || null
                    )
                  }
                  className="block w-full text-sm"
                />

                {form.poster && !posterFile && (
                  <div className="mt-4">
                    <img
                      src={form.poster}
                      alt="Current poster"
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  </div>
                )}

                {posterFile && (
                  <p className="mt-3 text-sm text-emerald-400">
                    New poster selected: {posterFile.name}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h4 className="mb-2 font-semibold text-emerald-300">
                  Event Photos
                </h4>

                <p className="mb-4 text-sm text-slate-400">
                  Upload multiple photos taken during the event.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setEventFiles(
                      Array.from(e.target.files || [])
                    )
                  }
                  className="block w-full text-sm"
                />

                {eventFiles.length > 0 && (
                  <p className="mt-3 text-sm text-emerald-400">
                    {eventFiles.length} new photo(s) selected.
                  </p>
                )}
              </div>
            </div>

            {existingImages.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-4 font-semibold">
                  Existing Event Photos
                </h4>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="relative overflow-hidden rounded-xl border border-white/10"
                    >
                      <img
                        src={url}
                        alt="Event photo"
                        className="h-36 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(url)
                        }
                        className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-6 text-xl font-bold">
              Event Organization
            </h3>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Conducted By
              </label>

              <select
                value={form.conducted_by}
                onChange={(e) =>
                  setForm({
                    ...form,
                    conducted_by: e.target.value,
                    organizing_club: "",
                    club_head: "",
                    club_coordinator: "",
                    collaborating_clubs: [],
                    collaboration_details: "",
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
              >
                <option value="Whole SAC">
                  Whole SAC
                </option>
                <option value="Individual Club">
                  Individual Club
                </option>
                <option value="Multiple Clubs">
                  Multiple Clubs
                </option>
                <option value="Collaboration">
                  Collaboration
                </option>
              </select>
            </div>

            {form.conducted_by === "Individual Club" && (
              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <h4 className="mb-5 font-semibold text-blue-300">
                  Organizing Club
                </h4>

                <div className="grid gap-5 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm">
                      Club Name
                    </label>

                    <select
                      value={form.organizing_club}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          organizing_club:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                    >
                      <option value="">
                        Select Club
                      </option>

                      {clubs.map((club) => (
                        <option
                          key={club.id}
                          value={club.name}
                        >
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">
                      Club Head
                    </label>

                    <input
                      value={form.club_head}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          club_head: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                      placeholder="Club Head"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm">
                      Club Coordinator
                    </label>

                    <input
                      value={form.club_coordinator}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          club_coordinator:
                            e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                      placeholder="Club Coordinator"
                    />
                  </div>
                </div>
              </div>
            )}

            {(form.conducted_by === "Multiple Clubs" ||
              form.conducted_by === "Collaboration") && (
              <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                <h4 className="mb-2 font-semibold text-purple-300">
                  {form.conducted_by === "Collaboration"
                    ? "Collaborating Clubs"
                    : "Participating Clubs"}
                </h4>

                <p className="mb-5 text-sm text-slate-400">
                  Select all clubs involved in organizing this event.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club) => {
                    const checked =
                      form.collaborating_clubs.includes(
                        club.name
                      );

                    return (
                      <label
                        key={club.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                          checked
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-white/10 bg-slate-900"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCollaboratingClub(
                              club.name
                            )
                          }
                          className="h-4 w-4"
                        />

                        <span className="text-sm">
                          {club.name}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm">
                    Collaboration Details
                  </label>

                  <textarea
                    rows={4}
                    value={form.collaboration_details}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        collaboration_details:
                          e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                    placeholder="Describe how the clubs collaborated..."
                  />
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-6 text-xl font-bold">
              Registration & Contact
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm">
                  Registration Link
                </label>

                <input
                  type="url"
                  value={form.registration_link}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      registration_link:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Contact Name
                </label>

                <input
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact_name:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Contact person"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Contact Email
                </label>

                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact_email:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">
                  Contact Phone
                </label>

                <input
                  value={form.contact_phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contact_phone:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3"
                  placeholder="Phone"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Event"
                : "Add Event"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-7 py-3 font-semibold hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Existing Events
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {events.length} event(s)
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
              >
                {event.poster ? (
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-slate-900 text-slate-500">
                    No Poster
                  </div>
                )}

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                      {event.status || "Upcoming"}
                    </span>

                    {event.category && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>
                      📅 {formatDate(event.event_date)}
                    </p>

                    {event.venue && (
                      <p>📍 {event.venue}</p>
                    )}

                    <p>
                      👥{" "}
                      {event.conducted_by ||
                        "Whole SAC"}
                    </p>

                    {event.organizing_club && (
                      <p>
                        🏛️ {event.organizing_club}
                      </p>
                    )}

                    {event.collaborating_clubs &&
                      event.collaborating_clubs.length >
                        0 && (
                        <p>
                          🤝{" "}
                          {event.collaborating_clubs.join(
                            ", "
                          )}
                        </p>
                      )}

                    {event.club_head && (
                      <p>
                        Head: {event.club_head}
                      </p>
                    )}

                    {event.club_coordinator && (
                      <p>
                        Coordinator:{" "}
                        {event.club_coordinator}
                      </p>
                    )}

                    <p>
                      📷{" "}
                      {event.images?.length || 0} event
                      photo(s)
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        editEvent(event)
                      }
                      className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}