import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageLoader from "../layout/FullPageLoader";
import { AUTH_STATUS } from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth";

export default function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.CHECKING) return <FullPageLoader label="Memeriksa sesi..." />;
  if (status === AUTH_STATUS.AUTHENTICATED) return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;

  return <Outlet />;
}
