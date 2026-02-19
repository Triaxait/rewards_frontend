import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api/customer";
import { useNavigate } from "react-router-dom";

export default function AdminCustomers() {
    const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  

  /* ======================
     FETCH CUSTOMERS
  ====================== */
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/customers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setCustomers(res || []);
      setFiltered(res || []);
    } catch (err) {
      alert(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* ======================
     SEARCH FILTER
  ====================== */
  useEffect(() => {
    const term = search.toLowerCase();

    const results = customers.filter((c) =>
      c.firstName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.mobile?.includes(term)
    );

    setFiltered(results);
  }, [search, customers]);

  return (
    <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
      
      {/* ===== TITLE ===== */}
      <div className="border-b pb-4 border-border flex items-center gap-3">
        <button
          onClick={() => navigate("/admin")}
          className="text-lg text-text"
        >
          ←
        </button>

        <h1 className="text-l font-semibold text-text">Customers</h1>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search by name, email, mobile..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          border border-border
          rounded-lg
          px-3 py-2
          text-sm
          bg-white
          focus:outline-none
          focus:border-primary
        "
      />

      {/* ===== LIST ===== */}
      {loading ? (
        <p className="text-sm text-muted">Loading customers...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted">No customers found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <div
              key={customer.userId}
              className="
                border border-border
                rounded-xl
                px-4 py-3
                bg-white
                space-y-2
              "
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-text">
                  {customer.firstName} {customer.lastName}
                </p>

                <span
                  className={`text-xs font-medium ${
                    customer.currentPoints > 0
                      ? "text-green-600"
                      : "text-muted"
                  }`}
                >
                  {customer.currentPoints} pts
                </span>
              </div>

              <p className="text-xs text-muted">
                {customer.email}
              </p>

              <p className="text-xs text-muted">
                {customer.mobile}
              </p>

              <div className="flex justify-between text-xs text-muted pt-1">
                <span>
                  Paid: {customer.totalPaidCups}
                </span>
                <span>
                  Redeemed: {customer.totalRedeemedCups}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}