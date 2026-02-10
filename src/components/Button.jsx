export default function Button({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-12 rounded-lg font-medium transition
        ${
          disabled
            ? "bg-primary/40 text-white cursor-not-allowed"
            : "bg-primary text-white hover:opacity-90"
        }
      `}
    >
      {children}
    </button>
  );
}
