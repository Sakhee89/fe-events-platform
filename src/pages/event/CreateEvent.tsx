import { useState } from "react";
import Button from "../../components/button/Button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GoogleEvent } from "../../types/types";
import { createCalendarEventRequest } from "../../utils/googleCalendarUtil";
import { FieldValues, useForm } from "react-hook-form";
import ErrorMessage from "../../components/form/ErrorMessage";
import { AxiosError } from "axios";
import { createEvent } from "../../utils/backendApiUtils";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const CreateEvent = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  type ValuePiece = Date | null;

  const [startDateTime, setStartDateTime] = useState<ValuePiece>(new Date());
  const [endDateTime, setEndDateTime] = useState<ValuePiece>(new Date());
  const [dateError, setDateError] = useState<string>("");

  const onSubmit = async (fieldValues: FieldValues) => {
    if (!startDateTime || !endDateTime) {
      setDateError("Start and end dates must be set");
      return;
    }

    setDateError("");

    const event: GoogleEvent = {
      summary: fieldValues.title,
      description: fieldValues.description,
      start: {
        dateTime: startDateTime?.toISOString() || "",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime?.toISOString() || "",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: fieldValues.location,
      anyoneCanAddSelf: true,
      visibility: "public",
    };

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      const response = await createCalendarEventRequest(
        event,
        session!.user.email!,
        providerToken
      );

      await createEvent(
        {
          title: event.summary,
          description: event.description,
          location: event.location,
          date: startDateTime?.toISOString() || "",
          endDate: endDateTime?.toISOString() || "",
          price: fieldValues.price,
          theme: fieldValues.theme,
          attendees: [],
          calendarId: session?.user.email!,
          eventId: response.data.id,
        },
        authToken
      );

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          alert("Session timeout - Please relogin");
          await supabase.auth.signOut();
        } else {
          alert("Failed to create event");
        }
      }
    }
  };

  return session ? (
    <div className="w-full gap-1 px-1">
      <div className="flex justify-end">
        <Button
          label="Dashboard"
          className="bg-red-500"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </Button>
      </div>
      <div className="max-w-[560px] mx-auto pt-10">
        <form
          className="flex flex-col gap-2 justify-end"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label>Title:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                errors.title && "border-red-600"
              }`}
              placeholder="Enter event title"
              defaultValue={""}
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
          </div>
          <div>
            <label>Description:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                errors.title && "border-red-600"
              }`}
              placeholder="Enter event description"
              defaultValue={""}
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
          </div>
          <div>
            <label>Location:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                errors.title && "border-red-600"
              }`}
              defaultValue={""}
              placeholder="Enter event location"
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
          </div>
          <div>
            <label>Price (£):</label>
            <input
              type="number"
              min={0}
              className={`border-2 p-2 border-gray-600 rounded-lg w-full`}
              placeholder="Enter event price"
              defaultValue={0}
              {...register("price", { min: 0 })}
            />
          </div>
          <div>
            <label>Theme:</label>
            <input
              className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                errors.title && "border-red-600"
              }`}
              placeholder="Enter event theme"
              defaultValue={""}
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
          </div>
          <div>
            <label>Date and Time (Start to End):</label>
            <div className="pt-2">
              <div className="flex gap-4">
                <div>
                  <label>Start Date & Time:</label>
                  <DateTimePicker
                    onChange={setStartDateTime}
                    value={startDateTime}
                  />
                </div>
                <div>
                  <label>End Date & Time:</label>
                  <DateTimePicker
                    onChange={setEndDateTime}
                    value={endDateTime}
                  />
                </div>
              </div>
            </div>
          </div>
          {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
          <hr />
          <Button label="Create Calendar Event" type="submit">
            Create Calendar Event
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default CreateEvent;
