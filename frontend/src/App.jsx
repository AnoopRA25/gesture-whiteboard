import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Whiteboard from "./pages/Whiteboard";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/room/:roomId" element={session ? <Whiteboard /> : <Navigate to="/" />} />
    </Routes>
  );
}
