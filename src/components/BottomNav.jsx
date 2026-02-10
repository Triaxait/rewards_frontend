export default function BottomNav({
  active,
  onChange,
  qrOpen,
  onQrToggle,
}) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] z-50">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-soft
          px-6 py-3
          flex items-center justify-between
        "
      >
        {/* Home */}
        <button
          type="button"
          onClick={() => onChange("home")}
          className={`
            text-sm font-medium transition
            ${
              active === "home"
                ? "text-primary"
                : "text-muted"
            }
          `}
        >
          Home
        </button>

        {/* QR / Close */}
        <button
          type="button"
          onClick={onQrToggle}
          className={`
            w-12 h-12
            rounded-full
            flex items-center justify-center
            text-sm font-medium
            transition-all
            ${
              qrOpen
                ? "bg-text text-white"
                : "bg-primary/15 text-primary"
            }
          `}
        >
          {qrOpen ? "✕" : "QR"}
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onChange("profile")}
          className={`
            text-sm font-medium transition
            ${
              active === "profile"
                ? "text-primary"
                : "text-muted"
            }
          `}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
