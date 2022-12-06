/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabaseClient } from "./config/supabase-client";
import Dashboard from "./pages/admin/Dashboard";
import Landing from "./pages/Landing";

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState(true);
  let userID;
  useEffect(() => {
    setSession(supabaseClient.auth.session());
    setUser(supabaseClient.auth.user());
    userID = supabaseClient.auth.user()?.id;

    getProfile();
  }, []);

  const str_time = new Date().getTime().toString();
  const timeNow = Number(str_time.slice(0, 10));

  // console.log("session", session);
  // console.log("usser", user?.id);

  const getProfile = async () => {
    let { data: profiles, error } = await supabaseClient
      .from("profiles")
      .select("id");

    if (error) {
      throw error;
    }

    if (profiles) {
      // console.log("profiles", profiles);
      var id = profiles.map(function (item) {
        return item["id"];
      });
      // console.log("id", id);
      id.includes(userID) ? setProfiles(true) : setProfiles(false);
    }
  };
  return (
    <div className="block">
      {session ? (
        session?.expires_at < timeNow ? (
          <Navigate to="auth/login" />
        ) : profiles ? (
          <Dashboard key={session.user?.id} session={session} />
        ) : (
          <Navigate to="/admin/profile" />
        )
      ) : (
        <Landing />
      )}
    </div>
  );
}

export default App;
