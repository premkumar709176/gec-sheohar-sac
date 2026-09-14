
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);

  async function loadGallery() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const list: Photo[] = [];

    for (const item of data || []) {
      const image =
        item.image_url ||
        item.photo_url ||
        item.imageUrl ||
        item.photoUrl ||
        item.image ||
        item.photo ||
        item.url ||
        item.src ||
        "";

      if (!image) continue;

      list.push({
        id: String(item.id),
        imageUrl: String(image),
        title: String(item.title || item.name || ""),
        description: String(item.description || ""),
      });
    }

    setPhotos(list);
    setLoading(false);
  }

  useEffect(() => {
    loadGallery();

    const channel = supabase
      .channel("gallery-live")
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
    if (photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % photos.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [photos.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="h-[76px]" />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="text-lg font-semibold">
              Loading Gallery...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="h-[76px]" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <h1 className="mb-8 text-center text-4xl font-bold sm:text-5xl">
          Gallery
        </h1>

        {photos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">
            <p className="text-lg font-semibold">
              No photos yet
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Photos added from the Admin Gallery will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-12 max-w-5xl">
              <div
                className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900"
                onClick={() => setSelected(photos[current])}
              >
                <img
                  src={photos[current].imageUrl}
                  alt={photos[current].title || "SAC Gallery"}
                  className="h-full w-full cursor-pointer object-cover"
                />

                {photos[current].title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4">
                    <h2 className="text-xl font-bold">
                      {photos[current].title}
                    </h2>

                    {photos[current].description && (
                      <p className="mt-1 text-sm text-slate-200">
                        {photos[current].description}
                      </p>
                    )}
                  </div>
                )}

                <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm">
                  {current + 1} / {photos.length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setSelected(photo)}
                  className="group aspect-square overflow-hidden rounded-xl bg-slate-900"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title || "SAC Gallery Photo"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="mt-16 border-t border-white/10 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <img
            src="/sac-logo.jpg"
            alt="Student Activity Council"
            className="mx-auto h-12 w-12 rounded-full object-cover"
          />

          <p className="mt-3 font-bold">
            Student Activity Council
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Government Engineering College Sheohar
          </p>
        </div>
      </footer>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 text-4xl text-white"
          >
            ×
          </button>

          <img
            src={selected.imageUrl}
            alt={selected.title || "SAC Gallery Photo"}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}