import { useSession } from "@supabase/auth-helpers-react";
import React from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const session = useSession();

  return session ? <>{children}</> : <></>;
};

export default AuthGuard;
