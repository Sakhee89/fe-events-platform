import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addAttendeeToEvent, getEventById } from "../../utils/backendApiUtils";
import { Event } from "../../types/types";
import Loading from "../../components/loading/Loading";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  getCalendarEventRequest,
  patchCalendarEventRequest,
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
    console.log("attendHandler");

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      const getCalendarEventResponse = await getCalendarEventRequest(
        event.eventId!,
        providerToken
      );

      console.log("getCalendarEventResponse", getCalendarEventResponse);
      const currentEvent = getCalendarEventResponse.data;

      console.log("currentEvent.attendees", currentEvent.attendees);

      if (currentEvent.attendees === undefined) {
        currentEvent.attendees = [];
      }

      console.log("session?.user.email", session?.user.email);
      console.log(
        "currentEvent.attendees.length > 0",
        currentEvent.attendees.length > 0
      );

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

      console.log("Event to update", currentEvent);

      await patchCalendarEventRequest(
        {
          summary: currentEvent.summary,
          description: currentEvent.summary,
          start: currentEvent.start,
          end: currentEvent.end,
          location: currentEvent.location,
          attendees: currentEvent.attendees,
        },
        event.eventId!,
        providerToken
      );

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
