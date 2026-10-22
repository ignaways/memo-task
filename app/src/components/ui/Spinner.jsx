export default function Spinner({ size = 20, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      style={{ width: size, height: size }}
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}
