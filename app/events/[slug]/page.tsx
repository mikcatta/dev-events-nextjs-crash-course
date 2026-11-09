import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimiliarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";

import events from "@/lib/constants";

//const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/*
const events = [
  { image: "/images/event1.jpg", title: "Event 1", slug: "event-1", location: "New York", date: "2023-08-15", time: "10:00 AM" 
   },
  { image: "/images/event2.jpg", title: "Event 2", slug: "event-2", location: "Los Angeles", date: "2023-09-20", time: "2:00 PM" },
  { image: "/images/event3.jpg", title: "Event 3", slug: "event-3", location: "Chicago", date: "2023-10-10", time: "11:00 AM" }
];*/



const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => {
  return (
    <div className="flex-row gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventsTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  'use cache'
  cacheLife('hours');
  const { slug } = await params;
  const url = `${BASE_URL}/api/events/${slug}`;
  const request = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  let event;
  try {

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch event: ${request.status}`);
    }

    //
    const response = await request.json();
    event = response.event;

    //console.log("slug from event details page", slug, url, "event", title);

    if (!event) return notFound();

  } catch (error) {
    console.error("Error fetching event details:", error);
    return notFound();
  }

  const { title, description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } = event;

  const bookings = 10;

  const similiarEvents: IEvent[] = await getSimiliarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left column */}
        <div className="content">
          <Image src={image} alt={title} width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p className="">{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="Calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="Time" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="Location" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="Audience" label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p className="">{organizer}</p>
          </section>

          <EventsTags tags={tags} />

        </div>
        {/* right column */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} who have already joined their spot!</p>
            ) : (
              <p className="text-sm">Be the first to join!</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>

      </div>

      <div className="flex-w-full flex-col gap-4 pt-20">
        <h2>Similiar Events</h2>
        <div className="events">
          {similiarEvents.length > 0 && similiarEvents.map((similiarEvent: IEvent) => (
            <EventCard key={similiarEvent.title}  {...similiarEvent} />

          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailsPage
