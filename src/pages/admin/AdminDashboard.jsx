import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    cupsSold: 0,
    cupsRedeemed: 0,
    growthPercent: 0,
  });

  const [graphData, setGraphData] = useState([]);

  /* ======================
     API PLACEHOLDERS
     ====================== */
  useEffect(() => {
    // TODO: GET /admin/dashboard/summary
    setStats({
      customers: 1248,
      cupsSold: 8920,
      cupsRedeemed: 1340,
      growthPercent: 12.4,
    });

    // TODO: GET /admin/dashboard/sales-graph
    setGraphData([
      { month: "Jan", value: 820 },
      { month: "Feb", value: 960 },
      { month: "Mar", value: 1100 },
      { month: "Apr", value: 980 },
      { month: "May", value: 1240 },
      { month: "Jun", value: 1420 },
    ]);
  }, []);

  return (
    <div className="px-5 pt-6 pb-10 space-y-6 max-w-md mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Sales Overview
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Customers"
          value={stats.customers}
        />
        <StatCard
          label="Cups Sold"
          value={stats.cupsSold}
        />
        <StatCard
          label="Cups Redeemed"
          value={stats.cupsRedeemed}
        />
        <StatCard
          label="Monthly Growth"
          value={`${stats.growthPercent}%`}
          highlight={stats.growthPercent > 0}
        />
      </div>

      {/* Graph */}
      <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
        <p className="text-sm font-medium text-text">
          Sales Trend (Last 6 Months)
        </p>

        {/* Graph Placeholder */}
        <div className="h-44 bg-bg rounded-xl flex items-end justify-between px-3 py-2">
          {graphData.map((g, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-4 rounded-md bg-primary/70"
                style={{
                  height: `${(g.value / 1500) * 100}%`,
                }}
              />
              <span className="text-[10px] text-muted">
                {g.month}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted">
          Data updates every 24 hours
        </p>
      </div>
    </div>
  );
}

/* ======================
   SMALL REUSABLE CARD
   ====================== */
function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-soft space-y-1">
      <p className="text-xs text-muted">
        {label}
      </p>
      <p
        className={`text-xl font-semibold ${
          highlight ? "text-primary" : "text-text"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
