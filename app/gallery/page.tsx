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
  isPoster: boolean;
};

export default function GalleryPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedEvent, setSelectedEvent] =
    useState<EventItem | null>(null);
  const [selectedPhoto, setSelectedPhoto] =
    useState<string | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<string>("All");

  async function loadEvents(): Promise<void> {
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
        () => {
          loadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = useMemo<string[]>(() => {
    const unique = new Set<string>();

    events.forEach((event) => {
      if (event.category?.trim()) {
        unique.add(event.category.trim());
      }
    });

    return ["All", ...Array.from(unique)];
  }, [events]);

  const filteredEvents = useMemo<EventItem[]>(() => {
    if (activeCategory === "All") {
      return events;
    }

    return events.filter(
      (event) => event.category?.trim() === activeCategory
    );
  }, [events, activeCategory]);

  /*
    ALL PHOTOS
    No 20-photo limit.
  */
  const latestPhotos = useMemo<GalleryPhoto[]>(() => {
    const photos: GalleryPhoto[] = [];

    [...events]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .forEach((event) => {
        if (event.poster) {
          photos.push({
            url: event.poster,
            event,
            isPoster: true,
          });
        }

        const eventImages: string[] = Array.isArray(event.images)
          ? event.images
          : [];

        eventImages.forEach((url: string) => {
          if (url && url !== event.poster) {
            photos.push({
              url,
              event,
              isPoster: false,
            });
          }
        });

        if (
          event.image &&
          event.image !== event.poster &&
          !eventImages.includes(event.image)
        ) {
          photos.push({
            url: event.image,
            event,
            isPoster: false,
          });
        }
      });

    return photos;
  }, [events]);

  function getEventPhotos(event: EventItem): GalleryPhoto[] {
    const photos: GalleryPhoto[] = [];

    if (event.poster) {
      photos.push({
        url: event.poster,
        event,
        isPoster: true,
      });
    }

    const images: string[] = Array.isArray(event.images)
      ? event.images
      : [];

    images.forEach((url: string) => {
      if (url && url !== event.poster) {
        photos.push({
          url,
          event,
          isPoster: false,
        });
      }
    });

    if (
      event.image &&
      event.image !== event.poster &&
      !images.includes(event.image)
    ) {
      photos.push({
        url: event.image,
        event,
        isPoster: false,
      });
    }

    return photos;
  }

  function formatDate(date: string | null): string {
    if (!date) {
      return "Date not specified";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getStatusClass(status: string | null): string {
    const value = status?.toLowerCase();

    if (value === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (value === "ongoing") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-blue-100 text-blue-700";
  }

  function openEvent(
    event: EventItem,
    photo?: string
  ): void {
    setSelectedEvent(event);

    setSelectedPhoto(
      photo ||
        event.poster ||
        getEventPhotos(event)[0]?.url ||
        null
    );
  }

  function closeModal(): void {
    setSelectedEvent(null);
    setSelectedPhoto(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.2),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300">
            Student Activity Council
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            SAC Gallery
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            A collection of memories, achievements, celebrations,
            workshops and activities from GEC Sheohar.
          </p>
        </div>
      </section>

      {/* ALL PHOTOS SLIDER */}
      <section className="overflow-hidden bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              From Campus Life
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Moments That Matter
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              All memories, achievements and celebrations from
              GEC Sheohar.
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl bg-slate-100">
              <div className="text-sm font-semibold text-slate-500">
                Loading memories...
              </div>
            </div>
          ) : latestPhotos.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
              No photos available yet.
            </div>
          ) : (
            <div className="group relative overflow-hidden rounded-3xl">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white via-white/70 to-transparent" />

              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white via-white/70 to-transparent" />

              <div className="latest-photo-track flex w-max gap-5 py-5 group-hover:[animation-play-state:paused]">
                {[...latestPhotos, ...latestPhotos].map(
                  (photo: GalleryPhoto, index: number) => (
                    <button
                      key={`${photo.url}-${index}`}
                      type="button"
                      onClick={() =>
                        openEvent(photo.event, photo.url)
                      }
                      className="group/photo relative h-52 w-72 shrink-0 overflow-hidden rounded-2xl bg-slate-200 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl sm:h-60 sm:w-80"
                    >
                      <img
                        src={photo.url}
                        alt={photo.event.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover/photo:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition group-hover/photo:opacity-100" />

                      <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-5 text-left opacity-0 transition duration-300 group-hover/photo:translate-y-0 group-hover/photo:opacity-100">
                        <p className="line-clamp-2 text-sm font-bold text-white">
                          {photo.event.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          {photo.event.category || "SAC Event"}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EXPLORE BY EVENT */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Explore by Event
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Discover complete photo collections from workshops,
              cultural programmes, competitions and other SAC events.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {categories.map((category: string) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "bg-slate-950 text-white shadow-lg"
                    : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {error && (
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item: number) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-3xl bg-slate-200"
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mt-12 rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <p className="text-lg font-bold">
                No event photos available.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Photos uploaded through the Events section will
                automatically appear here.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event: EventItem) => {
                const photos = getEventPhotos(event);
                const cover = event.poster || photos[0]?.url;

                return (
                  <article
                    key={event.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <button
                      type="button"
                      onClick={() => openEvent(event, cover)}
                      className="relative block h-72 w-full overflow-hidden bg-slate-200 text-left"
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={event.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          No event image
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 pt-20">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900">
                            {event.category || "SAC Event"}
                          </span>

                          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {photos.length}{" "}
                            {photos.length === 1
                              ? "Photo"
                              : "Photos"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-black leading-tight">
                          {event.title}
                        </h3>

                        {event.status && (
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                              event.status
                            )}`}
                          >
                            {event.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-slate-500">
                        {event.event_date && (
                          <p>
                            <span className="font-semibold text-slate-700">
                              Date:
                            </span>{" "}
                            {formatDate(event.event_date)}
                          </p>
                        )}

                        {event.venue && (
                          <p>
                            <span className="font-semibold text-slate-700">
                              Venue:
                            </span>{" "}
                            {event.venue}
                          </p>
                        )}

                        {event.conducted_by && (
                          <p>
                            <span className="font-semibold text-slate-700">
                              Conducted by:
                            </span>{" "}
                            {event.conducted_by}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openEvent(event, cover)}
                        className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                      >
                        View Event Gallery
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="flex min-h-full items-center justify-center py-8">
            <div
              className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    {selectedEvent.category || "SAC Event"}
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    {selectedEvent.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  ×
                </button>
              </div>

              <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7">
                {selectedPhoto && (
                  <div className="relative mb-8 overflow-hidden rounded-2xl bg-slate-100">
                    <div className="flex h-[280px] items-center justify-center sm:h-[480px]">
                      <img
                        src={selectedPhoto}
                        alt={selectedEvent.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {getEventPhotos(selectedEvent).length > 1 && (
                      <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                        Select another photo below
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                  <div>
                    <h3 className="text-lg font-black">
                      Event Details
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {selectedEvent.event_date && (
                        <p>
                          <span className="font-bold text-slate-900">
                            Date:
                          </span>{" "}
                          {formatDate(selectedEvent.event_date)}
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
                          <h4 className="font-bold">
                            Collaborating Clubs
                          </h4>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedEvent.collaborating_clubs.map(
                              (club: string) => (
                                <span
                                  key={club}
                                  className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
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
                        <h4 className="font-bold">
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
                        className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        Register for Event
                      </a>
                    )}
                  </div>

                  <div>
                    {selectedEvent.description && (
                      <div>
                        <h3 className="text-lg font-black">
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
                          {getEventPhotos(selectedEvent).length}{" "}
                          photos
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {getEventPhotos(selectedEvent).map(
                          (
                            photo: GalleryPhoto,
                            index: number
                          ) => (
                            <button
                              key={`${photo.url}-${index}`}
                              type="button"
                              onClick={() =>
                                setSelectedPhoto(photo.url)
                              }
                              className={`relative aspect-square overflow-hidden rounded-xl bg-slate-100 ${
                                selectedPhoto === photo.url
                                  ? "ring-4 ring-blue-500"
                                  : ""
                              }`}
                            >
                              <img
                                src={photo.url}
                                alt={`${selectedEvent.title} ${
                                  index + 1
                                }`}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                              />

                              {photo.isPoster && (
                                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
                                  POSTER
                                </span>
                              )}
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
      <footer className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row">
          <div>
            <h3 className="text-lg font-black">
              Student Activity Council
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Government Engineering College, Sheohar, Bihar.
              Empowering students through activities, creativity,
              leadership and collaboration.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <a href="/" className="hover:text-white">
              Home
            </a>

            <a href="/events" className="hover:text-white">
              Events
            </a>

            <a href="/gallery" className="hover:text-white">
              Gallery
            </a>

            <a href="/members" className="hover:text-white">
              Members
            </a>

            <a
              href="/suggestions"
              className="hover:text-white"
            >
              Feedback
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Government Engineering
          College Sheohar — Student Activity Council
        </div>
      </footer>

      {/* SLOW SLIDER ANIMATION */}
      <style jsx global>{`
        @keyframes latestPhotoMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .latest-photo-track {
          animation: latestPhotoMarquee 120s linear infinite;
          will-change: transform;
        }

        @media (max-width: 640px) {
          .latest-photo-track {
            animation-duration: 90s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .latest-photo-track {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}