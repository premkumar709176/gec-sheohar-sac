"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type EventItem = {
  id: string;
  title: string;
  category: string | null;
  event_date: string | null;
  venue: string | null;
  organizer: string | null;
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
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] =
    useState<EventItem | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);

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
        collaboration_details
      `)
      .order("display_order", {
        ascending: true,
      })
      .order("event_date", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setEvents((data || []) as EventItem[]);
    setLoading(false);
  }

  useEffect(() => {
    const channel = supabase
      .channel("public-events-realtime")
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

  function formatDate(date: string | null) {
    if (!date) return "Date not announced";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const upcomingEvents = events.filter(
    (event) =>
      event.status === "Upcoming" ||
      event.status === "Ongoing"
  );

  const completedEvents = events.filter(
    (event) => event.status === "Completed"
  );

  const cancelledEvents = events.filter(
    (event) => event.status === "Cancelled"
  );

  function EventCard({
    event,
    completed = false,
  }: {
    event: EventItem;
    completed?: boolean;
  }) {
    return (
      <article className="group overflow-hidden rounded-3xl border border-[#e4e7ec] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1746a2]/20 hover:shadow-xl">
        <button
          type="button"
          onClick={() => setSelectedEvent(event)}
          className="block w-full text-left"
        >
          <div className="relative overflow-hidden bg-[#eaf1ff]">
            {event.poster ? (
              <img
                src={event.poster}
                alt={event.title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-[#eaf1ff] text-[#667085]">
                No event poster
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold shadow ${
                  event.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : event.status === "Cancelled"
                    ? "bg-red-600 text-white"
                    : event.status === "Ongoing"
                    ? "bg-[#f47b20] text-white"
                    : "bg-[#1746a2] text-white"
                }`}
              >
                {event.status || "Upcoming"}
              </span>

              {event.category && (
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#172033] shadow">
                  {event.category}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-[#172033] transition group-hover:text-[#1746a2]">
              {event.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-[#667085]">
              <p>
                <span className="font-semibold text-[#172033]">
                  Date:
                </span>{" "}
                {formatDate(event.event_date)}
              </p>

              {event.venue && (
                <p>
                  <span className="font-semibold text-[#172033]">
                    Venue:
                  </span>{" "}
                  {event.venue}
                </p>
              )}

              <p>
                <span className="font-semibold text-[#172033]">
                  Conducted by:
                </span>{" "}
                {event.conducted_by || "Whole SAC"}
              </p>

              {event.organizing_club && (
                <p>
                  <span className="font-semibold text-[#172033]">
                    Club:
                  </span>{" "}
                  {event.organizing_club}
                </p>
              )}

              {event.collaborating_clubs &&
                event.collaborating_clubs.length > 0 && (
                  <p>
                    <span className="font-semibold text-[#172033]">
                      Clubs:
                    </span>{" "}
                    {event.collaborating_clubs.join(", ")}
                  </p>
                )}
            </div>

            {event.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#667085]">
                {event.description}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-bold text-[#1746a2]">
                {completed
                  ? "View event gallery →"
                  : "View event details →"}
              </span>

              {completed &&
                event.images &&
                event.images.length > 0 && (
                  <span className="text-xs font-medium text-[#667085]">
                    {event.images.length} photos
                  </span>
                )}
            </div>
          </div>
        </button>

        {!completed && event.registration_link && (
          <div className="border-t border-[#e4e7ec] px-6 pb-6">
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-xl bg-[#f47b20] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#d96512] hover:shadow-lg"
            >
              Register Now
            </a>
          </div>
        )}
      </article>
    );
  }

  function EventSection({
    title,
    subtitle,
    items,
    completed = false,
  }: {
    title: string;
    subtitle: string;
    items: EventItem[];
    completed?: boolean;
  }) {
    if (items.length === 0) return null;

    return (
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 h-1 w-12 rounded-full bg-[#f47b20]" />

          <h2 className="text-3xl font-bold text-[#172033] md:text-4xl">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-[#667085]">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              completed={completed}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0]">
      <div className="h-[76px]" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e4e7ec] bg-[#f8f6f0] px-6 py-24 lg:px-8">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#1746a2]/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-[#f47b20]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 inline-flex rounded-full border border-[#1746a2]/15 bg-[#eaf1ff] px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#1746a2]">
            Student Activity Council
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#172033] md:text-6xl">
            Events, Activities &
            <span className="gradient-text"> Experiences</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">
            Discover upcoming opportunities and explore
            memories from events conducted by the Student
            Activity Council and its clubs.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-[#1746a2]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1746a2] shadow-sm">
              Workshops
            </div>
            <div className="rounded-full border border-[#f47b20]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#d96512] shadow-sm">
              Competitions
            </div>
            <div className="rounded-full border border-[#1746a2]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1746a2] shadow-sm">
              Seminars
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center bg-[#f8f6f0]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eaf1ff] border-t-[#1746a2]" />
            <p className="font-medium text-[#667085]">
              Loading events...
            </p>
          </div>
        </div>
      ) : (
        <>
          <EventSection
            title="Upcoming Events"
            subtitle="Stay updated with workshops, competitions, seminars and other upcoming SAC activities."
            items={upcomingEvents}
          />

          <EventSection
            title="Completed Events"
            subtitle="Explore posters and photographs from events that have already taken place."
            items={completedEvents}
            completed
          />

          <EventSection
            title="Cancelled Events"
            subtitle="Events that have been cancelled or postponed."
            items={cancelledEvents}
          />

          {events.length === 0 && (
            <section className="mx-auto max-w-3xl px-6 py-24 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eaf1ff] text-[#1746a2]">
                <svg
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M16 2v4M8 2v4M3 9h18" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-[#172033]">
                No events available
              </h2>

              <p className="mt-3 text-[#667085]">
                Events will appear here when they are added by
                the SAC administration.
              </p>
            </section>
          )}
        </>
      )}

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#172033]/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="mx-auto my-8 max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#e4e7ec] bg-[#f8f6f0] px-6 py-5">
              <div className="pr-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-bold text-[#1746a2]">
                    {selectedEvent.status || "Upcoming"}
                  </span>

                  {selectedEvent.category && (
                    <span className="rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold text-[#d96512]">
                      {selectedEvent.category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-[#172033]">
                  {selectedEvent.title}
                </h2>

                <p className="mt-1 text-sm text-[#667085]">
                  {formatDate(selectedEvent.event_date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-[#667085] shadow-sm transition hover:bg-[#eaf1ff] hover:text-[#1746a2]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6 md:p-8">
              {selectedEvent.poster && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-bold text-[#172033]">
                    Event Poster
                  </h3>

                  <div className="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-2">
                    <img
                      src={selectedEvent.poster}
                      alt={selectedEvent.title}
                      className="mx-auto max-h-[600px] w-full rounded-xl object-contain"
                    />
                  </div>
                </div>
              )}

              {/* DETAILS */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-5">
                  <h3 className="mb-4 font-bold text-[#172033]">
                    Event Details
                  </h3>

                  <div className="space-y-3 text-sm text-[#667085]">
                    <p>
                      <strong className="text-[#172033]">
                        Date:
                      </strong>{" "}
                      {formatDate(selectedEvent.event_date)}
                    </p>

                    {selectedEvent.venue && (
                      <p>
                        <strong className="text-[#172033]">
                          Venue:
                        </strong>{" "}
                        {selectedEvent.venue}
                      </p>
                    )}

                    {selectedEvent.organizer && (
                      <p>
                        <strong className="text-[#172033]">
                          Organizer:
                        </strong>{" "}
                        {selectedEvent.organizer}
                      </p>
                    )}

                    <p>
                      <strong className="text-[#172033]">
                        Conducted By:
                      </strong>{" "}
                      {selectedEvent.conducted_by || "Whole SAC"}
                    </p>

                    {selectedEvent.organizing_club && (
                      <p>
                        <strong className="text-[#172033]">
                          Organizing Club:
                        </strong>{" "}
                        {selectedEvent.organizing_club}
                      </p>
                    )}

                    {selectedEvent.club_head && (
                      <p>
                        <strong className="text-[#172033]">
                          Club Head:
                        </strong>{" "}
                        {selectedEvent.club_head}
                      </p>
                    )}

                    {selectedEvent.club_coordinator && (
                      <p>
                        <strong className="text-[#172033]">
                          Club Coordinator:
                        </strong>{" "}
                        {selectedEvent.club_coordinator}
                      </p>
                    )}

                    {selectedEvent.collaborating_clubs &&
                      selectedEvent.collaborating_clubs.length > 0 && (
                        <div>
                          <strong className="text-[#172033]">
                            Collaborating Clubs:
                          </strong>

                          <p className="mt-1">
                            {selectedEvent.collaborating_clubs.join(", ")}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {(selectedEvent.contact_name ||
                  selectedEvent.contact_email ||
                  selectedEvent.contact_phone) && (
                  <div className="rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0] p-5">
                    <h3 className="mb-4 font-bold text-[#172033]">
                      Contact
                    </h3>

                    <div className="space-y-3 text-sm text-[#667085]">
                      {selectedEvent.contact_name && (
                        <p>
                          <strong className="text-[#172033]">
                            Name:
                          </strong>{" "}
                          {selectedEvent.contact_name}
                        </p>
                      )}

                      {selectedEvent.contact_email && (
                        <p>
                          <strong className="text-[#172033]">
                            Email:
                          </strong>{" "}
                          {selectedEvent.contact_email}
                        </p>
                      )}

                      {selectedEvent.contact_phone && (
                        <p>
                          <strong className="text-[#172033]">
                            Phone:
                          </strong>{" "}
                          {selectedEvent.contact_phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              {selectedEvent.description && (
                <div className="mt-8">
                  <div className="mb-3 h-1 w-10 rounded-full bg-[#f47b20]" />

                  <h3 className="text-lg font-bold text-[#172033]">
                    About the Event
                  </h3>

                  <p className="mt-3 leading-7 text-[#667085]">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* COLLABORATION */}
              {selectedEvent.collaboration_details && (
                <div className="mt-8 rounded-2xl border border-[#f47b20]/20 bg-[#fff1e6] p-5">
                  <h3 className="mb-2 font-bold text-[#d96512]">
                    Collaboration Details
                  </h3>

                  <p className="leading-7 text-[#8a4a1c]">
                    {selectedEvent.collaboration_details}
                  </p>
                </div>
              )}

              {/* PHOTOS */}
              {selectedEvent.images &&
                selectedEvent.images.length > 0 && (
                  <div className="mt-10">
                    <div className="mb-5 flex items-end justify-between gap-4">
                      <div>
                        <div className="mb-3 h-1 w-10 rounded-full bg-[#f47b20]" />

                        <h3 className="text-xl font-bold text-[#172033]">
                          Event Photos
                        </h3>
                      </div>

                      <span className="text-sm font-semibold text-[#667085]">
                        {selectedEvent.images.length} photos
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedEvent.images.map(
                        (image, index) => (
                          <a
                            key={`${image}-${index}`}
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group overflow-hidden rounded-2xl border border-[#e4e7ec] bg-[#f8f6f0]"
                          >
                            <img
                              src={image}
                              alt={`${selectedEvent.title} photo ${
                                index + 1
                              }`}
                              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* REGISTRATION */}
              {selectedEvent.registration_link && (
                <div className="mt-10">
                  <a
                    href={selectedEvent.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl bg-[#f47b20] px-6 py-4 text-center font-bold text-white shadow-md transition hover:bg-[#d96512] hover:shadow-lg"
                  >
                    Register for this Event
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 border-t border-[#e4e7ec] bg-[#172033] px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 h-1 w-12 rounded-full bg-[#f47b20]" />

              <h3 className="text-xl font-bold">
                Student Activity Council
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Government Engineering College Sheohar, Bihar
              </p>
            </div>

            <p className="text-sm text-slate-400">
              Events • Activities • Experiences
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-400">
            © {new Date().getFullYear()} Student Activity
            Council. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}