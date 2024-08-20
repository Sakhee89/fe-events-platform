import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addAttendeeToEvent, getEventById } from "../../utils/backendApiUtils";
import { Event, GoogleEvent } from "../../types/types";
import Loading from "../../components/loading/Loading";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  createCalendarEventRequest,
  getCalendarEventRequest,
  // patchCalendarEventRequest,
} from "../../utils/googleCalendarUtil";
import { AxiosError } from "axios";

const EnrolledEvent = () => {
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

  const attend = async (event: Event) => {
    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      const getCalendarEventResponse = await getCalendarEventRequest(
        event.eventId!,
        event.calendarId!,
        providerToken
      );

      const currentEvent = getCalendarEventResponse.data;

      if (currentEvent.attendees === undefined) {
        currentEvent.attendees = [];
      }

      if (
        !currentEvent.attendees
          .map((attendee) => attendee.email)
          .includes(session?.user.email!)
      ) {
        currentEvent.attendees = [
          ...currentEvent.attendees,
          {
            email: session?.user.email!,
            responseStatus: "accepted",
          },
        ];
      }

      const calendarEvent: GoogleEvent = {
        summary: currentEvent.summary,
        description: currentEvent.description,
        start: {
          dateTime: currentEvent.start.dateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: currentEvent.end.dateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        location: currentEvent.location,
        anyoneCanAddSelf: true,
        visibility: "public",
      };

      await createCalendarEventRequest(
        calendarEvent,
        session!.user.email!,
        providerToken
      );

      await addAttendeeToEvent(id!, authToken);
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

  useEffect(() => {
    getEventById(id!).then((res) => {
      setEvent(res.data.event);
      attend(res.data.event);
      setLoadingEvent(false);
    });
  }, [id, setEvent]);

  return isLoadingEvent ? (
    <Loading />
  ) : (
    <div>Thank you, you have enrolled to {event.title}</div>
  );
};

export default EnrolledEvent;
