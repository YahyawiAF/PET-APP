import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";

export const ProtectedRoute = ({
  children,
  session,
}: {
    session: any;
    children?: ReactNode;
}): JSX.Element => {
  if (!session) {
    return <Navigate to="/" />;
  }
  return children ? <>{children}</> : <Outlet />
};

export const PublicRoute = ({
    children,
    session,
  }: {
      session: any;
      children?: ReactNode;
  }): JSX.Element => {
    if (session) {
      return <Navigate to="/home" />;
    }
    return children ? <>{children}</> : <Outlet />
  };