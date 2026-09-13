"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type GalleryItem = {
  id: number | string;
  title: string | null;
  club: string | null;
  category: string | null;
  activity_date: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  created_at: string | null;
};

type UploadPreview = {
  id: string;
  file: File;
  preview: string;
};

const clubs = [
  "SAC",
  "Bhabha (Science Club)",
  "Vishveshvaraya (Technical Club)",
  "Media Club",
  "Eco Task Force",
  "Literary & Poetry Club",
  "Social Work & Heritage Club",
  "Red Ribbon Club",
  "Electoral Literacy Club",
  "Natraj (Dance Club)",
  "Sur Sangam (Music Club)",
  "Art & Craft Club",
  "Yoga & Mental Wellness",
  "Pixel & Frame",
  "DigiCrafters",
  "Other",
];

const categories = [
  "SAC",
  "Clubs",
  "Workshops",
  "Competitions",
  "Cultural",
  "Seminars",
  "Activities",
  "Campus",
  "Other",
];

const initialForm = {
  title: "",
  club: "",
  category: "",
  activity_date: "",
  description: "",
  display_order: "0",
};

export default function AdminGalleryPage() {
  const router = useRouter();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | string | null>(
    null
  );

  const [selectedFiles, setSelectedFiles] = useState<UploadPreview[]>(
    []
  );

  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // --------------------------------------------------
  // AUTH
  // --------------------------------------------------

  useEffect(() => {
    checkAdmin();

    return () => {
      selectedFiles.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await loadGallery();
  }

  // --------------------------------------------------
  // LOAD GALLERY
  // --------------------------------------------------

  async function loadGallery() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true })
      .order("activity_date", { ascending: false });

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }

  // --------------------------------------------------
  // MULTIPLE FILE SELECTION
  // --------------------------------------------------

  function handleFilesChange(fileList: FileList | null) {
    if (!fileList) return;

    const files = Array.from(fileList);

    const validFiles = files.filter((file) => {
      const validType = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type);

      const maxSize = 10 * 1024 * 1024;

      return validType && file.size <= maxSize;
    });

    const rejectedCount = files.length - validFiles.length;

    const newPreviews: UploadPreview[] = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    if (rejectedCount > 0) {
      setError(
        `${rejectedCount} file(s) were skipped. Only JPG, PNG and WebP images up to 10 MB are allowed.`
      );
    } else {
      setError("");
    }

    setMessage("");
  }

  // --------------------------------------------------
  // REMOVE SELECTED IMAGE
  // --------------------------------------------------

  function removeSelectedFile(id: string) {
    setSelectedFiles((previous) => {
      const target = previous.find((item) => item.id === id);

      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return previous.filter((item) => item.id !== id);
    });
  }

  // --------------------------------------------------
  // CLEAR SELECTED IMAGES
  // --------------------------------------------------

  function clearSelectedFiles() {
    selectedFiles.forEach((item) => {
      URL.revokeObjectURL(item.preview);
    });

    setSelectedFiles([]);
  }

  // --------------------------------------------------
  // UPLOAD SINGLE IMAGE
  // --------------------------------------------------

  async function uploadSingleImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}-${baseName}.${extension}`;

    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error("Could not generate public image URL.");
    }

    return {
      url: data.publicUrl,
      path: filePath,
    };
  }

  // --------------------------------------------------
  // ADD MULTIPLE IMAGES
  // --------------------------------------------------

  async function handleMultipleUpload() {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a gallery title.");
      return;
    }

    setSaving(true);
    setUploading(true);
    setError("");
    setMessage("");

    setTotalUploads(selectedFiles.length);
    setUploadProgress(0);

    const uploadedPaths: string[] = [];
    const insertedIds: Array<number | string> = [];

    try {
      let completed = 0;

      for (const selected of selectedFiles) {
        try {
          const uploaded = await uploadSingleImage(selected.file);

          uploadedPaths.push(uploaded.path);

          const { data: inserted, error: insertError } =
            await supabase
              .from("gallery")
              .insert({
                title: form.title.trim(),
                club: form.club || null,
                category: form.category || null,
                activity_date: form.activity_date || null,
                description:
                  form.description.trim() || null,
                image_url: uploaded.url,
                display_order:
                  Number(form.display_order) || 0,
              })
              .select("id")
              .single();

          if (insertError) {
            // Remove uploaded file if database insertion fails.
            await supabase.storage
              .from("gallery")
              .remove([uploaded.path]);

            throw new Error(insertError.message);
          }

          if (inserted?.id !== undefined) {
            insertedIds.push(inserted.id);
          }

          completed++;

          setUploadProgress(completed);
        } catch (fileError) {
          throw new Error(
            `Failed to upload "${selected.file.name}": ${
              fileError instanceof Error
                ? fileError.message
                : "Unknown error"
            }`
          );
        }
      }

      setMessage(
        `${insertedIds.length} photo${
          insertedIds.length !== 1 ? "s" : ""
        } uploaded successfully.`
      );

      clearSelectedFiles();

      setForm(initialForm);

      await loadGallery();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  // --------------------------------------------------
  // EDIT EXISTING ITEM
  // --------------------------------------------------

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();

    if (!editingId) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      let imageUrl =
        items.find((item) => item.id === editingId)?.image_url ||
        null;

      // If a new image was selected while editing,
      // upload it and replace the old image URL.
      if (selectedFiles.length > 0) {
        const uploaded = await uploadSingleImage(
          selectedFiles[0].file
        );

        imageUrl = uploaded.url;
      }

      const { error } = await supabase
        .from("gallery")
        .update({
          title: form.title.trim(),
          club: form.club || null,
          category: form.category || null,
          activity_date: form.activity_date || null,
          description: form.description.trim() || null,
          image_url: imageUrl,
          display_order: Number(form.display_order) || 0,
        })
        .eq("id", editingId);

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Gallery item updated successfully.");

      clearSelectedFiles();

      setEditingId(null);
      setForm(initialForm);

      await loadGallery();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update gallery item."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // START EDIT
  // --------------------------------------------------

  function startEdit(item: GalleryItem) {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      club: item.club || "",
      category: item.category || "",
      activity_date: item.activity_date || "",
      description: item.description || "",
      display_order: String(item.display_order ?? 0),
    });

    clearSelectedFiles();

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --------------------------------------------------
  // DELETE ITEM
  // --------------------------------------------------

  async function deleteItem(item: GalleryItem) {
    const confirmed = window.confirm(
      `Delete "${item.title || "this gallery item"}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      // Remove image from storage.
      if (item.image_url) {
        const marker =
          "/storage/v1/object/public/gallery/";

        if (item.image_url.includes(marker)) {
          const path = decodeURIComponent(
            item.image_url.split(marker)[1]
          );

          if (path) {
            await supabase.storage
              .from("gallery")
              .remove([path]);
          }
        }
      }

      // Remove database record.
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id);

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Gallery item deleted successfully.");

      await loadGallery();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete gallery item."
      );
    }
  }

  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  function cancelEdit() {
    clearSelectedFiles();

    setEditingId(null);
    setForm(initialForm);

    setError("");
    setMessage("");
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        (item.title || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.club || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.category || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.description || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              GEC Sheohar
            </p>

            <h1 className="text-xl font-bold text-slate-900">
              SAC Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/gallery")}
              className="hidden rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:block"
            >
              View Gallery
            </button>

            <button
              onClick={logout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Administration
          </p>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Gallery Management
          </h2>

          <p className="mt-4 max-w-2xl text-slate-300">
            Upload multiple SAC activity photos at once and
            manage your complete cloud gallery.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* MESSAGES */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {/* UPLOAD / EDIT FORM */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {editingId
                  ? "Edit Gallery Item"
                  : "Upload Gallery Photos"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the gallery information or replace the image."
                  : "Select multiple photos and upload them together."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={
              editingId
                ? handleEditSubmit
                : (e) => {
                    e.preventDefault();
                    handleMultipleUpload();
                  }
            }
            className="space-y-6"
          >
            {/* MULTIPLE IMAGE SELECTOR */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                {editingId
                  ? "Replace Image"
                  : "Select Images *"}
              </label>

              <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <span className="text-5xl">📸</span>

                <span className="mt-4 text-lg font-bold text-slate-800">
                  {editingId
                    ? "Choose a new image"
                    : "Choose multiple images"}
                </span>

                <span className="mt-2 text-sm text-slate-500">
                  You can select several JPG, PNG or WebP files
                  at once.
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  Maximum 10 MB per image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple={!editingId}
                  className="hidden"
                  onChange={(e) =>
                    handleFilesChange(e.target.files)
                  }
                />
              </label>
            </div>

            {/* SELECTED IMAGES */}
            {selectedFiles.length > 0 && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Selected Photos
                    </h4>

                    <p className="text-sm text-slate-500">
                      {selectedFiles.length} photo
                      {selectedFiles.length !== 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearSelectedFiles}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                    >
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedFile(item.id)
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-90 shadow hover:bg-red-700"
                        title="Remove"
                      >
                        ×
                      </button>

                      <div className="truncate px-2 py-2 text-xs text-slate-600">
                        {item.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Title *
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Example: SAC Orientation Programme"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <p className="mt-1 text-xs text-slate-500">
                This title will be applied to all selected
                photos.
              </p>
            </div>

            {/* CLUB + CATEGORY */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Club
                </label>

                <select
                  value={form.club}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      club: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select club</option>

                  {clubs.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DATE + ORDER */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Activity Date
                </label>

                <input
                  type="date"
                  value={form.activity_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      activity_date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Same order value will be applied to all
                  selected photos.
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={4}
                placeholder="Write a short description about this activity..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PROGRESS */}
            {uploading && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-900">
                    Uploading photos...
                  </span>

                  <span className="text-sm font-bold text-blue-700">
                    {uploadProgress} / {totalUploads}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width:
                        totalUploads > 0
                          ? `${(uploadProgress / totalUploads) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={
                  saving ||
                  uploading ||
                  (!editingId && selectedFiles.length === 0)
                }
                className="rounded-xl bg-blue-600 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading
                  ? `Uploading ${uploadProgress}/${totalUploads}...`
                  : saving
                    ? "Saving..."
                    : editingId
                      ? "Update Gallery Item"
                      : `Upload ${
                          selectedFiles.length > 0
                            ? selectedFiles.length
                            : ""
                        } Photo${
                          selectedFiles.length === 1
                            ? ""
                            : "s"
                        }`}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* STATISTICS */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Photos
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {items.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Clubs Represented
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {
                new Set(
                  items
                    .map((item) => item.club)
                    .filter(Boolean)
                ).size
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {
                new Set(
                  items
                    .map((item) => item.category)
                    .filter(Boolean)
                ).size
              }
            </p>
          </div>
        </section>

        {/* SEARCH */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery..."
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* GALLERY LIST */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Gallery Items
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredItems.length} item
                {filteredItems.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={loadGallery}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="font-medium text-slate-600">
                Loading gallery...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="text-5xl">🖼️</div>

              <h4 className="mt-4 text-xl font-bold text-slate-900">
                No gallery items found
              </h4>

              <p className="mt-2 text-slate-500">
                Upload your first SAC activity photos above.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title || "Gallery image"}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🖼️
                      </div>
                    )}

                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h4 className="line-clamp-2 font-bold text-slate-900">
                      {item.title || "Untitled"}
                    </h4>

                    {item.club && (
                      <p className="mt-2 text-sm font-medium text-blue-600">
                        {item.club}
                      </p>
                    )}

                    {item.activity_date && (
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          `${item.activity_date}T00:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteItem(item)}
                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
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

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Government Engineering College
          Sheohar — Student Activity Council
        </div>
      </footer>
    </main>
  );
}