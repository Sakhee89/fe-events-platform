import axios from "axios";
import { GoogleCalendarEvent, GoogleEvent } from "../types/types";

const googleCalendarApi = axios.create({
  baseURL: "https://www.googleapis.com/calendar/v3/calendars/primary",
});

export const createCalendarEventRequest = async (
  event: GoogleEvent,
  providerToken: string
) => {
  return await googleCalendarApi.post("/events", event, {
    headers: {
      Authorization: `Bearer ` + providerToken,
    },
  });
};

export const patchCalendarEventRequest = async (
  event: GoogleEvent,
  eventId: string,
  providerToken: string
) => {
  return await googleCalendarApi.patch("/events/" + eventId, event, {
    headers: {
      Authorization: `Bearer ` + providerToken,
    },
  });
};

export const getCalendarEventRequest = async (
  eventId: string,
  providerToken: string
) => {
  return await googleCalendarApi.get<GoogleCalendarEvent>(
    "/events/" + eventId,
    {
      headers: {
        Authorization: `Bearer ` + providerToken,
      },
    }
  );
};
