import { useState } from "react";
import EventCard from "./EventCard";
import { Event } from "../../types/types";
import Button from "../button/Button";
import { getEvents } from "../../utils/backendApiUtils";
import { Link } from "react-router-dom";

const EventSearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    theme: "",
    priceType: "",
    date: "",
  });
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await getEvents(searchParams);
      setSearchResults(response.data.events);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={searchParams.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={searchParams.location}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="theme"
          placeholder="Theme"
          value={searchParams.theme}
          onChange={handleInputChange}
        />
        <select
          name="priceType"
          value={searchParams.priceType}
          onChange={handleInputChange}
        >
          <option value="">Price Type</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={searchParams.date}
          onChange={handleInputChange}
        />
        <Button label="search" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <section className="mt-8">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-10 px-3">
            {searchResults.map((event: Event) => (
              <Link key={event._id} to={`/event/view/${event._id}`}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        ) : (
          <p>No Events Found</p>
        )}
      </section>
    </div>
  );
};

export default EventSearchBar;
