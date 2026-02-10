import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api/customer";

export default function StaffTransaction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const qrToken = params.get("qrToken");
  const siteId = params.get("siteId");

  const [customer, setCustomer] = useState(null);
  const [paidCups, setPaidCups] = useState(1);
  const [redeemCups, setRedeemCups] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD CUSTOMER
     ====================== */
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const res = await apiFetch("/staff/scan-qr", {
          method: "POST",
           headers: {
            Authorization : `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
        },
          body: JSON.stringify({ qrToken, siteId }),
        });

        setCustomer(res.customer);
        setRedeemCups(
          res.customer.freeCupsAvailable > 0 ? 1 : 0
        );
      } catch (err) {
        alert(err.message || "Failed to load customer");
        navigate("/staff");
      }
    };

    loadCustomer();
  }, [qrToken, navigate]);

  /* ======================
     TRANSACTION
     ====================== */
  const submit = async () => {
    try {
      setLoading(true);

      await apiFetch("/staff/transact-cups", {
        method: "POST",
        headers: {
            Authorization : `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          siteId,
          paidCups,
          redeemCups,
        }),
      });

      navigate("/staff");
    } catch (err) {
      alert(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-bg px-5 pt-6 space-y-6 max-w-md mx-auto">

      {/* Header */}
      <h1 className="text-lg font-semibold text-text text-center">
        Complete Transaction
      </h1>

      {/* Customer Card */}
      <div className="bg-white border border-border rounded-2xl p-4 space-y-1">
        <p className="text-sm font-medium text-text">
          {customer.firstName} {customer.lastName}
        </p>
        <p className="text-xs text-muted">
          {customer.email}
        </p>
      </div>

      {/* Rewards Summary */}
      <div className="bg-white border border-border rounded-2xl p-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-muted">Current Points</p>
          <p className="text-lg font-semibold text-text">
            {customer.points}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted">Free Cups</p>
          <p className="text-lg font-semibold text-text">
            {customer.freeCupsAvailable}
          </p>
        </div>
      </div>

      {/* Paid Cups */}
      <Counter
        label="Paid cups"
        value={paidCups}
        onChange={setPaidCups}
        min={1}
      />

      {/* Redeem Cups */}
      <Counter
        label="Redeem free cups"
        value={redeemCups}
        onChange={setRedeemCups}
        min={0}
        max={customer.freeCupsAvailable}
        disabled={customer.freeCupsAvailable === 0}
      />

      {/* CTA */}
      <Button
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Processing…" : "Complete Transaction"}
      </Button>
    </div>
  );
}

/* ======================
   COUNTER COMPONENT
   ====================== */
function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  disabled = false,
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 space-y-3">
      <p className="text-sm font-medium text-text">
        {label}
      </p>

      <div className="flex justify-between items-center">
        <button
          disabled={value <= min || disabled}
          onClick={() => onChange(value - 1)}
          className="w-9 h-9 rounded-full border border-border text-lg disabled:opacity-40"
        >
          −
        </button>

        <span className="text-lg font-semibold text-text">
          {value}
        </span>

        <button
          disabled={value >= max || disabled}
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-full border border-border text-lg disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
