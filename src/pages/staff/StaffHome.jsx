import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import { apiFetch } from "../../services/api/customer";

export default function StaffHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState("");

  /* ======================
  LOAD ASSIGNED STORES
  ====================== */
  useEffect(() => {
    // TODO: GET /staff/my-sites
    const fetchStores = async () => {
      const res = await apiFetch("/staff/sites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setStores(res || []);
    };
    fetchStores();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const name =
    user?.profile?.firstName && user?.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : "Staff";

  return (
    <div className="min-h-screen bg-bg max-w-md mx-auto">
      {/* ===== HEADER ===== */}
      <div className="px-5 pt-6 pb-4 flex justify-between items-start border-b border-border">
        <div>
          <h1 className="text-base font-semibold text-text">
            XL Convenience Store
          </h1>
          <p className="text-xs text-muted">Staff Console</p>
        </div>

        <button
          onClick={handleLogout}
          className="
    text-muted
    hover:text-text
    transition
    active:scale-95
  "
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-5 pt-3 space-y-4">
        {/* Greeting Card */}
        <div>
          <p className="text-xs text-muted">Welcome back,</p>

          <p className="text-base font-semibold text-text">{name}</p>
        </div>

        {/* Store Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-text">Select your store</p>

          <select
            value={storeId}
            onChange={(e) => {
              console.log(e.target.value);
              setStoreId(e.target.value);
            }}
            className="
              w-full
              border border-border
              rounded-xl
              px-4 py-3
              text-sm
              bg-white
              focus:outline-none
              focus:border-primary
            "
          >
            <option value="">Choose store to start</option>
            {stores.map((s) => (
              <option key={s.siteId} value={s.siteId}>
                {s.name}
              </option>
            ))}
          </select>

          <p className="text-xs text-muted">You can change store anytime</p>
        </div>

        {/* Primary Action */}
        <div className="pt-2">
          <Button
            disabled={!storeId}
            onClick={() => navigate("/staff/scan?siteId=" + storeId)}
          >
            Start scanning customers
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-muted text-center pt-4">
          Scan customer QR to add paid cups or redeem rewards
        </p>
      </div>
    </div>
  );
}
