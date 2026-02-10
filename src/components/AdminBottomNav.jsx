import {
    ChartArea,
    Database,
  DatabaseZap,
  LayoutDashboard,
  List,
  LucideLayoutDashboard,
  Receipt,
  Settings,
  SquareDashedBottom,
} from "lucide-react";

export default function AdminBottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] z-50">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-soft
          px-4 py-2
          flex justify-between
        "
      >
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          tab="dashboard"
        />

        <NavItem
          icon={Receipt}
          label="Transactions"
          tab="transactions"
        />

        <NavItem
          icon={ChartArea}
          label="Site Analytics"
          tab="services"
        />
      </div>
    </div>
  );

  function NavItem({ icon: Icon, label, tab }) {
    const isActive = active === tab;

    return (
      <button
        onClick={() => onChange(tab)}
        className="
          flex flex-col items-center justify-center
          gap-1
          w-full py-1
          transition-transform duration-150 ease-out
active:scale-95
        "
      >
        <div
          className={`
            p-2 rounded-xl transition
            ${
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted"
            }
          `}
        >
          <Icon size={20} />
        </div>

        <span
          className={`
            text-[11px]
            ${
              isActive
                ? "text-primary font-medium"
                : "text-muted"
            }
          `}
        >
          {label}
        </span>
      </button>
    );
  }
}
