import { Link } from "react-router-dom";
import { Event } from "../../types/types";
interface EventCardProp {
  event: Event;
}

const EventCard = ({ event }: EventCardProp) => {
  return (
    <Link
      to={`/event/edit/${event._id}`}
      className="w-full border-r px-2 py-5 border border-white hover:bg-slate-200 hover:cursor-pointer"
    >
      <div className="flex py-2 justify-between">
        <div className="text-xl font-bold">{event.title}</div>
        <div className="bg-orange-400 px-1 rounded text-sm flex items-center">
          {formatDate(event.date)}
        </div>
      </div>
      <p>{event.location}</p>
      <p>{event._id}</p>
    </Link>
  );
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} - ${
    date.getHours() % 12
  } ${date.getHours() < 12 ? "AM" : "PM"}`;
};

export default EventCard;
