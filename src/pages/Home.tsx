import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Button from "../components/button/Button";

const Home = () => {
  const session = useSession();

  return (
    <div className="h-[350px] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold">Welcome to the Events Platform</h2>

      {session ? (
        <Link to="/dashboard">
          <Button label="Go to Dashboard" className="m-3">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <p className="text-red-600">Please log in to access the Platform.</p>
      )}
    </div>
  );
};

export default Home;
