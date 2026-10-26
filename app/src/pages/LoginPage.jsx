import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import PasswordInput from "../components/auth/PasswordInput";
import FormField, { inputClass } from "../components/ui/FormField";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ServerWakeHint from "../components/ui/ServerWakeHint";
import useAuth from "../hooks/useAuth";

const DEMO = {
  email: import.meta.env.VITE_DEMO_EMAIL,
  password: import.meta.env.VITE_DEMO_PASSWORD,
};

const linkClass = "rounded font-semibold text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = async (credentials) => {
    setSubmitting(true);
    setMessage("");
    setErrors({});
    try {
      await login(credentials);
    } catch (error) {
      setErrors(error.fieldErrors?.() ?? {});
      setMessage(error.message);
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email wajib diisi.";
    if (!form.password) nextErrors.password = "Password wajib diisi.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    submit({ email: form.email.trim(), password: form.password });
  };

  const handleDemoAccount = () => {
    setForm((prev) => ({
      "email": "demo@memoboard.dev",
      "password": "demo12345"
    }))
  }

  return (
    <AuthCard
      title="Masuk"
      subtitle="Lanjutkan mengelola task kamu."
      footer={
        <>
          <div>
            Belum punya akun?{" "}
            <Link to="/register" className={linkClass}>
              Daftar sekarang
            </Link>
          </div>
          <div>
            Atau gunakan{" "}
            <span className={linkClass} onClick={handleDemoAccount}>
              akun demo
            </span>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{message}</Alert>

        <FormField id="login-email" label="Email" error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setField("email")}
            aria-invalid={Boolean(errors.email)}
            placeholder="nama@email.com"
            className={`${inputClass} ${errors.email ? "border-rose-400" : ""}`}
          />
        </FormField>

        <FormField id="login-password" label="Password" error={errors.password}>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={form.password}
            onChange={setField("password")}
            aria-invalid={Boolean(errors.password)}
            className={errors.password ? "border-rose-400" : ""}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Spinner size={16} />}
          {submitting ? "Memproses..." : "Masuk"}
        </Button>

        {DEMO.email && DEMO.password && (
          <Button
            variant="outline"
            className="w-full"
            disabled={submitting}
            onClick={() => submit({ email: DEMO.email, password: DEMO.password })}
          >
            Masuk dengan akun demo
          </Button>
        )}

        <ServerWakeHint active={submitting} />
      </form>
    </AuthCard>
  );
}
