import { Routes, Route } from "react-router-dom";

import { ProtectedRoute, PublicRoute } from "./ProtectedRoute.tsx";

import { useAuth } from "../context/AuthProvider";

import { Layout } from "../layout/Main";

//pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import Form from "../pages/Form";
import Profile from "../pages/Profile";
import Validate from "../pages/Validate";

function RouteSection() {
  const { session } = useAuth();
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
      </Route>
    </Routes>
  );
}

export default RouteSection;
