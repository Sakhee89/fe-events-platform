import axios from "axios";
import { GoogleCalendarEvent, GoogleEvent } from "../types/types";

const googleCalendarApi = axios.create({
  baseURL: "https://www.googleapis.com/calendar/v3/calendars/",
});

export const getCalendarEventRequest = async (
  eventId: string,
  eventOwnerEmail: string,
  providerToken: string
) => {
  return await googleCalendarApi.get<GoogleCalendarEvent>(
    eventOwnerEmail + `/events/` + eventId,
    {
      headers: {
        Authorization: `Bearer ` + providerToken,
      },
    }
  );
};

export const createCalendarEventRequest = async (
  event: GoogleEvent,
  eventOwnerEmail: string,
  providerToken: string
) => {
  return await googleCalendarApi.post(eventOwnerEmail + `/events/`, event, {
    headers: {
      Authorization: `Bearer ` + providerToken,
    },
  });
};

export const patchCalendarEventRequest = async (
  event: GoogleEvent,
  eventId: string,
  eventOwnerEmail: string,
  providerToken: string
) => {
  return await googleCalendarApi.patch(
    eventOwnerEmail + `/events/` + eventId,
    event,
    {
      headers: {
        Authorization: `Bearer ` + providerToken,
      },
    }
  );
};
