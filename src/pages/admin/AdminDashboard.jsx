// import { useEffect, useState } from "react";
// import { apiFetch } from "../../services/api/customer";

// export default function AdminDashboard() {
//   // const [stats, setStats] = useState({
//   //   customers: 0,
//   //   cupsSold: 0,
//   //   cupsRedeemed: 0,
//   //   growthPercent: 0,
//   // });

//   const [graphData, setGraphData] = useState([]);

//   // /* ======================
//   //    API PLACEHOLDERS
//   //    ====================== */
//   // useEffect(() => {
//   //   // TODO: GET /admin/dashboard/summary

//   //   setStats({
//   //     customers: 1248,
//   //     cupsSold: 8920,
//   //     cupsRedeemed: 1340,
//   //     growthPercent: 12.4,
//   //   });

//   //   // TODO: GET /admin/dashboard/sales-graph
//   //   setGraphData([
//   //     { month: "Jan", value: 820 },
//   //     { month: "Feb", value: 960 },
//   //     { month: "Mar", value: 1100 },
//   //     { month: "Apr", value: 980 },
//   //     { month: "May", value: 1240 },
//   //     { month: "Jun", value: 1420 },
//   //   ]);
//   // }, []);

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadSummary() {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await apiFetch("/analytics/live", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setStats(res);
//       } catch (err) {
//         console.error("Failed to load dashboard summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadSummary();
//     setGraphData([
//       { month: "Jan", value: 820 },
//       { month: "Feb", value: 960 },
//       { month: "Mar", value: 1100 },
//       { month: "Apr", value: 980 },
//       { month: "May", value: 1240 },
//       { month: "Jun", value: 1420 },
//     ]);
//   }, []);

//   if (loading) {
//     return <div className="text-sm text-muted">Loading dashboard…</div>;
//   }

//   if (!stats) {
//     return <div className="text-sm text-red-500">Failed to load stats</div>;
//   }

//   return (
//     <div className="px-5 pt-6 pb-10 space-y-6 max-w-md mx-auto">

//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold text-text">
//           Sales Overview
//         </h1>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 gap-4">
//         <StatCard
//           label="Total Customers"
//           value={stats.totalCustomers}
//         />
//         <StatCard
//           label="Cups Sold"
//           value={stats.cupsSold}
//         />
//         <StatCard
//           label="Cups Redeemed"
//           value={stats.cupsRedeemed}
//         />
//         <StatCard
//           label="Monthly Growth"
//           value={`${stats.growthPercent}%`}
//           highlight={stats.growthPercent > 0}
//         />
//       </div>

//       {/* Graph */}
//       <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
//         <p className="text-sm font-medium text-text">
//           Sales Trend (Last 6 Months)
//         </p>

//         {/* Graph Placeholder */}
//         <div className="h-44 bg-bg rounded-xl flex items-end justify-between px-3 py-2">
//           {graphData.map((g, i) => (
//             <div
//               key={i}
//               className="flex flex-col items-center gap-1"
//             >
//               <div
//                 className="w-4 rounded-md bg-primary/70"
//                 style={{
//                   height: `${(g.value / 1500) * 100}%`,
//                 }}
//               />
//               <span className="text-[10px] text-muted">
//                 {g.month}
//               </span>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ======================
//    SMALL REUSABLE CARD
//    ====================== */
// function StatCard({ label, value, highlight }) {
//   return (
//     <div className="bg-white rounded-xl p-4 shadow-soft space-y-1">
//       <p className="text-xs text-muted">
//         {label}
//       </p>
//       <p
//         className={`text-xl font-semibold ${
//           highlight ? "text-primary" : "text-text"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api/customer";

export default function AdminDashboard() {
  const [liveStats, setLiveStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("accessToken");

        // Run both APIs in parallel (fast)
        const [liveRes, analyticsRes] = await Promise.all([
          apiFetch("/analytics/live", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          apiFetch("/analytics/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setLiveStats(liveRes);
        setAnalytics(analyticsRes);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-muted px-5 pt-6">Loading dashboard…</div>
    );
  }

  if (!liveStats || !analytics) {
    return (
      <div className="text-sm text-red-500 px-5 pt-6">
        Failed to load dashboard
      </div>
    );
  }

  const { cupsSold, cupsRedeemed, totalCustomers } = liveStats;

  const { last7Days, growthPercent } = analytics;

  const maxValue = Math.max(...last7Days.map((d) => d.paidCups), 1);

  return (
    <div className="px-5 pt-6 pb-10 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-text">Sales Overview</h1>

      {/* Existing 3 Cards + Growth */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Customers" value={totalCustomers} />
        <StatCard label="Cups Sold" value={cupsSold} />
        <StatCard label="Cups Redeemed" value={cupsRedeemed} />
        <StatCard
          label="Growth (7d)"
          value={`${growthPercent}%`}
          highlight={growthPercent >= 0}
        />
      </div>

      {/* 7 Day Graph */}
      <div className="bg-white rounded-2xl p-4 shadow-soft space-y-3">
        <p className="text-sm font-medium text-text">
          Sales Trend (Last 7 Days)
        </p>

        <div className="h-44 bg-bg rounded-xl px-3 py-2">
          <div className="h-full flex items-end justify-between">
            {last7Days.map((g, i) => {
              const value = g.paidCups || 0;

              const maxValue = Math.max(
                ...last7Days.map((d) => d.paidCups || 0),
                1,
              );

              const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

              const dayLabel = new Date(g.date).toLocaleDateString("en-US", {
                weekday: "short",
              });

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-end h-full"
                >
                  {/* BAR */}
                  <div
                    className="w-6 bg-primary rounded-md transition-all duration-500"
                    style={{
                      height: `${heightPercent}%`,
                      minHeight: value > 0 ? "6px" : "0px",
                    }}
                  />

                  {/* LABEL */}
                  <span className="text-[10px] text-muted mt-1">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Card */
function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-soft space-y-1">
      <p className="text-xs text-muted">{label}</p>
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
