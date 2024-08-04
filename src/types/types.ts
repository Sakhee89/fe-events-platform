export interface Event {
  _id: string;
  createdBy: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  price: number;
  theme: string;
  calendarId?: string;
  eventId?: string;
  attendees?: string[];
  __v: number;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  picture: string;
  role: string;
}

export interface GoogleEvent {
  summary: string;
  description: string;
  start: {
    dateTime: Date | string;
    timeZone: string;
  };
  end: {
    dateTime: Date | string;
    timeZone: string;
  };
  location: string;
  attendees?: Attendee[];
}

export interface Attendee {
  email: string;
  responseStatus: string;
  comment?: string;
}

export interface SearchParams {
  title?: string;
  location?: string;
  theme?: string;
  priceType?: string;
  date?: string;
}

export interface Attendee {
  email: string;
  responseStatus: string;
  comment?: string;
}

export interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: Attendee[] | undefined;
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}
