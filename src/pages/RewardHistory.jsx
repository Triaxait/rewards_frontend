import { useEffect, useState } from "react";
import { apiFetch } from "../services/api/customer.js";

export default function RewardsHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No access token");

        // ✅ CALL REAL API
        const res = await apiFetch("/customer/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        /**
         * Backend returns:
         * {
         *   history: [
         *     { date, storeName, paidCups, freeCups, type }
         *   ]
         * }
         */

        const formatted = res.history.map(item => ({
          date: new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          desc:
            item.type === "PURCHASE"
              ? `Purchased ${item.paidCups} cup`
              : `Redeemed ${item.freeCups} free cup`,
          points: item.type === "PURCHASE" ? +item.paidCups : -item.freeCups,
          store: item.storeName,
        }));

        setHistory(formatted);
      } catch (err) {
        console.error("History fetch failed:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="px-5 pt-6 pb-6 space-y-2">
        <button
          onClick={() => window.history.back()}
          className="text-muted text-lg"
        >
          ←
        </button>

        <h1 className="text-2xl font-semibold text-text">
          Rewards History
        </h1>

        <p className="text-sm text-muted">
          Track your earned and redeemed cups
        </p>
      </div>

      {/* Content */}
      <div className="px-5 space-y-3 pb-10">
        {/* Loading */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 rounded-xl bg-bg-surface" />
            <div className="h-20 rounded-xl bg-bg-surface" />
            <div className="h-20 rounded-xl bg-bg-surface" />
          </div>
        )}

        {/* History List */}
        {!loading &&
          history.map((item, i) => (
            <div
              key={i}
              className="
                bg-white
                rounded-xl
                p-4
                shadow-soft
                flex items-center justify-between
              "
            >
              {/* Left */}
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-text">
                  {item.date}
                </p>

                <p className="text-xs text-muted">
                  {item.desc} · {item.store}
                </p>
              </div>

              {/* Right */}
              <div
                className={`text-sm font-medium ${
                  item.points > 0 ? "text-primary" : "text-muted"
                }`}
              >
                {item.points > 0 ? "+" : ""}
                {item.points} cup
                {Math.abs(item.points) !== 1 ? "s" : ""}
              </div>
            </div>
          ))}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="text-center text-sm text-muted pt-10">
            No reward activity yet
          </div>
        )}
      </div>
    </div>
  );
}