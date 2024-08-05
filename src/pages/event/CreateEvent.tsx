import { useState } from "react";
import Button from "../../components/button/Button";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GoogleEvent } from "../../types/types";
import { createCalendarEventRequest } from "../../utils/googleCalendarUtil";
import { FieldValues, useForm } from "react-hook-form";
import ErrorMessage from "../../components/form/ErrorMessage";
import { AxiosError } from "axios";
import { createEvent } from "../../utils/backendApiUtils";

const CreateEvent = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [date, setDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [dateError, setDateError] = useState<string>("");

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

    const providerToken = session!.provider_token!;
    const authToken = session!.access_token!;

    try {
      const response = await createCalendarEventRequest(event, providerToken);

      await createEvent(
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
      );

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

  return (
    <>
      {!session || session.user.role !== "staff" ? (
        <p>Not Authorized</p>
      ) : (
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
              className="flex flex-col gap-2"
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
                    Title must be at least 5 characters
                  </ErrorMessage>
                )}
              </div>
              <div>
                <label>Description:</label>
                <input
                  className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                    errors.description && "border-red-600"
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
                    Description must be at least 5 characters
                  </ErrorMessage>
                )}
              </div>
              <div>
                <label>Location:</label>
                <input
                  className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                    errors.location && "border-red-600"
                  }`}
                  placeholder="Enter event location"
                  defaultValue={""}
                  {...register("location", { required: true, minLength: 2 })}
                />
                {errors.location?.type === "required" && (
                  <ErrorMessage>Location is required</ErrorMessage>
                )}
                {errors.location?.type === "minLength" && (
                  <ErrorMessage>
                    Location must be at least 2 characters
                  </ErrorMessage>
                )}
              </div>
              <div>
                <label>Price (£):</label>
                <input
                  type="number"
                  min={0}
                  className="border-2 p-2 border-gray-600 rounded-lg w-full"
                  placeholder="Enter event price"
                  defaultValue={0}
                  {...register("price", { min: 0 })}
                />
              </div>
              <div>
                <label>Theme:</label>
                <input
                  className={`border-2 p-2 border-gray-600 rounded-lg w-full ${
                    errors.theme && "border-red-600"
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
                    Theme must be at least 2 characters
                  </ErrorMessage>
                )}
              </div>
              <div>
                <label>Date (Start to end):</label>
                <div className="pt-2">
                  <Datepicker value={date} onChange={(date) => setDate(date)} />
                </div>
              </div>
              {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
              <hr />
              <Button label="CreateCalendarEvent" type="submit">
                Create Calendar Event
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
