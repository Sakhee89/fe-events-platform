import { useSession } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { getEventsbyAttendee } from "../../utils/backendApiUtils";
import { Event } from "../../types/types";
import UpcomingEventCard from "./UpcomingEventCard";

const UserSubscribedEvents = () => {
  const session = useSession();
  const [eventsByAttendee, setEventsByAttendee] = useState<Event[]>([]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await getEventsbyAttendee(session.access_token);
        setEventsByAttendee(res.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [session]);

  return (
    <div>
      {eventsByAttendee ? (
        <div>
          <div className="pb-5 pt-1">
            <h1 className="text-2xl">Upcoming event</h1>
          </div>
          <div className="grid grid-cols-1 p-1">
            {eventsByAttendee
              .sort((a, b) => {
                return a.date < b.date ? -1 : 1;
              })
              .map((event) => (
                <div key={event._id}>
                  <UpcomingEventCard event={event} />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <>You're not subscribed to any events</>
      )}
    </div>
  );
};

export default UserSubscribedEvents;
