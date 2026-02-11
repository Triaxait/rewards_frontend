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


        setHistory(res.history);
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

        <h1 className="text-2xl font-semibold text-text">Rewards History</h1>

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
          history.map((item) => {
            const date = new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-soft space-y-3"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text">{date}</p>
                    <p className="text-xs text-muted">{item.storeName}</p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.type === "REDEEM"
                        ? "bg-accent-soft text-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Cups Info */}
                <div className="flex justify-between text-sm">
                  {/* Paid Cups */}
                  {item.paidCups > 0 && (
                    <div className="text-primary font-medium">
                      +{item.paidCups} Paid Cup
                      {item.paidCups !== 1 ? "s" : ""}
                    </div>
                  )}

                  {/* Free Cups (Redeemed) */}
                  {item.freeCups > 0 && (
                    <div className="text-muted font-medium">
                      -{item.freeCups} Free Cup
                      {item.freeCups !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

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
