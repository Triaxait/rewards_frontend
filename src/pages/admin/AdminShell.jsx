import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminTransactions from "./AdminTransactions";
import AdminServices from "./AdminServices";
import AdminBottomNav from "../../components/AdminBottomNav";
import SideDrawer from "../../components/SideDrawer";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminShell() {
  const [tab, setTab] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
    const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-bg pb-28">
      {/* Header */}
      <div className="px-5 pt-6 flex items-center gap-3">
        {/* Drawer button (LEFT) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="
            text-text text-xl
            transition-transform
            active:scale-95
          "
        >
          ☰
        </button>

        {/* Centered Brand */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-base font-semibold text-text tracking-tight">
            XL Convenience Store
          </h1>
        </div>

        {/* Right spacer to keep title centered */}
        <div className="w-6" />
      </div>

      {/* Pages */}
      {tab === "dashboard" && <AdminDashboard />}
      {tab === "transactions" && <AdminTransactions />}
      {tab === "services" && <AdminServices />}

      {/* Bottom Navigation */}
      <AdminBottomNav active={tab} onChange={setTab} />

      {/* Side Drawer */}
      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}
