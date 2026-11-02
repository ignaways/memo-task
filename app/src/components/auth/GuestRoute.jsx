import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageLoader from "../layout/FullPageLoader";
import { AUTH_STATUS } from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";

export default function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (status === AUTH_STATUS.CHECKING) return <FullPageLoader label={t("common.checkingSession")} />;
  if (status === AUTH_STATUS.AUTHENTICATED) return <Navigate to={location.state?.from?.pathname ?? "/"} replace />;

  return <Outlet />;
}
