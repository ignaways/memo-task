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
import useTranslation from "../hooks/useTranslation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, password, confirmPassword }, t) => {
  const errors = {};
  if (!name.trim()) errors.name = t("auth.register.nameRequired");
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = t("auth.register.emailInvalid");
  if (password.length < 8) errors.password = t("auth.register.passwordMin");
  if (confirmPassword !== password) errors.confirmPassword = t("auth.register.confirmMismatch");
  return errors;
};

const linkClass = "rounded font-semibold text-primary-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-400";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useTranslation();
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
    const nextErrors = validate(form, t);
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
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
      footer={
        <>
          {t("auth.register.haveAccount")}{" "}
          <Link to="/login" className={linkClass}>
            {t("auth.register.login")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{message}</Alert>

        <FormField id="register-name" label={t("auth.register.name")} error={errors.name}>
          <input
            id="register-name"
            autoComplete="name"
            value={form.name}
            onChange={setField("name")}
            aria-invalid={Boolean(errors.name)}
            placeholder={t("auth.register.namePlaceholder")}
            className={`${inputClass} ${errorClass("name")}`}
          />
        </FormField>

        <FormField id="register-email" label={t("auth.email")} error={errors.email}>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setField("email")}
            aria-invalid={Boolean(errors.email)}
            placeholder={t("auth.emailPlaceholder")}
            className={`${inputClass} ${errorClass("email")}`}
          />
        </FormField>

        <FormField id="register-password" label={t("auth.password")} hint={t("auth.register.passwordHint")} error={errors.password}>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            value={form.password}
            onChange={setField("password")}
            aria-invalid={Boolean(errors.password)}
            className={errorClass("password")}
          />
        </FormField>

        <FormField id="register-confirm" label={t("auth.register.confirmPassword")} error={errors.confirmPassword}>
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
          {submitting ? t("auth.register.submitting") : t("auth.register.submit")}
        </Button>

        <ServerWakeHint active={submitting} />
      </form>
    </AuthCard>
  );
}
