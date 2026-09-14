"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryPhoto = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  event_date: string | null;
  location: string | null;
  imageUrl: string;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] =
    useState<GalleryPhoto | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  async function loadGallery() {
    try {
      setError("");

      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (galleryError) {
        throw galleryError;
      }

      const formattedPhotos: GalleryPhoto[] = (galleryData || [])
        .map((item: any) => {
          const imageUrl =
            item.image_url ||
            item.photo_url ||
            item.image ||
            item.photo ||
            item.url ||
            item.src ||
            "";

          return {
            id: String(item.id),
            imageUrl,
            title: item.title || item.name || "",
            description: item.description || "",
          };
        })
        .filter((photo) => photo.imageUrl);

      setPhotos(formattedPhotos);

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });

      if (eventError) {
        console.error("Events loading error:", eventError);
        setEvents([]);
      } else {
        const formattedEvents: EventItem[] = (eventData || []).map(
          (item: any) => ({
            id: String(item.id),
            title: item.title || item.name || "Event",
            description: item.description || "",
            event_date: item.event_date || item.date || null,
            location: item.location || null,
            imageUrl:
              item.image_url ||
              item.photo_url ||
              item.image ||
              item.photo ||
              "",
          })
        );

        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Gallery loading error:", err);
      setError("Unable to load gallery photos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();

    const channel = supabase
      .channel("gallery-live-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "gallery",
        },
        () => {
          loadGallery();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (photos.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) =>
        previous >= photos.length - 1 ? 0 : previous + 1
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [photos.length]);

  function formatDate(date: string | null) {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="h-[76px]" />

        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <h1 className="text-xl font-semibold">
              Loading Gallery...
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Please wait while the gallery is loading.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="h-[76px]" />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Student Activity Council
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            SAC Gallery
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            A collection of photographs highlighting activities,
            workshops, competitions, events and memorable moments
            of the Student Activity Council at Government Engineering
            College Sheohar.
          </p>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        </section>
      )}

      {/* PHOTO SLIDER */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Memories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              Latest Moments
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Photographs are displayed sequentially, with one photo
              advancing every second.
            </p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">
              <div className="text-5xl">🖼️</div>

              <h3 className="mt-5 text-xl font-bold">
                No Gallery Photos Available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Photographs uploaded through the administration panel
                will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-slate-950 to-transparent" />

            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-slate-950 to-transparent" />

            <div
              className="flex gap-4 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * 420
                }px)`,
              }}
            >
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="group w-[85vw] max-w-[420px] flex-shrink-0 text-left sm:w-[420px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title || "SAC Gallery Photograph"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                    {photo.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-bold text-white">
                          {photo.title}
                        </h3>

                        {photo.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-200">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      View Photograph
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ALL PHOTOGRAPHS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Gallery
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            All Photographs
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Browse all photographs uploaded to the SAC gallery.
          </p>
        </div>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="group text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title || "SAC Gallery Photograph"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                  {photo.title && (
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-4 pt-10 transition duration-300 group-hover:translate-y-0">
                      <p className="text-sm font-semibold text-white">
                        {photo.title}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* EVENTS AND ACTIVITIES */}
      {events.length > 0 && (
        <section className="border-t border-white/10 bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Activities
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Events & Activities
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Events and activities organized by the Student Activity
                Council and its affiliated clubs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
                >
                  {event.imageUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-slate-900">
                      <span className="text-4xl">📅</span>
                    </div>
                  )}

                  <div className="p-6">
                    {event.event_date && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                        {formatDate(event.event_date)}
                      </p>
                    )}

                    <h3 className="mt-2 text-xl font-bold text-white">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                        {event.description}
                      </p>
                    )}

                    {event.location && (
                      <p className="mt-4 text-sm text-slate-500">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/sac-logo.jpg"
                alt="Student Activity Council"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="font-bold text-white">
                  Student Activity Council
                </p>

                <p className="text-sm text-slate-500">
                  Government Engineering College Sheohar
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              GEC Sheohar Student Activity Council
            </p>
          </div>
        </div>
      </footer>

      {/* PHOTO MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>

          <div
            className="relative max-h-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.imageUrl}
              alt={
                selectedPhoto.title || "SAC Gallery Photograph"
              }
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {(selectedPhoto.title ||
              selectedPhoto.description) && (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/95 p-5">
                {selectedPhoto.title && (
                  <h3 className="text-xl font-bold text-white">
                    {selectedPhoto.title}
                  </h3>
                )}

                {selectedPhoto.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}