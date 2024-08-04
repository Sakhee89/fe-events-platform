import { Event } from "../../types/types";
import { formatDate } from "../../utils/dateUtils";

interface UpcomingEventCardProps {
  event: Event;
}

const UpcomingEventCard = ({ event }: UpcomingEventCardProps) => {
  return (
    <div className="border-2 ">
      <div className="flex p-2 justify-between">
        <div className="text-xl font-bold">{event.title}</div>
        <div className="bg-orange-400 px-1 rounded text-sm flex items-center">
          {formatDate(event.date)}
          {event.endDate && `- ${formatDate(event.endDate)}`}
        </div>
      </div>
      <p>Location: {event.location}</p>
    </div>
  );
};

export default UpcomingEventCard;
