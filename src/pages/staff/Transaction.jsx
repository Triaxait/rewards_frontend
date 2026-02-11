import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api/customer";

export default function StaffTransaction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const qrToken = params.get("qrToken");
  const siteId = params.get("siteId");

  const [customer, setCustomer] = useState(null);
  const [paidCups, setPaidCups] = useState(0);
  const [redeemCups, setRedeemCups] = useState(0);
  const [loading, setLoading] = useState(false);

  const REWARD_THRESHOLD = 5;

  /* ======================
     LOAD CUSTOMER
     ====================== */
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const res = await apiFetch("/staff/scan-qr", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrToken, siteId }),
        });

        setCustomer(res.customer);
      } catch (err) {
        alert(err.message || "Failed to load customer");
        navigate("/staff");
      }
    };

    loadCustomer();
  }, [qrToken, siteId, navigate]);

  /* ======================
     PREVIEW CALCULATION
     ====================== */
  const preview = useMemo(() => {
    if (!customer) return null;

    const totalPoints = customer.points + paidCups;
    const newFreeFromPoints = Math.floor(
      totalPoints / REWARD_THRESHOLD
    );
    const remainingPoints =
      totalPoints % REWARD_THRESHOLD;

    const totalFreeAvailable =
      customer.freeCupsAvailable + newFreeFromPoints;

    return {
      newFreeFromPoints,
      remainingPoints,
      totalFreeAvailable,
    };
  }, [customer, paidCups]);

  /* ======================
     AUTO ADJUST REDEEM
     ====================== */
  useEffect(() => {
    if (!preview) return;

    if (redeemCups > preview.totalFreeAvailable) {
      setRedeemCups(preview.totalFreeAvailable);
    }
  }, [preview, redeemCups]);

  /* ======================
     TRANSACTION
     ====================== */
  const submit = async () => {
    try {
      setLoading(true);

      await apiFetch("/staff/transact-cups", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

  const isInvalid =
    !customer ||
    (paidCups === 0 && redeemCups === 0) ||
    redeemCups > (preview?.totalFreeAvailable ?? 0);

  if (!customer || !preview) return null;

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
        <p className="text-xs text-muted">{customer.email}</p>
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
        min={0}
      />

      {preview.newFreeFromPoints > 0 && (
        <p className="text-xs text-primary -mt-4">
          🎉 {preview.newFreeFromPoints} new free cup
          {preview.newFreeFromPoints > 1 ? "s" : ""} unlocked!
        </p>
      )}

      {/* Redeem Cups */}
      <Counter
        label="Redeem free cups"
        value={redeemCups}
        onChange={setRedeemCups}
        min={0}
        max={preview.totalFreeAvailable}
        disabled={preview.totalFreeAvailable === 0}
      />

      {/* Preview Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-medium text-text">
          After Transaction
        </p>

        <p className="text-xs text-muted">
          Remaining Points:{" "}
          <span className="font-medium text-text">
            {preview.remainingPoints}
          </span>
        </p>

        <p className="text-xs text-muted">
          Free Cups Available:{" "}
          <span className="font-medium text-text">
            {preview.totalFreeAvailable - redeemCups}
          </span>
        </p>
      </div>

      {/* CTA */}
      <Button onClick={submit} disabled={loading || isInvalid}>
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
      <p className="text-sm font-medium text-text">{label}</p>

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