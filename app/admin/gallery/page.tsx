"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  event_date: string | null;
  images: string[] | null;
  image: string | null;
};

type GalleryPhoto = {
  url: string;
  title: string;
  date: string | null;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] =
    useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadGallery() {
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("id,title,event_date,images,image")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Gallery load error:", error);
      setPhotos([]);
      setLoading(false);
      return;
    }

    const allPhotos: GalleryPhoto[] = [];

    ((data || []) as EventItem[]).forEach((event) => {
      let eventImages: string[] = [];

      if (Array.isArray(event.images)) {
        eventImages = event.images.filter(
          (url) => typeof url === "string" && url.trim() !== ""
        );
      }

      if (
        eventImages.length === 0 &&
        event.image &&
        typeof event.image === "string"
      ) {
        eventImages = [event.image];
      }

      eventImages.forEach((url) => {
        allPhotos.push({
          url,
          title: event.title,
          date: event.event_date,
        });
      });
    });

    setPhotos(allPhotos);
    setCurrentIndex((current) =>
      allPhotos.length === 0
        ? 0
        : Math.min(current, allPhotos.length - 1)
    );
    setLoading(false);
  }

  useEffect(() => {
    loadGallery();

    const channel = supabase
      .channel("public-gallery-events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
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
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % photos.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [photos.length]);

  useEffect(() => {
    if (!selectedPhoto) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  function formatDate(date: string | null) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="h-[76px]" />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-slate-400">
              Loading gallery...
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-slate-400">
              No event photos yet.
            </p>
          </div>
        ) : (
          <>
            {/* SLIDESHOW */}
            <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="relative aspect-[16/9] w-full">
                {photos.map((photo, index) => (
                  <button
                    key={`${photo.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                      index === currentIndex
                        ? "z-10 opacity-100"
                        : "z-0 opacity-0"
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-6 pb-6 pt-16 text-left">
                      <h2 className="text-xl font-bold sm:text-2xl">
                        {photo.title}
                      </h2>

                      {photo.date && (
                        <p className="mt-1 text-sm text-slate-300">
                          {formatDate(photo.date)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="absolute bottom-4 right-5 z-20 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>

            {/* GALLERY GRID */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {photos.map((photo, index) => (
                <button
                  key={`${photo.url}-grid-${index}`}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8 text-left opacity-0 transition group-hover:opacity-100">
                    <p className="truncate text-sm font-semibold">
                      {photo.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FULLSCREEN IMAGE */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-2xl text-white backdrop-blur hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>

          <div
            className="relative flex max-h-[95vh] max-w-7xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      <footer className="mt-12 border-t border-white/10 bg-slate-950 px-5 py-8 text-center text-sm text-slate-500">
        Government Engineering College Sheohar — Student Activity Council
      </footer>
    </main>
  );
}