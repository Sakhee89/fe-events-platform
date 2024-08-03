import axios from "axios";
import { Event, SearchParams, User } from "../types/types";

const backendApi = axios.create({
  baseURL: "http://localhost:3333/",
});

export const createToken = async (code: string) => {
  return backendApi.post(`/api/calendar/create-token`, {
    code,
  });
};

export const createEvent = async (
  editEvent: Omit<Event, "_id" | "createdBy" | "__v">,
  authToken: string
): Promise<{ data: { events: Event } }> => {
  return backendApi.post(`/api/events`, editEvent, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
export const getEvents = async (
  params: SearchParams = {}
): Promise<{ data: { events: Event[] } }> => {
  return backendApi.get("/api/events", { params });
};

export const getEventById = async (
  eventId: string
): Promise<{ data: { event: Event } }> => {
  return backendApi.get(`/api/events/${eventId}`);
};

export const getEventsbyUserId = async (
  userId: string,
  authToken: string
): Promise<{ data: { events: Event[] } }> => {
  return backendApi.get(`/api/events/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const updateEvent = async (
  eventId: string,
  event: Omit<Event, "_id" | "createdBy" | "__v">,
  authToken: string
): Promise<{ data: { events: Event[] } }> => {
  return backendApi.put(`/api/events/update/${eventId}`, event, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

// export const getUserById = async (
//   user: FirebaseUser
// ): Promise<{ data: { user: User } }> => {
//   return backendApi.get(`api/users/${user.uid}`, {
//     headers: {
//       Authorization: `Bearer ${await user.getIdToken()}`,
//     },
//   });
// };

export const createUser = async (newUser: {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  authToken: string;
}): Promise<{ data: { user: User } }> => {
  return backendApi.post(
    `api/users`,
    {
      firebaseUid: newUser.uid,
      name: newUser.displayName,
      email: newUser.email,
      picture: newUser.photoURL,
      role: "member",
    },
    {
      headers: {
        Authorization: `Bearer ${newUser.authToken}`,
      },
    }
  );
};

export const deleteEvent = async (id: string, token: string) => {
  console.log(id);
  await backendApi.delete(`/api/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addAttendeeToEvent = async (
  eventId: string,
  authToken: string
) => {
  return backendApi.patch(
    `/api/events/attend/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
