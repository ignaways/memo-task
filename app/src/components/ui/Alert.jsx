export default function Alert({ children }) {
  if (!children) return null;

  return (
    <div role="alert" className="animate-fade-in rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {children}
    </div>
  );
}
