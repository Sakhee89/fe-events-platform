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
  firebaseUid: string;
  name: string;
  email: string;
  picture: string;
  role: string;
}

export interface GoogleEvent {
  summary: string;
  description: string;
  start: {
    dateTime: Date;
    timeZone: string;
  };
  end: {
    dateTime: Date;
    timeZone: string;
  };
  location: string;
  attendees?: string[];
}
