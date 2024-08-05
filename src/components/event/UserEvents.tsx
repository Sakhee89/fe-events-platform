import { useEffect, useState } from "react";
import Button from "../button/Button";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { getEventsbyUserId } from "../../utils/backendApiUtils";
import { Event } from "../../types/types";
import EventCard from "./EventCard";

const UserEvents = () => {
  const session = useSession();
  const [eventsByUser, setEventsByUser] = useState<Event[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await getEventsbyUserId(
          session.user.id,
          session.access_token
        );
        setEventsByUser(res.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session]);

  return (
    <section>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section>
          <div className="flex item- justify-between pb-5 pt-1 px-1">
            <h1 className="text-2xl">User's event</h1>
            <Link to={`/event/create`}>
              <Button label="Create">Create</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 p-1">
            {eventsByUser.map((event) => (
              <Link key={`${event._id}`} to={`/event/edit/${event._id}`}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default UserEvents;
