import { useState } from "react";
import Button from "../components/button/Button";
import UserEvents from "../components/event/UserEvents";
import EventSearchBar from "../components/event/EventSearch";
import UserSubscribedEvents from "../components/event/UserSubscribedEvents";

type DashboardViewType =
  | "SEARCH"
  | "USER_SUBSCRIBED_EVENT"
  | "USER_CREATED_EVENT"
  | "EDIT_EVENT";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState<DashboardViewType>("SEARCH");

  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-col overflow-hidden gap-1 px-1">
        <Button
          label="Search"
          onClick={() => {
            setCurrentView("SEARCH");
          }}
        >
          Search
        </Button>
        <Button
          label="UserSubscribedEvent"
          onClick={() => {
            setCurrentView("USER_SUBSCRIBED_EVENT");
          }}
        >
          Upcoming sub events
        </Button>
        <Button
          label="UserCreatedEvent"
          onClick={() => {
            setCurrentView("USER_CREATED_EVENT");
          }}
        >
          User's event
        </Button>
      </div>
      <div className="bg-slate-300 col-span-3 p-4">
        {currentView === "USER_CREATED_EVENT" && <UserEvents />}
        {currentView === "USER_SUBSCRIBED_EVENT" && <UserSubscribedEvents />}
        {currentView === "SEARCH" && (
          <div>
            <EventSearchBar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
