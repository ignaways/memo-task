export default function AuthCard({ title, subtitle, action, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-md py-6">
      <div className="animate-pop-in rounded-2xl border border-stone-100 bg-white p-6 shadow-xl shadow-stone-200/70 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-stone-500">{footer}</div>}
    </div>
  );
}
