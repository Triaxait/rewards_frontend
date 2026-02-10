import { useEffect, useState } from "react";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);

  /* ======================
     API PLACEHOLDER
     ====================== */
  useEffect(() => {
    // TODO: GET /admin/transactions
    setTransactions([
      {
        id: "1",
        user: "Raghav",
        site: "XL CP",
        staff: "Rahul",
        cups: +1,
        type: "PURCHASE",
        date: "12 Aug 2025 · 10:30 AM",
      },
      {
        id: "2",
        user: "Aman",
        site: "XL Gurgaon",
        staff: "Neha",
        cups: -1,
        type: "REDEEM",
        date: "12 Aug 2025 · 11:05 AM",
      },
    ]);
  }, []);

  return (
    <div className="px-5 pt-6 pb-10 space-y-4 max-w-md mx-auto">

      <h1 className="text-2xl font-semibold text-text">
        Transactions
      </h1>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="
            bg-white
            rounded-xl
            p-4
            shadow-soft
            space-y-1
            cursor-pointer
          "
          onClick={() => {
            // TODO: navigate to user detail
            console.log("Open user:", tx.user);
          }}
        >
          {/* Top row */}
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-text">
              {tx.user}
            </p>
            <span
              className={`text-sm font-medium ${
                tx.cups > 0 ? "text-primary" : "text-muted"
              }`}
            >
              {tx.cups > 0 ? "+" : ""}
              {tx.cups} cup
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted">
            {tx.site} · {tx.staff}
          </p>

          <p className="text-xs text-muted">
            {tx.date}
          </p>
        </div>
      ))}

      {transactions.length === 0 && (
        <p className="text-sm text-muted text-center pt-10">
          No transactions found
        </p>
      )}
    </div>
  );
}
