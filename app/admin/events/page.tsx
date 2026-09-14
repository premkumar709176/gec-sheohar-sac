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

    setExistingImages(
      event.images || (event.image ? [event.image] : [])
    );
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
      const exists =
        current.collaborating_clubs.includes(clubName);

      return {
        ...current,
        collaborating_clubs: exists
          ? current.collaborating_clubs.filter(
              (name) => name !== clubName
            )
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
        image:
          allImages.length > 0 ? allImages[0] : null,
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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0]">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1746a2]/20 border-t-[#1746a2]" />
          </div>

          <h1 className="text-lg font-bold text-[#172033]">
            Loading Events Management...
          </h1>

          <p className="mt-2 text-sm text-[#667085]">
            Checking administrator access
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <nav className="sticky top-0 z-50 border-b border-[#e4e7ec] bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1746a2] text-xs font-black text-white shadow-md">
              SAC
            </div>

            <div>
              <h1 className="text-lg font-black text-[#1746a2] sm:text-xl">
                SAC Admin
              </h1>

              <p className="text-xs font-semibold text-[#667085]">
                Events Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/events"
              className="hidden rounded-xl border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#1746a2] transition hover:bg-[#eaf1ff] sm:block"
            >
              View Events
            </Link>

            <Link
              href="/admin"
              className="rounded-xl bg-[#1746a2] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#103575]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="college-pattern">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#f47b20]">
              Administration
            </p>

            <h2 className="mt-1 text-3xl font-black text-[#172033]">
              {editingId ? "Edit Event" : "Add Event"}
            </h2>

            <div className="mt-3 h-1 w-14 rounded-full bg-[#f47b20]" />

            <p className="mt-3 text-[#667085]">
              Manage event posters, event photos, clubs and event information.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="college-card p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                  📅
                </div>

                <div>
                  <h3 className="text-xl font-black">
                    Basic Event Information
                  </h3>

                  <p className="text-sm text-[#667085]">
                    Add the main details of your event.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Event Title *"
                  value={form.title}
                  onChange={(value) =>
                    setForm({ ...form, title: value })
                  }
                  placeholder="Enter event title"
                  required
                />

                <SelectField
                  label="Category"
                  value={form.category}
                  onChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                  options={[
                    "Workshop",
                    "Seminar",
                    "Competition",
                    "Cultural",
                    "Technical",
                    "Sports",
                    "Awareness",
                    "Meeting",
                    "Other",
                  ]}
                />

                <Field
                  label="Event Date"
                  type="date"
                  value={form.event_date}
                  onChange={(value) =>
                    setForm({ ...form, event_date: value })
                  }
                />

                <Field
                  label="Venue"
                  value={form.venue}
                  onChange={(value) =>
                    setForm({ ...form, venue: value })
                  }
                  placeholder="Venue"
                />

                <Field
                  label="Organizer"
                  value={form.organizer}
                  onChange={(value) =>
                    setForm({ ...form, organizer: value })
                  }
                  placeholder="Organizer name"
                />

                <SelectField
                  label="Status"
                  value={form.status}
                  onChange={(value) =>
                    setForm({ ...form, status: value })
                  }
                  options={[
                    "Upcoming",
                    "Ongoing",
                    "Completed",
                    "Cancelled",
                  ]}
                />

                <Field
                  label="Display Order"
                  type="number"
                  value={form.display_order}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      display_order: value,
                    })
                  }
                  placeholder="0"
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-[#172033]">
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
                    className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-2 focus:ring-[#1746a2]/10"
                    placeholder="Describe the event..."
                  />
                </div>
              </div>
            </section>

            <section className="college-card p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
                  🖼️
                </div>

                <div>
                  <h3 className="text-xl font-black">
                    Event Media
                  </h3>

                  <p className="text-sm text-[#667085]">
                    Upload the event poster and event photographs.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#1746a2]/15 bg-[#eaf1ff]/60 p-5">
                  <h4 className="mb-2 font-black text-[#1746a2]">
                    Event Poster
                  </h4>

                  <p className="mb-4 text-sm text-[#667085]">
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
                    className="block w-full rounded-xl border border-[#e4e7ec] bg-white p-2 text-sm text-[#667085] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1746a2] file:px-4 file:py-2 file:font-bold file:text-white"
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
                    <p className="mt-3 text-sm font-semibold text-emerald-700">
                      New poster selected: {posterFile.name}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[#f47b20]/20 bg-[#fff1e6]/70 p-5">
                  <h4 className="mb-2 font-black text-[#d96512]">
                    Event Photos
                  </h4>

                  <p className="mb-4 text-sm text-[#667085]">
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
                    className="block w-full rounded-xl border border-[#e4e7ec] bg-white p-2 text-sm text-[#667085] file:mr-4 file:rounded-lg file:border-0 file:bg-[#f47b20] file:px-4 file:py-2 file:font-bold file:text-white"
                  />

                  {eventFiles.length > 0 && (
                    <p className="mt-3 text-sm font-semibold text-emerald-700">
                      {eventFiles.length} new photo(s) selected.
                    </p>
                  )}
                </div>
              </div>

              {existingImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-4 font-black text-[#172033]">
                    Existing Event Photos
                  </h4>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {existingImages.map((url) => (
                      <div
                        key={url}
                        className="relative overflow-hidden rounded-xl border border-[#e4e7ec] bg-white"
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
                          className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="college-card p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1ff] text-2xl">
                  🏛️
                </div>

                <div>
                  <h3 className="text-xl font-black">
                    Event Organization
                  </h3>

                  <p className="text-sm text-[#667085]">
                    Specify how the event is being conducted.
                  </p>
                </div>
              </div>

              <SelectField
                label="Conducted By"
                value={form.conducted_by}
                onChange={(value) =>
                  setForm({
                    ...form,
                    conducted_by: value,
                    organizing_club: "",
                    club_head: "",
                    club_coordinator: "",
                    collaborating_clubs: [],
                    collaboration_details: "",
                  })
                }
                options={[
                  "Whole SAC",
                  "Individual Club",
                  "Multiple Clubs",
                  "Collaboration",
                ]}
              />

              {form.conducted_by === "Individual Club" && (
                <div className="mt-6 rounded-2xl border border-[#1746a2]/15 bg-[#eaf1ff]/60 p-5">
                  <h4 className="mb-5 font-black text-[#1746a2]">
                    Organizing Club
                  </h4>

                  <div className="grid gap-5 md:grid-cols-3">
                    <SelectField
                      label="Club Name"
                      value={form.organizing_club}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          organizing_club: value,
                        })
                      }
                      options={clubs.map(
                        (club) => club.name
                      )}
                    />

                    <Field
                      label="Club Head"
                      value={form.club_head}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          club_head: value,
                        })
                      }
                      placeholder="Club Head"
                    />

                    <Field
                      label="Club Coordinator"
                      value={form.club_coordinator}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          club_coordinator: value,
                        })
                      }
                      placeholder="Club Coordinator"
                    />
                  </div>
                </div>
              )}

              {(form.conducted_by === "Multiple Clubs" ||
                form.conducted_by === "Collaboration") && (
                <div className="mt-6 rounded-2xl border border-[#f47b20]/20 bg-[#fff1e6]/60 p-5">
                  <h4 className="mb-2 font-black text-[#d96512]">
                    {form.conducted_by ===
                    "Collaboration"
                      ? "Collaborating Clubs"
                      : "Participating Clubs"}
                  </h4>

                  <p className="mb-5 text-sm text-[#667085]">
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
                              ? "border-[#1746a2] bg-[#eaf1ff]"
                              : "border-[#e4e7ec] bg-white hover:border-[#1746a2]/30"
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
                            className="h-4 w-4 accent-[#1746a2]"
                          />

                          <span className="text-sm font-semibold text-[#172033]">
                            {club.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-bold text-[#172033]">
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
                      className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-2 focus:ring-[#1746a2]/10"
                      placeholder="Describe how the clubs collaborated..."
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="college-card p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e6] text-2xl">
                  📞
                </div>

                <div>
                  <h3 className="text-xl font-black">
                    Registration & Contact
                  </h3>

                  <p className="text-sm text-[#667085]">
                    Add registration and contact information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Registration Link"
                    type="url"
                    value={form.registration_link}
                    onChange={(value) =>
                      setForm({
                        ...form,
                        registration_link: value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <Field
                  label="Contact Name"
                  value={form.contact_name}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      contact_name: value,
                    })
                  }
                  placeholder="Contact person"
                />

                <Field
                  label="Contact Email"
                  type="email"
                  value={form.contact_email}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      contact_email: value,
                    })
                  }
                  placeholder="Email"
                />

                <Field
                  label="Contact Phone"
                  value={form.contact_phone}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      contact_phone: value,
                    })
                  }
                  placeholder="Phone"
                />
              </div>
            </section>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#1746a2] px-7 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-xl border border-[#e4e7ec] bg-white px-7 py-3 font-bold text-[#1746a2] transition hover:bg-[#eaf1ff]"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <section className="mt-16">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wider text-[#f47b20]">
                Event Database
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Existing Events
              </h2>

              <div className="mt-3 h-1 w-14 rounded-full bg-[#f47b20]" />

              <p className="mt-2 text-sm text-[#667085]">
                {events.length} event(s)
              </p>
            </div>

            {events.length === 0 ? (
              <div className="college-card p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
                  📅
                </div>

                <h3 className="mt-4 text-lg font-black">
                  No Events Found
                </h3>

                <p className="mt-2 text-sm text-[#667085]">
                  Add your first event using the form above.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="college-card overflow-hidden"
                  >
                    {event.poster ? (
                      <div className="relative">
                        <img
                          src={event.poster}
                          alt={event.title}
                          className="h-64 w-full object-cover"
                        />

                        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1746a2] shadow-md backdrop-blur">
                          {event.status || "Upcoming"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-[#eaf1ff] text-[#667085]">
                        No Poster
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {event.category && (
                          <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#d96512]">
                            {event.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-[#172033]">
                        {event.title}
                      </h3>

                      <div className="mt-4 space-y-2 text-sm text-[#667085]">
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
                          className="flex-1 rounded-xl bg-[#1746a2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#103575]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteEvent(event.id)
                          }
                          className="flex-1 rounded-xl bg-[#fff1e6] px-4 py-2.5 text-sm font-bold text-[#d96512] transition hover:bg-[#f47b20] hover:text-white"
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#172033]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-2 focus:ring-[#1746a2]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#172033]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1746a2] focus:ring-2 focus:ring-[#1746a2]/10"
      >
        <option value="">Select option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}