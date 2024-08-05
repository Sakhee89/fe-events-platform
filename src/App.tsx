import { useSessionContext } from "@supabase/auth-helpers-react";
import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import CreateEvent from "./pages/event/CreateEvent";
import EditEvent from "./pages/event/EditEvent";
import ViewEvent from "./pages/event/ViewEvent";
import EnrolledEvent from "./pages/event/EnrolledEvent";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";

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
          <Route
            path="event/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="event/edit/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route path="event/view/:id" element={<ViewEvent />} />
          <Route path="event/enrolled/:id" element={<EnrolledEvent />} />
          <Route path="not-authorized" element={<NotAuthorized />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
