import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api/customer";

export default function AdminStaff() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(null); // email being resent
  

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

    const [sites, setSites] = useState([]);
const [assigningTo, setAssigningTo] = useState(null); // staffUserId
const [selectedSite, setSelectedSite] = useState("");
const [removing, setRemoving] = useState(null); // `${staffUserId}:${siteId}`
const [confirmRemove, setConfirmRemove] = useState(null);
// format: { staffUserId, siteId }



const fetchSites = async () => {
  try {
    const res = await apiFetch("/admin/sites", {
      method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    setSites(res || []);
 
  } catch (err) {
    alert("Failed to load sites");
  }
};

    const openAssign = (staffUserId) => {
  setAssigningTo(staffUserId);
  setSelectedSite("");
  if (sites.length === 0) fetchSites();
};

  /* ======================
     FETCH STAFF
     ====================== */
  const fetchStaff = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/staff", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setStaff(res || []);
   
    } catch (err) {
      alert(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* ======================
     ADD STAFF
     ====================== */
  const addStaff = async () => {
    const { firstName, lastName, email, mobile } = form;
    if (!firstName || !lastName || !email || !mobile) return;

    try {
      setSubmitting(true);

      await apiFetch("/admin/staff/addstaff", {
        method: "POST",
         headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(form),
      });

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
      });

      setShowForm(false);
      fetchStaff();
    } catch (err) {
      alert(err.message || "Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  const resendInvite = async (email) => {
    try {
      setResending(email);

      await apiFetch("/admin/staff/resend-invite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ email }),
      });

      alert("Invitation email sent again");
    } catch (err) {
      alert(err.message || "Failed to resend invite");
    } finally {
      setResending(null);
    }
  };

  const assignSite = async (staffUserId) => {
  if (!selectedSite) return;

  try {
    await apiFetch("/admin/staff/assign-to-site", {
      method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      body: JSON.stringify({
        staffUserId,
        siteId: selectedSite,
      }),
    });

    setAssigningTo(null);
    fetchStaff(); // refresh staff list
  } catch (err) {
    alert(err.message || "Failed to assign site");
  }
};

const removeSite = async (staffUserId, siteId) => {
  try {
    setRemoving(`${staffUserId}:${siteId}`);

    await apiFetch("/admin/staff/remove-from-site", {
      method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      body: JSON.stringify({
        staffUserId,
        siteId,
      }),
    });

    fetchStaff(); // refresh list
  } catch (err) {
    alert(err.message || "Failed to remove site");
  } finally {
    setRemoving(null);
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

        <h1 className="text-l font-semibold text-text">Manage Staff</h1>
        <button
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-primary text-right ml-auto"
          >
            + Add Staff
          </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-5 pt-6 space-y-6">
        {/* Add Staff CTA */}
        

        {/* Add Staff Form */}
        {showForm && (
          <div className="border border-border rounded-xl p-4 space-y-4">
            <input
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            />

            <input
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            />

            <input
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            />

            <input
              placeholder="Mobile number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            />

            <div className="flex gap-3">
              <Button onClick={addStaff} disabled={submitting}>
                {submitting ? "Adding…" : "Add Staff"}
              </Button>

              <button
                onClick={() =>{ setShowForm(false), setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  mobile: "",
                })}}
                className="text-sm text-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Staff List */}
        {loading ? (
          <p className="text-sm text-muted">Loading staff…</p>
        ) : staff.length === 0 ? (
          <p className="text-sm text-muted">No staff added yet.</p>
        ) : (
          <div className="space-y-3">
  {staff.map((member) => (
    <div
      key={member.staffUserId}
      className="
        border border-border
        rounded-xl
        px-4 py-3
        space-y-2
        bg-white
      "
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-text">
          {member.firstName} {member.lastName}
        </p>

        <span className="text-xs text-muted">
          {member.onboarded ? "Active" : "Invitation Pending"}
        </span>
      </div>

      <p className="text-xs text-muted">{member.email}</p>

      <div className="flex flex-wrap gap-2">
  {member.sites.length === 0 ? (
    <p className="text-xs text-muted">
      No site assigned
    </p>
  ) : (
    member.sites.map((site) => (
      

       <div
  key={site.id }
  className="
    flex items-center gap-1
    px-2 py-1
    text-xs
    border border-border
    rounded-full
    bg-bg
  "
>
  <span className="text-text">
    {site.name || site}
  </span>

  {/* NORMAL STATE */}
  {!confirmRemove ||
  confirmRemove.staffUserId !== member.staffUserId ||
  confirmRemove.siteId !== (site.siteid || site) ? (
    <button
      onClick={() =>
        setConfirmRemove({
          staffUserId: member.staffUserId,
          siteId: site.siteId || site,
        })
      }
      className="text-muted hover:text-red-500"
      title="Remove site"
    >
      ×
    </button>
  ) : (
    /* CONFIRM STATE */
    <div className="flex items-center gap-1 ml-1">
      <button
        onClick={() => {
          removeSite(member.staffUserId, site.id || site);
          setConfirmRemove(null);
        }}
        className="text-red-600 font-medium"
      >
        Remove
      </button>

      <button
        onClick={() => setConfirmRemove(null)}
        className="text-muted"
      >
        Cancel
      </button>
    </div>
  )}
</div>

    ))
  )}
</div>


      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-1">
        {/* Resend invite */}
        {!member.onboarded && (
          <button
            onClick={() => resendInvite(member.email)}
            disabled={resending === member.email}
            className="text-xs text-primary font-medium disabled:opacity-50"
          >
            {resending === member.email
              ? "Sending invite…"
              : "Resend invite"}
          </button>
        )}

        {/* Assign site */}
        {member.onboarded && (
          <button
            onClick={() => openAssign(member.staffUserId)}
            className="text-xs text-primary font-medium"
          >
            Assign site
          </button>
        )}
      </div>

      {/* ASSIGN SITE FORM */}
      {assigningTo === member.staffUserId && (
        <div className="pt-3 space-y-3 border-t border-border">
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="
              w-full
              border border-border
              rounded-lg
              px-3 py-2
              text-sm
            "
          >
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={() => assignSite(member.staffUserId)}
              className="text-sm font-medium text-primary"
            >
              Assign
            </button>

            <button
              onClick={() => setAssigningTo(null)}
              className="text-sm text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>

        )
        }
      </div>
    </div>
  );
}
