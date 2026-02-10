import { LogOut, X, Shield, Store, Users, FileText } from "lucide-react";
import logo from "../assets/logo/xl-coffee.png";
import { useNavigate } from "react-router-dom";

export default function SideDrawer({ open, onClose, user, onLogout }) {
  const navigate = useNavigate();
  
  
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div
        className="
          relative
          w-80 max-w-[88%]
          bg-white
          h-full
          shadow-2xl
          px-6
          py-12
          flex flex-col
        "
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-6 right-6 text-muted">
          <X size={20} />
        </button>

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-12">
          <img src={logo} className="h-10 mb-3" />
          <h1 className="text-base font-semibold text-text">
            XL Convenience Store
          </h1>
          <p className="text-xs text-muted">Coffee • Tea • Rewards</p>
        </div>

        {/* Admin Card */}
        <div className="bg-bg rounded-2xl p-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {user?.profile?.email?.[0].toUpperCase() || "A"}
            </div>

            <div>
              <p className="text-sm font-medium text-text">
                {user?.firstName + user?.lastName || "Admin"}
              </p>
              <p className="text-xs text-muted">{user?.profile?.email}</p>
            </div>
          </div>

          <span className="inline-block mt-3 text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary">
            ADMIN ACCESS
          </span>
        </div>

        {/* Admin Tools */}
        <div className="space-y-4 mb-10">
          <DrawerItem
            icon={Store}
            label="Manage Stores"
            onClick={() => {
              navigate("/admin/stores");
            }}
          />
          <DrawerItem
            icon={Users}
            label="Manage Staff"
            onClick={() => {
              navigate("/admin/staff");
            }}
          />
        </div>

        {/* App Info */}
        <div className="text-xs text-muted space-y-1 mb-10">
          <p>Environment: Production</p>
          <p>Version: v1.0.0</p>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-red-600 font-medium"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

function DrawerItem({ icon: Icon, label, onClick }) {
  return (
    <div
      className="flex items-center gap-3 text-sm text-text cursor-pointer hover:text-primary"
      onClick={onClick}
    >
      <div className="p-2 rounded-lg bg-bg">
        <Icon size={16} />
      </div>
      {label}
    </div>
  );
}
