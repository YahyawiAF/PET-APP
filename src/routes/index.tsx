import { Routes, Route } from "react-router-dom";

// pages
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute.tsx";
import Login from "../pages/Login";
import Home from "../pages/Home";
import {Layout} from "../layout/Main"
import { useAuth } from "../context/AuthProvider";

function RouteSection() {
  const { session } = useAuth();
  return (
    <Routes>
      <Route element={<PublicRoute session={session} />}>
        <Route path="/" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute session={session} ><Layout /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default RouteSection;
