"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  category: string | null;
  event_date: string | null;
  venue: string | null;
  organizer: string | null;
  status: string | null;
  description: string | null;
  poster: string | null;
  image: string | null;
  images: string[] | null;
  conducted_by: string | null;
  organizing_club: string | null;
  club_head: string | null;
  club_coordinator: string | null;
  collaborating_clubs: string[] | null;
  collaboration_details: string | null;
  registration_link: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
};

type GalleryPhoto = {
  url: string;
  event: EventItem;
};

export default function GalleryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select(`
        id,
        title,
        category,
        event_date,
        venue,
        organizer,
        status,
        description,
        poster,
        image,
        images,
        conducted_by,
        organizing_club,
        club_head,
        club_coordinator,
        collaborating_clubs,
        collaboration_details,
        registration_link,
        contact_name,
        contact_email,
        contact_phone,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setEvents([]);
    } else {
      setEvents((data || []) as EventItem[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();

    const channel = supabase
      .channel("gallery-events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => loadEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /*
   * ONLY REAL EVENT PHOTOS
   *
   * poster is intentionally NOT used.
   * Gallery gets photos only from:
   * 1. images[]
   * 2. image
   */
  const allPhotos = useMemo<GalleryPhoto[]>(() => {
    const photos: GalleryPhoto[] = [];

    [...events]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .forEach((event) => {
        const added = new Set<string>();

        if (Array.isArray(event.images)) {
          event.images.forEach((url) => {
            if (url && !added.has(url)) {
              photos.push({
                url,
                event,
              });

              added.add(url);
            }
          });
        }

        if (event.image && !added.has(event.image)) {
          photos.push({
            url: event.image,
            event,
          });
        }
      });

    return photos;
  }, [events]);

  function getEventPhotos(event: EventItem): GalleryPhoto[] {
    const photos: GalleryPhoto[] = [];
    const added = new Set<string>();

    if (Array.isArray(event.images)) {
      event.images.forEach((url) => {
        if (url && !added.has(url)) {
          photos.push({
            url,
            event,
          });

          added.add(url);
        }
      });
    }

    if (event.image && !added.has(event.image)) {
      photos.push({
        url: event.image,
        event,
      });
    }

    return photos;
  }

  function openEvent(event: EventItem, photo?: string) {
    setSelectedEvent(event);

    const photos = getEventPhotos(event);

    setSelectedPhoto(photo || photos[0]?.url || null);
  }

  function closeModal() {
    setSelectedEvent(null);
    setSelectedPhoto(null);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eaf1ff] via-[#f8f6f0] to-[#fff1e6]" />

        <div className="college-pattern absolute inset-0 opacity-70" />

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1746a2]/10 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f47b20]">
            Student Activity Council
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            SAC <span className="gradient-text">Gallery</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Real moments, memories and activities from Government
            Engineering College Sheohar.
          </p>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="bg-[#f8f6f0] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1746a2]">
                Campus Memories
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Moments That Matter
              </h2>

              <p className="mt-3 max-w-2xl text-slate-500">
                A collection of real photographs from SAC events,
                workshops, competitions and campus activities.
              </p>
            </div>

            <div className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1746a2] shadow-sm">
              {allPhotos.length} Photos
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="mb-6 h-72 animate-pulse break-inside-avoid rounded-3xl bg-white"
                />
              ))}
            </div>
          ) : allPhotos.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf1ff] text-4xl">
                📸
              </div>

              <h3 className="mt-6 text-xl font-black">
                No photos yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Real event photos uploaded through the Events section
                will automatically appear here.
              </p>
            </div>
          ) : (
            /*
             * MASONRY PHOTO WALL
             */
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {allPhotos.map((photo, index) => (
                <button
                  key={`${photo.url}-${index}`}
                  type="button"
                  onClick={() =>
                    openEvent(photo.event, photo.url)
                  }
                  className="gallery-photo group relative mb-6 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-white text-left shadow-md"
                >
                  <img
                    src={photo.url}
                    alt={photo.event.title}
                    loading={index < 8 ? "eager" : "lazy"}
                    className="h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  />

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061b40]/90 via-[#061b40]/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* PHOTO INFO */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-5 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="line-clamp-2 text-sm font-black leading-5 text-white">
                          {photo.event.title}
                        </p>

                        {photo.event.category && (
                          <p className="mt-1 text-xs font-medium text-white/70">
                            {photo.event.category}
                          </p>
                        )}
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg text-white backdrop-blur-md">
                        ↗
                      </span>
                    </div>
                  </div>

                  {/* FLOATING BORDER */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/0 transition duration-500 group-hover:border-white/50" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#172033]/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-center justify-center py-8">
            <div
              className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#f47b20]">
                    {selectedEvent.category || "SAC Event"}
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    {selectedEvent.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf1ff] text-xl font-bold text-[#1746a2] transition hover:bg-[#1746a2] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7">

                {/* MAIN PHOTO */}
                {selectedPhoto && (
                  <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#f8f6f0]">
                    <div className="flex h-[280px] items-center justify-center sm:h-[500px]">
                      <img
                        src={selectedPhoto}
                        alt={selectedEvent.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {getEventPhotos(selectedEvent).length > 1 && (
                      <div className="absolute bottom-4 right-4 rounded-full bg-[#172033]/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                        Select another photo below
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">

                  {/* EVENT DETAILS */}
                  <div>
                    <h3 className="text-lg font-black text-[#1746a2]">
                      Event Details
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {selectedEvent.event_date && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Date:
                          </span>{" "}
                          {new Date(
                            selectedEvent.event_date
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}

                      {selectedEvent.venue && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Venue:
                          </span>{" "}
                          {selectedEvent.venue}
                        </p>
                      )}

                      {selectedEvent.organizer && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Organizer:
                          </span>{" "}
                          {selectedEvent.organizer}
                        </p>
                      )}

                      {selectedEvent.conducted_by && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Conducted by:
                          </span>{" "}
                          {selectedEvent.conducted_by}
                        </p>
                      )}

                      {selectedEvent.organizing_club && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Organizing Club:
                          </span>{" "}
                          {selectedEvent.organizing_club}
                        </p>
                      )}

                      {selectedEvent.club_head && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Club Head:
                          </span>{" "}
                          {selectedEvent.club_head}
                        </p>
                      )}

                      {selectedEvent.club_coordinator && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Club Coordinator:
                          </span>{" "}
                          {selectedEvent.club_coordinator}
                        </p>
                      )}

                      {selectedEvent.status && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Status:
                          </span>{" "}
                          <span className="capitalize">
                            {selectedEvent.status}
                          </span>
                        </p>
                      )}
                    </div>

                    {selectedEvent.collaborating_clubs &&
                      selectedEvent.collaborating_clubs.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold text-[#1746a2]">
                            Collaborating Clubs
                          </h4>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedEvent.collaborating_clubs.map(
                              (club) => (
                                <span
                                  key={club}
                                  className="rounded-full bg-[#eaf1ff] px-3 py-1.5 text-xs font-semibold text-[#1746a2]"
                                >
                                  {club}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {selectedEvent.collaboration_details && (
                      <div className="mt-6">
                        <h4 className="font-bold text-[#1746a2]">
                          Collaboration Details
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {selectedEvent.collaboration_details}
                        </p>
                      </div>
                    )}

                    {selectedEvent.registration_link && (
                      <a
                        href={selectedEvent.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-7 inline-flex rounded-xl bg-[#f47b20] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d96512]"
                      >
                        Register for Event
                      </a>
                    )}
                  </div>

                  {/* DESCRIPTION + PHOTOS */}
                  <div>
                    {selectedEvent.description && (
                      <div>
                        <h3 className="text-lg font-black text-[#1746a2]">
                          About the Event
                        </h3>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                          {selectedEvent.description}
                        </p>
                      </div>
                    )}

                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black">
                          Event Photos
                        </h3>

                        <span className="text-sm text-slate-500">
                          {getEventPhotos(selectedEvent).length} photos
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {getEventPhotos(selectedEvent).map(
                          (photo, index) => (
                            <button
                              key={`${photo.url}-${index}`}
                              type="button"
                              onClick={() =>
                                setSelectedPhoto(photo.url)
                              }
                              className={`relative aspect-square overflow-hidden rounded-xl bg-[#f8f6f0] ${
                                selectedPhoto === photo.url
                                  ? "ring-4 ring-[#f47b20]"
                                  : ""
                              }`}
                            >
                              <img
                                src={photo.url}
                                alt={`${selectedEvent.title} ${
                                  index + 1
                                }`}
                                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                              />
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/sac-logo.jpg"
              alt="SAC Logo"
              className="h-11 w-11 rounded-full border border-slate-200 object-cover"
            />

            <div>
              <p className="font-black text-[#1746a2]">
                Student Activity Council
              </p>

              <p className="text-sm text-slate-500">
                GEC Sheohar
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Government Engineering College
            Sheohar — SAC
          </p>
        </div>
      </footer>

      {/* FLOATING GALLERY EFFECT */}
      <style jsx global>{`
        .gallery-photo {
          transform: translateY(0) rotate(0deg);
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.45s ease;
        }

        .gallery-photo:nth-child(3n) {
          transform: translateY(4px) rotate(0.4deg);
        }

        .gallery-photo:nth-child(4n) {
          transform: translateY(-3px) rotate(-0.5deg);
        }

        .gallery-photo:nth-child(5n) {
          transform: translateY(2px) rotate(0.25deg);
        }

        .gallery-photo:hover {
          z-index: 20;
          transform: translateY(-12px) scale(1.025) rotate(0deg);
          box-shadow:
            0 25px 55px rgba(23, 70, 162, 0.18),
            0 10px 25px rgba(15, 23, 42, 0.12);
        }

        @media (max-width: 640px) {
          .gallery-photo,
          .gallery-photo:nth-child(3n),
          .gallery-photo:nth-child(4n),
          .gallery-photo:nth-child(5n) {
            transform: none;
          }

          .gallery-photo:hover {
            transform: translateY(-7px) scale(1.015);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-photo,
          .gallery-photo:hover {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}