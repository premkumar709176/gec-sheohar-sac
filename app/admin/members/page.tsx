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
    <main className="min-h-screen bg-[#f8f6f0] text-[#172033]">
      <header className="sticky top-0 z-50 border-b border-[#e4e7ec] bg-[#f8f6f0]/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f47b20]">
              SAC Admin
            </p>

            <h1 className="text-xl font-black text-[#1746a2] sm:text-2xl">
              Members Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-bold text-[#1746a2] transition hover:border-[#1746a2]/30 hover:bg-[#eaf1ff]"
            >
              Dashboard
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/admin/login";
              }}
              className="rounded-xl bg-[#f47b20] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d96512] hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="college-pattern mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="college-card blue-glow mb-10 p-5 sm:p-7">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-1.5 text-xs font-bold text-[#1746a2]">
                <span className="h-2 w-2 rounded-full bg-[#f47b20]" />
                Member Directory
              </div>

              <h2 className="text-2xl font-black text-[#172033]">
                {editingId ? "Edit Member" : "Add New Member"}
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
                Manage member information, photos and social media profiles.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-2.5 text-sm font-bold text-[#1746a2] transition hover:bg-[#eaf1ff]"
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
                  className="mb-2 block text-sm font-bold text-[#172033]"
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
                  className="block w-full rounded-xl border border-[#e4e7ec] bg-white px-3 py-3 text-sm text-[#667085] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1746a2] file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-[#103575]"
                />

                {existingPhoto && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#eaf1ff] p-3">
                    <img
                      src={existingPhoto}
                      alt="Current member"
                      className="h-16 w-16 rounded-xl object-cover ring-1 ring-[#1746a2]/10"
                    />

                    <span className="text-xs font-semibold text-[#667085]">
                      Current photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1746a2]/10 bg-[#eaf1ff]/60 p-5">
              <h3 className="mb-4 text-lg font-black text-[#1746a2]">
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
              className="w-full rounded-xl bg-[#1746a2] px-5 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#103575] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="text-sm font-black uppercase tracking-wider text-[#f47b20]">
                Directory
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#172033]">
                All Members
              </h2>

              <p className="mt-1 text-sm text-[#667085]">
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
                className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none placeholder:text-[#98a2b3] focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10 sm:w-72"
              />

              <button
                onClick={loadMembers}
                className="rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm font-bold text-[#1746a2] transition hover:bg-[#eaf1ff]"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="college-card p-10 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#1746a2]/20 border-t-[#1746a2]" />
              <p className="font-semibold text-[#667085]">
                Loading members...
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="college-card p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl">
                👥
              </div>

              <p className="mt-5 text-lg font-black text-[#172033]">
                No members found
              </p>

              <p className="mt-2 text-sm text-[#667085]">
                Add a member using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="college-card overflow-hidden"
                >
                  <div className="relative h-56 bg-[#eaf1ff]">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-7xl font-black text-[#1746a2]/25">
                        {member.name?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    {member.position && (
                      <div className="absolute left-3 top-3 rounded-full bg-[#1746a2] px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        {member.position}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-[#172033]">
                          {member.name}
                        </h3>

                        {member.club && (
                          <p className="mt-1 text-sm font-bold text-[#1746a2]">
                            {member.club}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 rounded-xl bg-[#fff1e6] px-3 py-1.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                          Order
                        </p>

                        <p className="text-lg font-black text-[#f47b20]">
                          {member.display_order ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-[#667085]">
                      {member.reg_no && (
                        <p>
                          <span className="font-semibold text-[#172033]">
                            Reg. No:
                          </span>{" "}
                          {member.reg_no}
                        </p>
                      )}

                      {member.branch && (
                        <p>
                          <span className="font-semibold text-[#172033]">
                            Branch:
                          </span>{" "}
                          {member.branch}
                        </p>
                      )}

                      {member.year_semester && (
                        <p>
                          <span className="font-semibold text-[#172033]">
                            Year:
                          </span>{" "}
                          {member.year_semester}
                        </p>
                      )}

                      {member.email && (
                        <p className="break-all">
                          <span className="font-semibold text-[#172033]">
                            Email:
                          </span>{" "}
                          {member.email}
                        </p>
                      )}

                      {member.phone && (
                        <p>
                          <span className="font-semibold text-[#172033]">
                            Phone:
                          </span>{" "}
                          {member.phone}
                        </p>
                      )}
                    </div>

                    {member.skill && (
                      <div className="mt-4 rounded-xl bg-[#f8f6f0] p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                          Skills
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#172033]">
                          {member.skill}
                        </p>
                      </div>
                    )}

                    {(member.instagram || member.linkedin) && (
                      <div className="mt-4 flex gap-2">
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-xl border border-[#e4e7ec] bg-[#fff1e6] px-3 py-2 text-center text-xs font-bold text-[#d96512] transition hover:bg-[#f47b20] hover:text-white"
                          >
                            Instagram
                          </a>
                        )}

                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-xl border border-[#1746a2]/15 bg-[#eaf1ff] px-3 py-2 text-center text-xs font-bold text-[#1746a2] transition hover:bg-[#1746a2] hover:text-white"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}

                    {member.bio && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#667085]">
                        {member.bio}
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => startEdit(member)}
                        className="flex-1 rounded-xl border border-[#1746a2]/15 bg-[#eaf1ff] px-4 py-2.5 text-sm font-bold text-[#1746a2] transition hover:bg-[#1746a2] hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMember(member)}
                        disabled={deletingId === member.id}
                        className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
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
      <label className="mb-2 block text-sm font-bold text-[#172033]">
        {label}
      </label>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none placeholder:text-[#98a2b3] transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
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
      <label className="mb-2 block text-sm font-bold text-[#172033]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
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
      <label className="mb-2 block text-sm font-bold text-[#172033]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-xl border border-[#e4e7ec] bg-white px-4 py-3 text-sm leading-6 text-[#172033] outline-none placeholder:text-[#98a2b3] transition focus:border-[#1746a2] focus:ring-4 focus:ring-[#1746a2]/10"
      />
    </div>
  );
}