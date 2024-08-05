import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addAttendeeToEvent,
  getEventById,
  getPaymentIntent,
} from "../../utils/backendApiUtils";
import { Event } from "../../types/types";
import Loading from "../../components/loading/Loading";
import Button from "../../components/button/Button";
import {
  getCalendarEventRequest,
  patchCalendarEventRequest,
} from "../../utils/googleCalendarUtil";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AxiosError } from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

const ViewEvent = () => {
  const { id } = useParams();
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

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

  const [clientSecret, setClientSecret] = useState<string | null>(null);

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

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      const getCalendarEventResponse = await getCalendarEventRequest(
        event.eventId,
        providerToken
      );

      const currentEvent = getCalendarEventResponse.data;

      if (currentEvent.attendees === undefined) {
        currentEvent.attendees = [];
      }

      if (
        currentEvent.attendees
          .map((attendee) => attendee.email)
          .includes(session?.user.email!)
      ) {
        alert(`${session?.user.email} is already attending`);
        return;
      }
      currentEvent.attendees = [
        ...currentEvent.attendees,
        {
          email: session?.user.email!,
          responseStatus: "accepted",
        },
      ];

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

      const backendAttendeeResponse = await addAttendeeToEvent(id!, authToken);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert("Session timeout - Please relogin");
          await supabase.auth.signOut();
        }
      }
    }
  };

  const purchaseEnrollmentHandler = async () => {
    const authToken = session!.access_token!;

    try {
      const stripePaymentIntent = await getPaymentIntent(id!, authToken);
      setClientSecret(stripePaymentIntent.data.clientSecret);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert("Session timeout - Please relogin");
          await supabase.auth.signOut();
        } else {
          alert("Failed to start payment");
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
          <div>
            <div>£{event.price} entry fee</div>
          </div>
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
        {event.attendees && event.attendees.includes(session?.user.email!) ? (
          <p>You are attending the event</p>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <Checkout id={id!} />
          </Elements>
        ) : event.price ? (
          <Button
            label="PurchaseEnrollment"
            onClick={() => purchaseEnrollmentHandler()}
          >
            Purchase enrollment
          </Button>
        ) : (
          <Button label="Attend" onClick={() => attendHandler()}>
            Attend
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;
