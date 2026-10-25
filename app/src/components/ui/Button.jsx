const VARIANTS = {
  primary:
    "bg-primary-800 text-white shadow-sm hover:bg-primary-900 focus-visible:ring-secondary-400 focus-visible:ring-offset-2",
  ghost: "text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-400",
  outline: "border border-stone-300 bg-white text-stone-700 hover:border-stone-400 focus-visible:ring-secondary-400",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-400 focus-visible:ring-offset-2",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export default function Button({ variant = "primary", size = "md", type = "button", className = "", children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
