const TONES = {
  neutral: "hover:bg-stone-100 hover:text-stone-700 focus-visible:ring-stone-400",
  primary: "hover:bg-primary-50 hover:text-primary-700 focus-visible:ring-secondary-400",
  danger: "hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-rose-400",
};

export default function IconButton({ tone = "neutral", className = "", children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-md p-1 text-stone-400 transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${TONES[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
