import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventById, updateEvent } from "../../utils/backendApiUtils";
import { Event, GoogleEvent } from "../../types/types";
import Loading from "../../components/loading/Loading";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import Button from "../../components/button/Button";
import { FieldValues, useForm } from "react-hook-form";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import ErrorMessage from "../../components/form/ErrorMessage";
import { patchCalendarEventRequest } from "../../utils/googleCalendarUtil";
import { AxiosError } from "axios";

const EditEvent = () => {
  const { id } = useParams();
  const session = useSession();
  const supabase = useSupabaseClient();

  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const [editEvent, setEditEvent] = useState<
    Omit<Event, "_id" | "createdBy" | "__v">
  >({
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

  const [date, setDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [dateError, setDateError] = useState<string>("");

  const [isLoadingEditEvent, setLoadingEditEvent] = useState<boolean>(true);

  const onSubmit = async (fieldValues: FieldValues) => {
    if (!date?.startDate || !date?.endDate) {
      setDateError("Date must be set");
      return;
    }

    setDateError("");

    const convertedStartDate = new Date(date?.startDate);
    const convertedEndDate = new Date(date?.endDate);

    const event: GoogleEvent = {
      summary: fieldValues.title,
      description: fieldValues.description,
      start: {
        dateTime: convertedStartDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: convertedEndDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: fieldValues.location,
    };

    console.log("event", event);

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    console.log("editEvent.eventId!", editEvent.eventId!);

    try {
      const response = await patchCalendarEventRequest(
        event,
        editEvent.eventId!,
        providerToken
      );

      console.log("updateCalendarEventRequest - response", response.data);

      console.log(
        "updateEvent - response",
        await updateEvent(
          id!,
          {
            title: event.summary,
            description: event.description,
            location: event.location,
            date: convertedStartDate.toISOString(),
            endDate: convertedEndDate.toISOString(),
            price: fieldValues.price,
            theme: fieldValues.theme,
            attendees: [],
            calendarId: session?.user.email!,
            eventId: response.data.id,
          },
          authToken
        )
      );

      navigate(-1);
    } catch (error) {
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
      setEditEvent(res.data.event);
      setDate({
        startDate: res.data.event.date,
        endDate: res.data.event.endDate || res.data.event.date,
      });

      setLoadingEditEvent(false);
    });
  }, [id, setEditEvent]);

  return isLoadingEditEvent ? (
    <Loading />
  ) : (
    <div className="w-full gap-1 px-1">
      <div className="flex justify-end">
        <Button className="bg-red-500" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
      <div className="max-w-[560px] mx-auto pt-10">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <>
            <label>Title:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg ${
                errors.title && "border-red-600"
              }`}
              defaultValue={editEvent.title}
              {...register("title", { required: true, minLength: 5 })}
            />
            {errors.title?.type === "required" && (
              <ErrorMessage>Title is required</ErrorMessage>
            )}
            {errors.title?.type === "minLength" && (
              <ErrorMessage>
                Title is required to be at least 5 characters
              </ErrorMessage>
            )}
          </>
          <>
            <label>Description:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg ${
                errors.title && "border-red-600"
              }`}
              defaultValue={editEvent.description}
              {...register("description", { required: true, minLength: 5 })}
            />
            {errors.description?.type === "required" && (
              <ErrorMessage>Description is required</ErrorMessage>
            )}
            {errors.description?.type === "minLength" && (
              <ErrorMessage>
                Description is required to be at least 5 characters
              </ErrorMessage>
            )}
          </>
          <>
            <label>Location:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg ${
                errors.title && "border-red-600"
              }`}
              defaultValue={editEvent.location}
              {...register("location", { required: true, minLength: 2 })}
            />
            {errors.location?.type === "required" && (
              <ErrorMessage>Location is required</ErrorMessage>
            )}
            {errors.location?.type === "minLength" && (
              <ErrorMessage>
                Location is required to be at least 2 characters
              </ErrorMessage>
            )}
          </>
          <>
            <label>Price (£):</label>
            <input
              type="number"
              min={0}
              className={`border-2 p-2 border-gray-600 rounded-lg`}
              defaultValue={editEvent.price}
              {...register("price", { min: 0 })}
            />
          </>
          <>
            <label>Theme:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg ${
                errors.title && "border-red-600"
              }`}
              defaultValue={editEvent.theme}
              {...register("theme", { required: true, minLength: 2 })}
            />
            {errors.theme?.type === "required" && (
              <ErrorMessage>Theme is required</ErrorMessage>
            )}
            {errors.theme?.type === "minLength" && (
              <ErrorMessage>
                Theme is required to be at least 2 characters
              </ErrorMessage>
            )}
          </>
          <>
            <label>Date (Start to end):</label>
            <div className="pt-2">
              <Datepicker value={date} onChange={(date) => setDate(date)} />
            </div>
          </>
          {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
          <hr />
          <Button type="submit">Update Calendar Event</Button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
