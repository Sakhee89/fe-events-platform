import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addAttendeeToEvent, getEventById } from "../../utils/backendApiUtils";
import { Attendee, Event } from "../../types/types";
import Loading from "../../components/loading/Loading";
import Button from "../../components/button/Button";
import {
  getCalendarEventRequest,
  patchCalendarEventRequest,
} from "../../utils/googleCalendarUtil";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AxiosError } from "axios";

const ViewEvent = () => {
  const { id } = useParams();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [event, setEvent] = useState<Omit<Event, "_id" | "createdBy" | "__v">>({
    title: "",
    description: "",
    location: "",
    price: 0,
    theme: "",
    date: new Date().toISOString(),
    attendees: [],
    calendarId: "",
    endDate: new Date().toISOString(),
    eventId: "",
  });

  const [isLoadingEvent, setLoadingEvent] = useState<boolean>(true);

  useEffect(() => {
    getEventById(id!).then((res) => {
      setEvent(res.data.event);

      setLoadingEvent(false);
    });
  }, [id, setEvent]);

  const attendHandler = async () => {
    if (!event.eventId) {
      return;
    }

    console.log("attendHandler");

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      //getCalendarEvent
      const getCalendarEventResponse = await getCalendarEventRequest(
        event.eventId,
        providerToken
      );

      console.log("getCalendarEventResponse", getCalendarEventResponse);
      const currentEvent = getCalendarEventResponse.data;

      if (
        currentEvent.attendees &&
        currentEvent.attendees
          .map((attendee) => attendee.email)
          .includes(session?.user.email!)
      ) {
        alert(`${session?.user.email} is already attending`);
        return;
      }
      currentEvent.attendees = currentEvent.attendees
        ? ([
            { ...currentEvent.attendees },
            {
              email: session?.user.email!,
              responseStatus: "accepted",
            },
          ] as Attendee[])
        : [
            {
              email: session?.user.email!,
              responseStatus: "accepted",
            },
          ];

      console.log("Event to update", currentEvent);

      //patchCalendarEvent
      await patchCalendarEventRequest(
        {
          summary: currentEvent.summary,
          description: currentEvent.summary,
          start: currentEvent.start,
          end: currentEvent.end,
          location: currentEvent.location,
          attendees: currentEvent.attendees,
        },
        event.eventId,
        providerToken
      );
      //updateBackend
      const backendAttendeeResponse = await addAttendeeToEvent(id!, authToken);

      console.log("backendAttendeeResponse", backendAttendeeResponse.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert("Session timeout - Please relogin");
          await supabase.auth.signOut();
        }
      }
    }
  };

  return isLoadingEvent ? (
    <Loading />
  ) : (
    <div className="px-5">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold py-3">{event.title}</div>
        {event.price ? (
          <>
            <div>£{event.price} entry fee</div>
          </>
        ) : (
          <div className="text-2xl font-bold text-green-600">FREE</div>
        )}
      </div>
      <hr />
      <div className="flex justify-between text-sm py-2">
        <div>Location: {event.location}</div>
        <div>
          Date: {new Date(event.date).toDateString()}
          {event.endDate && ` - ${new Date(event.endDate).toDateString()}`}
        </div>
      </div>
      <hr />
      <div className="text-lg py-2">{event.description}</div>
      <div className="flex justify-end">
        <Button onClick={() => attendHandler()}>Attend</Button>
      </div>
    </div>
  );
};

export default ViewEvent;
