import { useSessionContext } from "@supabase/auth-helpers-react";
import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import CreateEvent from "./pages/event/CreateEvent";
import EditEvent from "./pages/event/EditEvent";
import ViewEvent from "./pages/event/ViewEvent";
import EnrolledEvent from "./pages/event/EnrolledEvent";

function App() {
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="event/create" element={<CreateEvent />} />
          <Route path="event/edit/:id" element={<EditEvent />} />
          <Route path="event/view/:id" element={<ViewEvent />} />
          <Route path="event/enrolled/:id" element={<EnrolledEvent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
