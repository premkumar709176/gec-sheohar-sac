"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  position: string | null;
  branch: string | null;
  year_semester: string | null;
  reg_no: string | null;
  club: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  skill: string | null;
  photo: string | null;
  instagram: string | null;
  linkedin: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type MemberForm = {
  name: string;
  position: string;
  branch: string;
  year_semester: string;
  reg_no: string;
  club: string;
  email: string;
  phone: string;
  bio: string;
  skill: string;
  instagram: string;
  linkedin: string;
  display_order: string;
};

const clubs = [
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
];

const emptyForm: MemberForm = {
  name: "",
  position: "",
  branch: "",
  year_semester: "",
  reg_no: "",
  club: "",
  email: "",
  phone: "",
  bio: "",
  skill: "",
  instagram: "",
  linkedin: "",
  display_order: "",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    setLoading(true);
    setError("");

    try {
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

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        window.location.href = "/admin";
        return;
      }

      await loadMembers();
    } catch (err: any) {
      setError(err?.message || "Unable to load members.");
      setLoading(false);
    }
  }

  async function loadMembers() {
    setLoading(true);
    setError("");

    const { data, error: membersError } = await supabase
      .from("members")
      .select(
        "id,name,position,branch,year_semester,reg_no,club,email,phone,bio,skill,photo,instagram,linkedin,display_order,created_at,updated_at"
      )
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (membersError) {
      setError(membersError.message);
      setLoading(false);
      return;
    }

    setMembers((data || []) as Member[]);
    setLoading(false);
  }

  function updateForm(field: keyof MemberForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function startEdit(member: Member) {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      position: member.position || "",
      branch: member.branch || "",
      year_semester: member.year_semester || "",
      reg_no: member.reg_no || "",
      club: member.club || "",
      email: member.email || "",
      phone: member.phone || "",
      bio: member.bio || "",
      skill: member.skill || "",
      instagram: member.instagram || "",
      linkedin: member.linkedin || "",
      display_order:
        member.display_order !== null
          ? String(member.display_order)
          : "",
    });

    setExistingPhoto(member.photo || "");
    setPhotoFile(null);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setPhotoFile(null);
    setExistingPhoto("");
    setEditingId(null);
    setMessage("");
    setError("");

    const input = document.getElementById(
      "member-photo"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  async function uploadPhoto(): Promise<string | null> {
    if (!photoFile) {
      return existingPhoto || null;
    }

    const extension =
      photoFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName =
      form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "member";

    const fileName = `${safeName}-${Date.now()}.${extension}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("members")
      .upload(filePath, photoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: photoFile.type,
      });

    if (uploadError) {
      throw new Error(`Photo upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("members")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Member name is required.");
      setSaving(false);
      return;
    }

    try {
      const photoUrl = await uploadPhoto();

      const displayOrder = form.display_order.trim()
        ? Number(form.display_order)
        : null;

      if (
        displayOrder !== null &&
        (!Number.isInteger(displayOrder) || displayOrder < 1)
      ) {
        setError("Display Order must be a whole number starting from 1.");
        setSaving(false);
        return;
      }

      const memberData = {
        name: form.name.trim(),
        position: form.position.trim() || null,
        branch: form.branch.trim() || null,
        year_semester: form.year_semester.trim() || null,
        reg_no: form.reg_no.trim() || null,
        club: form.club || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        bio: form.bio.trim() || null,
        skill: form.skill.trim() || null,
        photo: photoUrl,
        instagram: form.instagram.trim() || null,
        linkedin: form.linkedin.trim() || null,
        display_order: displayOrder,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("members")
          .update(memberData)
          .eq("id", editingId);

        if (updateError) {
          throw updateError;
        }

        setMessage("Member updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("members")
          .insert(memberData);

        if (insertError) {
          throw insertError;
        }

        setMessage("Member added successfully.");
      }

      resetForm();
      await loadMembers();
    } catch (err: any) {
      setError(err?.message || "Unable to save member.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(member: Member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(member.id);
    setError("");
    setMessage("");

    try {
      if (member.photo) {
        try {
          const photoUrl = new URL(member.photo);
          const marker = "/storage/v1/object/public/members/";

          const markerIndex = photoUrl.pathname.indexOf(marker);

          if (markerIndex !== -1) {
            const filePath = decodeURIComponent(
              photoUrl.pathname.substring(
                markerIndex + marker.length
              )
            );

            if (filePath) {
              await supabase.storage.from("members").remove([filePath]);
            }
          }
        } catch {
          // Continue with database deletion.
        }
      }

      const { error: deleteError } = await supabase
        .from("members")
        .delete()
        .eq("id", member.id);

      if (deleteError) {
        throw deleteError;
      }

      setMembers((previous) =>
        previous.filter((item) => item.id !== member.id)
      );

      if (editingId === member.id) {
        resetForm();
      }

      setMessage("Member deleted successfully.");
    } catch (err: any) {
      setError(err?.message || "Unable to delete member.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return [
      member.name,
      member.position,
      member.branch,
      member.reg_no,
      member.club,
      member.email,
      member.phone,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(query)
      );
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              SAC Admin
            </p>

            <h1 className="text-xl font-bold sm:text-2xl">
              Members Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
            >
              Dashboard
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Member" : "Add New Member"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage member information, photo and social media profiles.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full Name *"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="Enter member name"
              />

              <Input
                label="Position"
                value={form.position}
                onChange={(value) => updateForm("position", value)}
                placeholder="Head / Coordinator / Member"
              />

              <Input
                label="Display Order"
                type="number"
                min="1"
                value={form.display_order}
                onChange={(value) =>
                  updateForm("display_order", value)
                }
                placeholder="1, 2, 3..."
              />

              <Input
                label="Branch"
                value={form.branch}
                onChange={(value) => updateForm("branch", value)}
                placeholder="CSE / ECE / ME / Civil..."
              />

              <Input
                label="Year / Semester"
                value={form.year_semester}
                onChange={(value) =>
                  updateForm("year_semester", value)
                }
                placeholder="2nd Year / 4th Semester"
              />

              <Input
                label="Registration Number"
                value={form.reg_no}
                onChange={(value) => updateForm("reg_no", value)}
                placeholder="24101145034"
              />

              <Select
                label="Club"
                value={form.club}
                onChange={(value) => updateForm("club", value)}
                options={clubs}
              />

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
                placeholder="member@example.com"
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) => updateForm("phone", value)}
                placeholder="+91 XXXXX XXXXX"
              />

              <Input
                label="Skills"
                value={form.skill}
                onChange={(value) => updateForm("skill", value)}
                placeholder="Coding, Photography, Design..."
              />

              <div>
                <label
                  htmlFor="member-photo"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Member Photo
                </label>

                <input
                  id="member-photo"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setPhotoFile(
                      event.target.files?.[0] || null
                    )
                  }
                  className="block w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-600"
                />

                {existingPhoto && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={existingPhoto}
                      alt="Current member"
                      className="h-16 w-16 rounded-xl object-cover ring-1 ring-white/10"
                    />

                    <span className="text-xs text-slate-400">
                      Current photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
              <h3 className="mb-4 text-lg font-bold text-cyan-300">
                Social Media
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Instagram Profile"
                  value={form.instagram}
                  onChange={(value) =>
                    updateForm("instagram", value)
                  }
                  placeholder="https://instagram.com/username"
                />

                <Input
                  label="LinkedIn Profile"
                  value={form.linkedin}
                  onChange={(value) =>
                    updateForm("linkedin", value)
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <TextArea
              label="Bio / About Member"
              value={form.bio}
              onChange={(value) => updateForm("bio", value)}
              placeholder="Short introduction about the member..."
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-cyan-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Member"
                : "Add Member"}
            </button>
          </form>
        </section>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                All Members
              </h2>

              <p className="text-sm text-slate-400">
                {filteredMembers.length} member
                {filteredMembers.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search members..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 sm:w-72"
              />

              <button
                onClick={loadMembers}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center text-slate-400">
              Loading members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <p className="text-lg font-semibold text-slate-200">
                No members found
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Add a member using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl"
                >
                  <div className="relative h-56 bg-slate-900">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl font-black text-cyan-500/30">
                        {member.name?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    {member.position && (
                      <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur">
                        {member.position}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-white">
                          {member.name}
                        </h3>

                        {member.club && (
                          <p className="mt-1 text-sm font-medium text-cyan-400">
                            {member.club}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Order
                        </p>

                        <p className="text-lg font-black text-cyan-300">
                          {member.display_order ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      {member.reg_no && (
                        <p>
                          <span className="text-slate-500">
                            Reg. No:
                          </span>{" "}
                          {member.reg_no}
                        </p>
                      )}

                      {member.branch && (
                        <p>
                          <span className="text-slate-500">
                            Branch:
                          </span>{" "}
                          {member.branch}
                        </p>
                      )}

                      {member.year_semester && (
                        <p>
                          <span className="text-slate-500">
                            Year:
                          </span>{" "}
                          {member.year_semester}
                        </p>
                      )}

                      {member.email && (
                        <p className="break-all">
                          <span className="text-slate-500">
                            Email:
                          </span>{" "}
                          {member.email}
                        </p>
                      )}

                      {member.phone && (
                        <p>
                          <span className="text-slate-500">
                            Phone:
                          </span>{" "}
                          {member.phone}
                        </p>
                      )}
                    </div>

                    {member.skill && (
                      <div className="mt-4 rounded-xl bg-white/[0.04] p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Skills
                        </p>

                        <p className="mt-1 text-sm text-slate-300">
                          {member.skill}
                        </p>
                      </div>
                    )}

                    {(member.instagram ||
                      member.linkedin) && (
                      <div className="mt-4 flex gap-2">
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-lg border border-pink-400/20 bg-pink-500/10 px-3 py-2 text-center text-xs font-semibold text-pink-300 transition hover:bg-pink-500/20"
                          >
                            Instagram
                          </a>
                        )}

                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-center text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}

                    {member.bio && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                        {member.bio}
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => startEdit(member)}
                        className="flex-1 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMember(member)}
                        disabled={
                          deletingId === member.id
                        }
                        className="flex-1 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {deletingId === member.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
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

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
      />
    </div>
  );
}

function Select({
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
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
      >
        <option value="">Select club</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
      />
    </div>
  );
}