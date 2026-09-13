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
      <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

        <button
          type="button"
          onClick={() => setSelectedEvent(event)}
          className="block w-full text-left"
        >
          <div className="relative overflow-hidden bg-slate-100">

            {event.poster ? (
              <img
                src={event.poster}
                alt={event.title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-slate-100 text-slate-400">
                No event poster
              </div>
            )}

            <div className="absolute left-4 top-4 flex gap-2">

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold shadow ${
                  event.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : event.status === "Cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {event.status || "Upcoming"}
              </span>

              {event.category && (
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                  {event.category}
                </span>
              )}

            </div>
          </div>

          <div className="p-6">

            <h3 className="text-xl font-bold text-slate-900">
              {event.title}
            </h3>

            <div className="mt-4 space-y-2 text-sm text-slate-600">

              <p>
                <span className="font-semibold">
                  Date:
                </span>{" "}
                {formatDate(event.event_date)}
              </p>

              {event.venue && (
                <p>
                  <span className="font-semibold">
                    Venue:
                  </span>{" "}
                  {event.venue}
                </p>
              )}

              <p>
                <span className="font-semibold">
                  Conducted by:
                </span>{" "}
                {event.conducted_by || "Whole SAC"}
              </p>

              {event.organizing_club && (
                <p>
                  <span className="font-semibold">
                    Club:
                  </span>{" "}
                  {event.organizing_club}
                </p>
              )}

              {event.collaborating_clubs &&
                event.collaborating_clubs.length > 0 && (
                  <p>
                    <span className="font-semibold">
                      Clubs:
                    </span>{" "}
                    {event.collaborating_clubs.join(", ")}
                  </p>
                )}

            </div>

            {event.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                {event.description}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between">

              <span className="text-sm font-semibold text-blue-600">
                {completed
                  ? "View event gallery →"
                  : "View event details →"}
              </span>

              {completed &&
                event.images &&
                event.images.length > 0 && (
                  <span className="text-xs text-slate-500">
                    {event.images.length} photos
                  </span>
                )}

            </div>

          </div>
        </button>

        {!completed && event.registration_link && (
          <div className="border-t border-slate-100 px-6 pb-6">
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
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
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-slate-500">
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
    <main className="min-h-screen bg-slate-50">

      {/* ================= TOP SPACING FOR COMMON NAVBAR ================= */}
      <div className="h-[76px]" />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.35),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl">

          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
            Student Activity Council
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Events, Activities &
            <span className="text-blue-500">
              {" "}
              Experiences
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover upcoming opportunities and explore
            memories from events conducted by the Student
            Activity Council and its clubs.
          </p>

        </div>

      </section>

      {/* ================= EVENTS ================= */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center text-slate-500">
          Loading events...
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

              <h2 className="text-2xl font-bold text-slate-900">
                No events available
              </h2>

              <p className="mt-3 text-slate-500">
                Events will appear here when they are added by
                the SAC administration.
              </p>

            </section>
          )}
        </>
      )}

      {/* ================= EVENT MODAL ================= */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >

          <div
            className="mx-auto my-8 max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedEvent.title}
                </h2>

                <p className="text-sm text-slate-500">
                  {formatDate(selectedEvent.event_date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-xl text-slate-700 hover:bg-slate-200"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">

              {selectedEvent.poster && (
                <div className="mb-8">

                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Event Poster
                  </h3>

                  <img
                    src={selectedEvent.poster}
                    alt={selectedEvent.title}
                    className="mx-auto max-h-[600px] w-full rounded-2xl bg-slate-100 object-contain"
                  />

                </div>
              )}

              {/* DETAILS */}
              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <h3 className="mb-4 font-bold text-slate-900">
                    Event Details
                  </h3>

                  <div className="space-y-3 text-sm text-slate-600">

                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(selectedEvent.event_date)}
                    </p>

                    {selectedEvent.venue && (
                      <p>
                        <strong>Venue:</strong>{" "}
                        {selectedEvent.venue}
                      </p>
                    )}

                    {selectedEvent.organizer && (
                      <p>
                        <strong>Organizer:</strong>{" "}
                        {selectedEvent.organizer}
                      </p>
                    )}

                    <p>
                      <strong>Conducted By:</strong>{" "}
                      {selectedEvent.conducted_by || "Whole SAC"}
                    </p>

                    {selectedEvent.organizing_club && (
                      <p>
                        <strong>Organizing Club:</strong>{" "}
                        {selectedEvent.organizing_club}
                      </p>
                    )}

                    {selectedEvent.club_head && (
                      <p>
                        <strong>Club Head:</strong>{" "}
                        {selectedEvent.club_head}
                      </p>
                    )}

                    {selectedEvent.club_coordinator && (
                      <p>
                        <strong>Club Coordinator:</strong>{" "}
                        {selectedEvent.club_coordinator}
                      </p>
                    )}

                    {selectedEvent.collaborating_clubs &&
                      selectedEvent.collaborating_clubs.length > 0 && (
                        <div>
                          <strong>
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
                  <div className="rounded-2xl bg-slate-50 p-5">

                    <h3 className="mb-4 font-bold text-slate-900">
                      Contact
                    </h3>

                    <div className="space-y-3 text-sm text-slate-600">

                      {selectedEvent.contact_name && (
                        <p>
                          <strong>Name:</strong>{" "}
                          {selectedEvent.contact_name}
                        </p>
                      )}

                      {selectedEvent.contact_email && (
                        <p>
                          <strong>Email:</strong>{" "}
                          {selectedEvent.contact_email}
                        </p>
                      )}

                      {selectedEvent.contact_phone && (
                        <p>
                          <strong>Phone:</strong>{" "}
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

                  <h3 className="mb-3 text-lg font-bold text-slate-900">
                    About the Event
                  </h3>

                  <p className="leading-7 text-slate-600">
                    {selectedEvent.description}
                  </p>

                </div>
              )}

              {/* COLLABORATION */}
              {selectedEvent.collaboration_details && (
                <div className="mt-8 rounded-2xl bg-purple-50 p-5">

                  <h3 className="mb-2 font-bold text-purple-900">
                    Collaboration Details
                  </h3>

                  <p className="leading-7 text-purple-800">
                    {selectedEvent.collaboration_details}
                  </p>

                </div>
              )}

              {/* PHOTOS */}
              {selectedEvent.images &&
                selectedEvent.images.length > 0 && (
                  <div className="mt-10">

                    <h3 className="mb-5 text-xl font-bold text-slate-900">
                      Event Photos
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                      {selectedEvent.images.map(
                        (image, index) => (
                          <a
                            key={`${image}-${index}`}
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group overflow-hidden rounded-2xl bg-slate-100"
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
                    className="block rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white hover:bg-blue-700"
                  >
                    Register for this Event
                  </a>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="mt-20 bg-slate-950 px-6 py-12 text-white">

        <div className="mx-auto max-w-7xl">

          <h3 className="text-xl font-bold">
            Student Activity Council
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Government Engineering College Sheohar, Bihar
          </p>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-500">
            © {new Date().getFullYear()} Student Activity
            Council. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}