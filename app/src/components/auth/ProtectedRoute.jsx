import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageLoader from "../layout/FullPageLoader";
import ErrorState from "../ui/ErrorState";
import MemoProvider from "../../context/MemoProvider";
import { AUTH_STATUS } from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";

export default function ProtectedRoute() {
  const { user, status, retry } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (status === AUTH_STATUS.CHECKING) return <FullPageLoader label={t("common.checkingSession")} />;

  if (status === AUTH_STATUS.ERROR) {
    return (
      <ErrorState
        title={t("auth.serverUnreachableTitle")}
        message={t("auth.serverUnreachableMessage")}
        onRetry={retry}
      />
    );
  }

  if (status === AUTH_STATUS.GUEST) return <Navigate to="/login" replace state={{ from: location }} />;

  return (
    <MemoProvider key={user.id}>
      <Outlet />
    </MemoProvider>
  );
}
