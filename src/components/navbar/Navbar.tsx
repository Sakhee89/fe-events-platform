import { useEffect } from "react";
import Button from "../button/Button";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { createUser } from "../../utils/backendApiUtils";

const Navbar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });

    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION" && session) {
        const { data } = await supabase.auth.getUser();
        const user = data.user!;

        try {
          await createUser({
            uid: user.id,
            displayName: user.user_metadata!.name!,
            email: user.user_metadata!.email!,
            photoURL: user.user_metadata!.picture!,
            authToken: session!.access_token,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }, [supabase.auth]);

  return (
    <nav className="w-full bg-slate-200">
      {session ? (
        <section>
          <div className="flex justify-between items-center px-1 py-2">
            <h2>Signed in as {session.user.email}</h2>
            <Button label="signOut" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
          <div className="flex justify-center bg-slate-300 gap-4">
            <Link className="underline" to="/">
              Home
            </Link>
            <Link className="underline" to="/dashboard">
              Dashboard
            </Link>
          </div>
        </section>
      ) : (
        <section className="flex justify-end items-center px-1 py-2">
          <Button label="GoogleSignIn" onClick={() => googleSignIn()}>
            Sign In With Google
          </Button>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
