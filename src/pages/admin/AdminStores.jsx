import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api/customer";

export default function AdminStores() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  /* ======================
     FETCH STORES
     ====================== */
  const fetchStores = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Invalid token");
      }
   

      const res = await apiFetch("/admin/sites", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setStores(res || []);

    } catch (err) {
      alert(err.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  /* ======================
     ADD STORE
     ====================== */
  const addStore = async () => {
    if (!form.name.trim() || !form.address.trim()) return;

    try {
      setSubmitting(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Invalid token");
      }
      await apiFetch("/admin/addsite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });

      setForm({ name: "", address: "" });
      setShowForm(false);
      fetchStores();
    } catch (err) {
      alert(err.message || "Failed to add store");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* ===== TOP BAR ===== */}
      <div className="px-5 pt-6 pb-4 border-b border-border flex items-center gap-3">
        <button
          onClick={() => navigate("/admin")}
          className="text-lg text-text"
        >
          ←
        </button>

        <h1 className="text-l font-semibold text-text">Manage Stores</h1>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm font-medium text-primary text-right ml-auto"
        >
          + Add Store
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-5 pt-6 space-y-6">
        {/* Add Store Form */}
        {showForm && (
          <div className="border border-border rounded-xl p-4 space-y-4">
            <input
              placeholder="Store name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="
                w-full
                border border-border
                bg-white
                rounded-lg
                px-3 py-2
                text-sm
                focus:outline-none
                focus:border-primary
              "
            />

            <input
              placeholder="Store address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="
                w-full
                border border-border
                bg-white
                rounded-lg
                px-3 py-2
                text-sm
                focus:outline-none
                focus:border-primary
              "
            />

            <div className="flex gap-3">
              <Button onClick={addStore} disabled={submitting}>
                {submitting ? "Adding…" : "Add Store"}
              </Button>

              <button
                onClick={() => {setShowForm(false),
                setForm({
                  name: "",
                  address: "",
                })
                }}
                className="text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Store List */}
        {loading ? (
          <p className="text-sm text-muted">Loading stores…</p>
        ) : stores.length === 0 ? (
          <p className="text-sm text-muted">No stores added yet.</p>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="
                  border border-border
                  bg-white
                  rounded-xl
                  px-4 py-3
                  flex justify-between items-start
                "
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-text">{store.name}</p>
                  <p className="text-xs text-muted">{store.address}</p>
                </div>

                <span className="text-xs text-muted">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
