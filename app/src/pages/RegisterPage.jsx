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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Nama wajib diisi.";
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Format email tidak valid.";
  if (password.length < 8) errors.password = "Password minimal 8 karakter.";
  if (confirmPassword !== password) errors.confirmPassword = "Konfirmasi password tidak sama.";
  return errors;
};

const linkClass = "rounded font-semibold text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    } catch (error) {
      setErrors(error.fieldErrors?.() ?? {});
      setMessage(error.message);
      setSubmitting(false);
    }
  };

  const errorClass = (field) => (errors[field] ? "border-rose-400" : "");

  return (
    <AuthCard
      title="Buat akun"
      subtitle="Simpan kategori dan task kamu dengan aman."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link to="/login" className={linkClass}>
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{message}</Alert>

        <FormField id="register-name" label="Nama" error={errors.name}>
          <input
            id="register-name"
            autoComplete="name"
            value={form.name}
            onChange={setField("name")}
            aria-invalid={Boolean(errors.name)}
            placeholder="Nama kamu"
            className={`${inputClass} ${errorClass("name")}`}
          />
        </FormField>

        <FormField id="register-email" label="Email" error={errors.email}>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setField("email")}
            aria-invalid={Boolean(errors.email)}
            placeholder="nama@email.com"
            className={`${inputClass} ${errorClass("email")}`}
          />
        </FormField>

        <FormField id="register-password" label="Password" hint="(min. 8 karakter)" error={errors.password}>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            value={form.password}
            onChange={setField("password")}
            aria-invalid={Boolean(errors.password)}
            className={errorClass("password")}
          />
        </FormField>

        <FormField id="register-confirm" label="Konfirmasi password" error={errors.confirmPassword}>
          <PasswordInput
            id="register-confirm"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={setField("confirmPassword")}
            aria-invalid={Boolean(errors.confirmPassword)}
            className={errorClass("confirmPassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Spinner size={16} />}
          {submitting ? "Membuat akun..." : "Daftar"}
        </Button>

        <ServerWakeHint active={submitting} />
      </form>
    </AuthCard>
  );
}
