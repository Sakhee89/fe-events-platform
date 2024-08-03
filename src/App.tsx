import React from "react";

import { useSessionContext } from "@supabase/auth-helpers-react";
import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import CreateEvent from "./pages/event/CreateEvent";
import EditEvent from "./pages/event/EditEvent";

function App() {
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="event/create" element={<CreateEvent />} />
          <Route path="event/edit/:id" element={<EditEvent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
