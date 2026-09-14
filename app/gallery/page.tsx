"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  event_date: string | null;
  images: unknown;
  image: string | null;
};

type GalleryPhoto = {
  id: string;
  url: string;
  title: string;
  date: string | null;
};

function getImageUrls(images: unknown, image: string | null): string[] {
  if (Array.isArray(images)) {
    return images.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    );
  }

  if (typeof images === "string" && images.trim()) {
    try {
      const parsed = JSON.parse(images);

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        );
      }
    } catch {
      return [images];
    }
  }

  if (image && image.trim()) {
    return [image];
  }

  return [];
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] =
    useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadGallery() {
    const { data, error } = await supabase
      .from("events")
      .select("id,title,event_date,images,image")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Gallery error:", error);
      setLoading(false);
      return;
    }

    const galleryPhotos: GalleryPhoto[] = [];

    (data as EventItem[] | null)?.forEach((event) => {
      const urls = getImageUrls(event.images, event.image);

      urls.forEach((url, index) => {
        galleryPhotos.push({
          id: `${event.id}-${index}`,
          url,
          title: event.title,
          date: event.event_date,
        });
      });
    });

    setPhotos(galleryPhotos);
    setCurrentIndex(0);
    setLoading(false);
  }

  useEffect(() => {
    loadGallery();

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

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % photos.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
            <p className="text-slate-400">Loading gallery...</p>
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

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="relative aspect-[16/9] w-full">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
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

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-20 text-left">
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

              <div className="absolute bottom-4 right-5 z-20 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
                {currentIndex + 1} / {photos.length}
              </div>
            </div>

            {/* ALL PHOTOS */}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {photos.map((photo) => (
                <button
                  key={`grid-${photo.id}`}
                  type="button"
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FULLSCREEN */}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-3xl text-white hover:bg-white/20"
          >
            ×
          </button>

          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.title}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <footer className="mt-12 border-t border-white/10 bg-slate-950 px-5 py-8 text-center text-sm text-slate-500">
        Government Engineering College Sheohar — Student Activity Council
      </footer>
    </main>
  );
}