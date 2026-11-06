import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

/*
const events = [
  { image: "/images/event1.jpg", title: "Event 1", slug: "event-1", location: "New York", date: "2023-08-15", time: "10:00 AM" 
   },
  { image: "/images/event2.jpg", title: "Event 2", slug: "event-2", location: "Los Angeles", date: "2023-09-20", time: "2:00 PM" },
  { image: "/images/event3.jpg", title: "Event 3", slug: "event-3", location: "Chicago", date: "2023-10-10", time: "11:00 AM" }
];*/

import { events } from "@/lib/constants";

const Page = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold underline">
       The Hub for Every Dev Event You Mustn't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, meetups, and conferences - all in one place.
      </p>
      <ExploreBtn />

      <div className="mt-20-space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
