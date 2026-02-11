import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api/customer.js";
import { Coffee, Gift, History } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return navigate("/login");

    async function load() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await apiFetch("/customer/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="px-5 pt-6 max-w-md mx-auto space-y-6 animate-pulse">
        <div className="h-16 rounded-2xl bg-bg-surface" />
        <div className="h-40 rounded-2xl bg-bg-surface" />
        <div className="h-24 rounded-2xl bg-bg-surface" />
      </div>
    );
  }

  if (!summary) return null;

  const { currentPoints, maxPoints, availableFreeCups, totalRedeemedCups } =
    summary;

  const progress = Math.min(100, (currentPoints / maxPoints) * 100);
  const name =
    `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim() ||
    "Customer";

  return (
    <div className="px-5 pt-6 pb-10 max-w-md mx-auto space-y-8 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">{getGreeting()}</p>

          <h1 className="text-2xl font-semibold text-text">{name}</h1>
        </div>
      </div>

      <div className="rounded-[22px] bg-bg-surface p-6 shadow-soft ring-1 ring-black/5 space-y-5">
        {/* Reward Banner (if available) */}
        {availableFreeCups > 0 && (
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Gift className="w-5 h-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text">
                  {availableFreeCups} Free Cup
                  {availableFreeCups > 1 ? "s" : ""} Available 🎉
                </p>
                <p className="text-[11px] text-muted">Redeem at any store</p>
              </div>
            </div>

            <button className="bg-primary text-white px-4 py-2 rounded-full text-xs font-medium shadow-md">
              Redeem
            </button>
          </div>
        )}

        {/* Always Show Progress */}
        <div>
          <p className="text-xs text-muted mb-4">Your Progress</p>

          <div className="flex items-center gap-5">
            {/* Progress Ring */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(var(--color-primary) ${progress}%, #E5E7EB ${progress}%)`,
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-text">
                {currentPoints}/{maxPoints} Points
              </p>

              <p className="text-xs text-muted">
                {maxPoints - currentPoints > 0
                  ? `${maxPoints - currentPoints} points to next reward`
                  : "You've unlocked a reward!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-bg-surface p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-xs text-muted mb-1">Total Redeemed</p>
          <p className="text-2xl font-semibold text-text">
            {totalRedeemedCups}
          </p>
          <p className="text-xs text-muted">Cups</p>
        </div>

        <div
          onClick={() => navigate("/reward-history")}
          className="rounded-2xl bg-bg-surface p-4 shadow-soft ring-1 ring-black/5 cursor-pointer"
        >
          <p className="text-xs text-muted mb-2">History</p>
          <div className="flex items-center gap-2 text-primary font-medium">
            <History className="w-4 h-4" />
            View activity
          </div>
        </div>
      </div>

      {/* How it works */}
      <div>
        <h3 className="text-base font-semibold text-text mb-4">How it works</h3>

        <div className="rounded-[22px] bg-bg-surface p-6 shadow-soft ring-1 ring-black/5 space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text">1 Cup = 1 Point</p>
              <p className="text-xs text-muted">
                Earn points on every eligible drink
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text">
                {maxPoints} Points = Free Cup
              </p>
              <p className="text-xs text-muted">
                Redeem tea or coffee for free
              </p>
            </div>
          </div>

          <p className="text-[11px] text-muted/70">
            Points are added within 1 hour of purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
