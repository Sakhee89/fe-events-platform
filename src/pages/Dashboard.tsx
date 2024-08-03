import { useState } from "react";
import Button from "../components/button/Button";
import UserEvents from "../components/event/UserEvents";

type DashboardViewType =
  | "SEARCH"
  | "USER_SUBSCRIBED_EVENT"
  | "USER_CREATED_EVENT"
  | "EDIT_EVENT";

const Dashboard = () => {
  const [currentView, setCurrentView] =
    useState<DashboardViewType>("USER_CREATED_EVENT");

  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-col overflow-hidden gap-1 px-1">
        <Button
          onClick={() => {
            setCurrentView("SEARCH");
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setCurrentView("USER_SUBSCRIBED_EVENT");
          }}
        >
          Upcoming sub events
        </Button>
        <Button
          onClick={() => {
            setCurrentView("USER_CREATED_EVENT");
          }}
        >
          User's event
        </Button>
      </div>
      <div className="bg-slate-300 col-span-3 ">
        {currentView === "USER_CREATED_EVENT" ? (
          <UserEvents />
        ) : currentView === "USER_SUBSCRIBED_EVENT" ? (
          <>USER_SUBSCRIBED_EVENT</>
        ) : (
          <>SEARCH</>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
