import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { StateContext } from "../context/StateProvider";

async function isLoggedIn() {
  const response = await fetch("/api/v1/users/login", {
    credentials: "include",
  });
  const data = await response.json();

  return data;
}

function RequireAuth({ children }) {
  const [state, dispatch] = useContext(StateContext);
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function IsAdmin({ children }) {
  const [state, dispatch] = useContext(StateContext);
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (state.user.isAdmin === false) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
}

export { RequireAuth, IsAdmin, isLoggedIn };
