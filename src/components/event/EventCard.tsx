import { Event } from "../../types/types";
interface EventCardProp {
  event: Event;
}

const EventCard = ({ event }: EventCardProp) => {
  return (
    <div className="w-full border-r px-2 py-5 border border-white hover:bg-slate-200 hover:cursor-pointer">
      <div className="flex py-2 justify-between">
        <div className="text-xl font-bold">{event.title}</div>
        <div className="bg-orange-400 px-1 rounded text-sm flex items-center">
          {formatDate(event.date)}
        </div>
      </div>
      <p>
        <b>Location:</b> {event.location}
      </p>
      <p>
        <b>Theme:</b>{" "}
        <span className="font-semibold text-blue-500">{event.theme}</span>
      </p>
      <p>
        <b>Price:</b> {event.price === 0 ? "Free" : `£${event.price}`}
      </p>
      <p>{event.description}</p>
    </div>
  );
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
};

export default EventCard;
