import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { getUserById } from "../../utils/backendApiUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const session = useSession();
  const [userRole, setUserRole] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const user = await getUserById(session.user.id);
        setUserRole(user.data.user.role);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserRole("unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [session]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (userRole !== "staff") {
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
