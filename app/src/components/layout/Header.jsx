import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary-800 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        {user ? (
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-semibold text-primary-800"
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Hi, {user.name}</p>
              <button
                type="button"
                onClick={logout}
                className="rounded text-xs text-primary-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Keluar
              </button>
            </div>
          </div>
        ) : (
          <span />
        )}

        <Link to="/" className="rounded text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
          <p className="text-xl font-bold tracking-tight sm:text-2xl">Memo Board</p>
          <p className="text-xs text-primary-200">Memo board task management</p>
        </Link>
      </div>
    </header>
  );
}
