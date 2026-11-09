import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Page = async () => {
  'use cache'
  cacheLife('hours')

  const response = await fetch(`${BASE_URL}/api/events`, {});

  // The API responds with { message, data }, so the events array is under `data`.
  const { data: events } = await response.json();

  //console.log("events from page.tsx", events);

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
        <h3>Featured Events...</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
