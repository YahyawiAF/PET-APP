import { Routes, Route, useNavigate } from "react-router-dom";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute.tsx";

import { useAuth } from "../context/AuthProvider";

import { Layout } from "../layout/Main";

//pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import Form from "../pages/Form";
import Profile from "../pages/Profile";
import Validate from "../pages/Validate";
import CheckIn from "../pages/CheckIn";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import supabase from "../config/supabaseClient.js";

function RouteSection() {
  const { session, user } = useAuth();
  const [profileExist, setProfileExist] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        setLoading(true);
        let { data: profile, error } = await supabase
          .from("profiles")
          .select()
          .eq("userID", user?.id);
        setLoading(false);
        if (error) {
          toast.error("Could not fetch the profile", {
            autoClose: 2000,
          });
        }

        if (profile && profile?.length > 0) {
          setProfileExist(false);
        } else {
          navigate("/profile");
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <Routes>
      <Route element={<PublicRoute session={session} />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route path="/validate/:id" element={<Validate />} />
      <Route
        element={
          <ProtectedRoute session={session}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/form" element={<Form />} />
        <Route path="/form/:id" element={<Form />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/check-in" element={<CheckIn />} />
      </Route>
    </Routes>
  );
}

export default RouteSection;
