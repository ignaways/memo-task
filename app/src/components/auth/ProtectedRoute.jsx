import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageLoader from "../layout/FullPageLoader";
import ErrorState from "../ui/ErrorState";
import MemoProvider from "../../context/MemoProvider";
import { AUTH_STATUS } from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, status, retry } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.CHECKING) return <FullPageLoader label="Memeriksa sesi..." />;

  if (status === AUTH_STATUS.ERROR) {
    return (
      <ErrorState
        title="Tidak dapat terhubung ke server"
        message="Server belum bisa dihubungi. Pastikan koneksi internet kamu aktif, lalu coba lagi."
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
